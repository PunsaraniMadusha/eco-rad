"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { loadNotifications, markAllRead, Notification, NotificationType } from "./data";

function iconForType(type: NotificationType) {
  switch (type) {
    case "truck":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "verified":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "reward":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case "resolved":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
          <path d="M15 6h6v6" />
        </svg>
      );
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());

  useEffect(() => {
    // When this page mounts, mark all notifications as read and refresh local state
    markAllRead();
    setNotifications(loadNotifications());
  }, []);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <p className={styles.overline}>Notifications</p>
          <h1 className={styles.title}>Pickup updates, rewards, and announcements.</h1>
        </div>
      </header>

      <div className={styles.notificationCard}>
        <div className={styles.notificationBody}>
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`${styles.notificationItem} ${notification.read ? styles.notificationRead : ""}`}
            >
              <div className={styles.notificationIcon}>{iconForType(notification.type)}</div>
              <div className={styles.notificationText}>
                <strong className={styles.notificationTitle}>{notification.title}</strong>
                <span className={styles.notificationDesc}>{notification.description}</span>
              </div>
              <span className={styles.notificationTime}>{notification.time}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
