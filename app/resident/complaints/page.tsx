"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type ComplaintStatus = "In review" | "Resolved";

type Complaint = {
  id: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  location: string;
  createdAt: string;
  photoName?: string;
};

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "C-3128",
    subject: "Overflowing bin",
    description: "Overflowing bin at Borella",
    status: "Resolved",
    location: "Borella",
    createdAt: "2026-05-09",
    photoName: "bin.jpg",
  },
  {
    id: "C-3129",
    subject: "Missed pickup",
    description: "Missed pickup at Nugegoda Lane 3",
    status: "In review",
    location: "Nugegoda Lane 3",
    createdAt: "2026-05-11",
  },
  {
    id: "C-3130",
    subject: "Illegal dumping",
    description: "Illegal dumping near Wellawatte beach",
    status: "In review",
    location: "Wellawatte beach",
    createdAt: "2026-05-12",
    photoName: "dumping.jpg",
  },
];

export default function ComplaintsPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [geoLoading, setGeoLoading] = useState(false);
  const [message, setMessage] = useState<"" | "success" | "error">("");

  const canSubmit = subject.trim().length > 0 && description.trim().length > 0;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
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

  const handleSubmit = () => {
    if (!canSubmit) {
      setMessage("error");
      return;
    }

    const nextComplaint: Complaint = {
      id: `C-${Math.floor(4000 + Math.random() * 5000)}`,
      subject,
      description,
      status: "In review",
      location: location || "Not provided",
      createdAt: new Date().toISOString().slice(0, 10),
      photoName: photoName || undefined,
    };

    setComplaints((current) => [nextComplaint, ...current]);
    setSubject("");
    setDescription("");
    setPhotoName(null);
    setMessage("success");
  };

  const statusCounts = useMemo(
    () => ({
      inReview: complaints.filter((c) => c.status === "In review").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
    }),
    [complaints]
  );

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
            />
          </label>

          <label className={styles.inputGroup}>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue. Our AI will tag and prioritize it."
            />
          </label>

          <div className={styles.actionRow}>
            <label className={styles.fileButton}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              Photo
              {photoName ? <span className={styles.fileLabel}>{photoName}</span> : null}
            </label>

            <button type="button" className={styles.locationButton} onClick={handleLocation}>
              {geoLoading ? "Locating…" : "Location"}
            </button>
          </div>

          <button type="button" className={styles.submitButton} onClick={handleSubmit} disabled={!canSubmit}>
            Submit
          </button>

          <div className={styles.aiHint}>AI suggestion: Add nearby landmark for faster resolution.</div>

          {message === "success" && <div className={styles.messageSuccess}>Complaint submitted and is now in review.</div>}
          {message === "error" && <div className={styles.messageError}>Please fill subject and description, or allow location access.</div>}
        </section>

        <section className={styles.listCard}>
          <div className={styles.notificationPill}>
            <span>{statusCounts.inReview} in review</span>
            <span>{statusCounts.resolved} resolved</span>
          </div>

          {complaints.map((complaint) => (
            <article key={complaint.id} className={styles.complaintItem}>
              <div className={styles.complaintMeta}>
                <span className={styles.complaintId}>#{complaint.id}</span>
                <span className={
                  complaint.status === "Resolved" ? styles.statusResolved : styles.statusReview
                }>
                  {complaint.status}
                </span>
              </div>
              <h3>{complaint.subject}</h3>
              <p>{complaint.description}</p>
              <div className={styles.complaintFooter}>
                <span>{complaint.location}</span>
                <span>{complaint.photoName ? "Photo evidence attached" : "No photo attached"}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
