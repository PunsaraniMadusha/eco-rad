"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

type ComplaintStatus = "In review" | "Resolved";

type Complaint = {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority?: "High" | "Medium" | "Low";
  location: string;
  photoUrl?: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
  updatedAt: Timestamp | { seconds: number; nanoseconds: number } | null;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ComplaintsPage() {
  const { user, profile } = useAuth();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [message, setMessage] = useState<"" | "success" | "error" | "auth-error" | "permission-denied" | "index-needed">("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "complaints"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Complaint[];
        setComplaints(docs);
      },
      (error) => {
        console.error("Error fetching complaints:", error);
        if (error.code === "permission-denied") {
          setMessage("permission-denied");
        } else if (error.message.includes("index")) {
          setMessage("index-needed");
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const canSubmit = subject.trim().length > 0 && description.trim().length > 0 && !submitLoading;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleLocation = async () => {
    if (!navigator.geolocation) {
      setMessage("error");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setGeoLoading(false);
      },
      () => {
        setMessage("error");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setMessage("error");
      return;
    }

    if (!user || !profile) {
      setMessage("auth-error");
      return;
    }

    setSubmitLoading(true);
    setMessage("");
    setLoadingStage(1);

    try {
      await sleep(800);
      let photoUrl = "";
      if (photoFile) {
        const storageRef = ref(storage, `complaints/${user.uid}/${Date.now()}_${photoFile.name}`);
        const uploadResult = await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(uploadResult.ref);
      }

      setLoadingStage(2);
      await sleep(800);

      setLoadingStage(3);
      let classifiedPriority = "Low";
      try {
        const response = await fetch("/api/classify-complaint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject, description }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.priority) {
            classifiedPriority = data.priority;
          }
        }
      } catch (err) {
        console.error("Failed to classify priority:", err);
      }

      setLoadingStage(4);
      await sleep(800);

      setLoadingStage(5);
      await addDoc(collection(db, "complaints"), {
        userId: user.uid,
        userName: profile.fullName,
        subject,
        description,
        status: "In review",
        priority: classifiedPriority,
        location: location || "Not provided",
        photoUrl: photoUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await sleep(800);

      setSubject("");
      setDescription("");
      setPhotoFile(null);
      setLocation("");
      setMessage("success");
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      if (error.code === "permission-denied") {
        setMessage("permission-denied");
      } else {
        setMessage("error");
      }
    } finally {
      setSubmitLoading(false);
      setLoadingStage(0);
    }
  };

  const statusCounts = useMemo(
    () => ({
      inReview: complaints.filter((c) => c.status === "In review").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
    }),
    [complaints]
  );

  const formatDate = (timestamp: Timestamp | { seconds: number; nanoseconds: number } | null) => {
    if (!timestamp) return "Just now";
    const date = (timestamp as Timestamp).toDate ? (timestamp as Timestamp).toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.pageRoot}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.pageOverline}>AI Complaint Center</p>
          <h1 className={styles.pageTitle}>Submit issues — our AI categorizes and routes them automatically.</h1>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2>File a complaint</h2>
          </div>

          <label className={styles.inputGroup}>
            <span>Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject (e.g. Missed pickup)"
              disabled={submitLoading}
            />
          </label>

          <label className={styles.inputGroup}>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue. Our AI will tag and prioritize it."
              disabled={submitLoading}
            />
          </label>

          <div className={styles.actionRow}>
            <label className={styles.fileButton}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={submitLoading} />
              Photo
              {photoFile ? <span className={styles.fileLabel}>{photoFile.name}</span> : null}
            </label>

            <button type="button" className={styles.locationButton} onClick={handleLocation} disabled={submitLoading}>
              {geoLoading ? "Locating…" : "Location"}
            </button>
          </div>

          <button type="button" className={styles.submitButton} onClick={handleSubmit} disabled={!canSubmit}>
            {submitLoading ? "Submitting..." : "Submit"}
          </button>

          <div className={styles.aiHint}>AI suggestion: Add nearby landmark for faster resolution.</div>

          {message === "success" && <div className={styles.messageSuccess}>Complaint submitted and is now in review.</div>}
          {message === "error" && <div className={styles.messageError}>Please fill subject and description, or allow location access.</div>}
          {message === "auth-error" && <div className={styles.messageError}>Please sign in to submit a complaint.</div>}
          {message === "permission-denied" && <div className={styles.messageError}>Permission denied. Please check your Firestore rules.</div>}
          {message === "index-needed" && <div className={styles.messageError}>Firestore index required. Please check your console logs for the link.</div>}
        </section>

        <section className={styles.listCard}>
          <div className={styles.notificationPill}>
            <span>{statusCounts.inReview} in review</span>
            <span>{statusCounts.resolved} resolved</span>
          </div>

          {complaints.length === 0 ? (
            <p className={styles.emptyState}>No complaints found.</p>
          ) : (
            complaints.map((complaint) => (
              <article key={complaint.id} className={styles.complaintItem}>
                <div className={styles.complaintMeta}>
                  <span className={styles.complaintId}>#{complaint.id.slice(0, 8)}</span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {complaint.priority && (
                      <span className={`${styles.priorityBadge} ${styles["prio" + complaint.priority]}`}>
                        {complaint.priority}
                      </span>
                    )}
                    <span className={
                      complaint.status === "Resolved" ? styles.statusResolved : styles.statusReview
                    }>
                      {complaint.status}
                    </span>
                  </div>
                </div>
                <h3>{complaint.subject}</h3>
                <p>{complaint.description}</p>
                <div className={styles.complaintFooter}>
                  <span>{complaint.location}</span>
                  <span>{complaint.photoUrl ? "Photo evidence attached" : "No photo attached"}</span>
                  <span className={styles.dateLabel}>{formatDate(complaint.createdAt)}</span>
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      {submitLoading && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.circularLoader}></div>
            <h3 className={styles.modalTitle}>AI Complaint Assistant</h3>
            <p className={styles.modalSubtitle}>Analyzing and routing your issue...</p>

            <ul className={styles.modalStageList}>
              <li className={loadingStage >= 1 ? (loadingStage > 1 ? styles.stageCompleted : styles.stageActive) : styles.stagePending}>
                <span className={styles.stageIcon}>{loadingStage > 1 ? "✓" : (loadingStage === 1 ? "⏳" : "○")}</span>
                <span>Scanning attachments</span>
              </li>
              <li className={loadingStage >= 2 ? (loadingStage > 2 ? styles.stageCompleted : styles.stageActive) : styles.stagePending}>
                <span className={styles.stageIcon}>{loadingStage > 2 ? "✓" : (loadingStage === 2 ? "⏳" : "○")}</span>
                <span>Analyzing subject lines</span>
              </li>
              <li className={loadingStage >= 3 ? (loadingStage > 3 ? styles.stageCompleted : styles.stageActive) : styles.stagePending}>
                <span className={styles.stageIcon}>{loadingStage > 3 ? "✓" : (loadingStage === 3 ? "⏳" : "○")}</span>
                <span>Analyzing with AI (Gemini)</span>
              </li>
              <li className={loadingStage >= 4 ? (loadingStage > 4 ? styles.stageCompleted : styles.stageActive) : styles.stagePending}>
                <span className={styles.stageIcon}>{loadingStage > 4 ? "✓" : (loadingStage === 4 ? "⏳" : "○")}</span>
                <span>Prioritizing issue severity</span>
              </li>
              <li className={loadingStage >= 5 ? (loadingStage > 5 ? styles.stageCompleted : styles.stageActive) : styles.stagePending}>
                <span className={styles.stageIcon}>{loadingStage > 5 ? "✓" : (loadingStage === 5 ? "⏳" : "○")}</span>
                <span>Saving prioritized complaint</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
