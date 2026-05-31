"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const initialProfile = {
  fullName: "",
  email: "",
  phone: "",
  district: "",
  address: "",
  nic: "",
};

export default function ProfilePage() {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [credentials, setCredentials] = useState({
    username: "nimalperera",
    currentPassword: "",
    newPassword: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authProfile) {
      setProfile({
        fullName: authProfile.fullName || "",
        email: authProfile.email || "",
        phone: authProfile.phone || "",
        district: authProfile.district || "",
        address: authProfile.address || "",
        nic: authProfile.nic || "",
      });
    }
  }, [authProfile]);

  const handleChange = (field: keyof typeof initialProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleCredentialChange = (field: keyof typeof credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleCancel = () => {
    if (authProfile) {
      setProfile({
        fullName: authProfile.fullName || "",
        email: authProfile.email || "",
        phone: authProfile.phone || "",
        district: authProfile.district || "",
        address: authProfile.address || "",
        nic: authProfile.nic || "",
      });
    }
    setCredentials({ username: "nimalperera", currentPassword: "", newPassword: "" });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <p className={styles.overline}>Settings</p>
          <h1 className={styles.title}>Manage your account, preferences and privacy.</h1>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeading}>
          <h2>Profile</h2>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.mainSection}>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Full name</span>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>Email</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>Phone</span>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>District</span>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(event) => handleChange("district", event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>NIC</span>
                <input
                  type="text"
                  value={profile.nic}
                  onChange={(event) => handleChange("nic", event.target.value)}
                  placeholder="e.g. 900000000V"
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Address</span>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                />
              </label>
            </div>
          </div>

          <aside className={styles.sidebarSection}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Login details</h3>

              <label className={styles.field}>
                <span>Username</span>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(event) => handleCredentialChange("username", event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>Current password</span>
                <input
                  type="password"
                  value={credentials.currentPassword}
                  onChange={(event) => handleCredentialChange("currentPassword", event.target.value)}
                  placeholder="••••••••"
                />
              </label>

              <label className={styles.field}>
                <span>New password</span>
                <input
                  type="password"
                  value={credentials.newPassword}
                  onChange={(event) => handleCredentialChange("newPassword", event.target.value)}
                  placeholder="••••••••"
                />
              </label>

              <p className={styles.panelNote}>Leave password blank to keep your current password.</p>
            </div>
          </aside>
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className={styles.saveButton} onClick={handleSave}>
            Save changes
          </button>
        </div>

        {saved && <div className={styles.savedMessage}>Your profile changes have been saved.</div>}
      </div>
    </div>
  );
}
