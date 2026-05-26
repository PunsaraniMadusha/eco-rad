"use client";

import { useState } from "react";
import styles from "./page.module.css";

const initialProfile = {
  fullName: "Nimal Perera",
  email: "nimal@ecocycle.lk",
  phone: "+94 77 234 5678",
  district: "Colombo",
  address: "14/3 Stanley Tilakaratne Mw, Nugegoda",
};

export default function ProfilePage() {
    const [profile, setProfile] = useState(initialProfile);
  const [credentials, setCredentials] = useState({
    username: "nimalperera",
    currentPassword: "",
    newPassword: "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof initialProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleCredentialChange = (field: keyof typeof credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setCredentials({ username: "nimalperera", currentPassword: "", newPassword: "" });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
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
