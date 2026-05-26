export type NotificationType = "truck" | "verified" | "reward" | "resolved";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "truck",
    title: "Truck arriving in 12 min",
    description: "LK-4521 is approaching Nugegoda zone B",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    type: "verified",
    title: "Verified: BC10234",
    description: "+136 points credited to your wallet",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "reward",
    title: "Reward unlocked",
    description: "Free reusable tote at Keells Super",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n4",
    type: "resolved",
    title: "Complaint resolved",
    description: "Overflowing bin · Borella reported by you",
    time: "2d ago",
    read: true,
  },
  {
    id: "n5",
    type: "truck",
    title: "Truck arriving in 12 min",
    description: "LK-4521 is approaching Nugegoda zone B",
    time: "2m ago",
    read: false,
  },
  {
    id: "n6",
    type: "verified",
    title: "Verified: BC10234",
    description: "+136 points credited to your wallet",
    time: "1h ago",
    read: true,
  },
];

const STORAGE_KEY = "eco_notifications_v1";

export function loadNotifications(): Notification[] {
  try {
    const raw = (globalThis.window !== undefined && globalThis.window.localStorage.getItem(STORAGE_KEY)) || null;
    if (raw) return JSON.parse(raw) as Notification[];
  } catch (e) {
    console.warn("Failed to load notifications from storage:", e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(items: Notification[]) {
  try {
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      globalThis.dispatchEvent(new CustomEvent("eco:notifications:changed"));
    }
  } catch (e) {
    console.warn("Failed to save notifications:", e);
  }
}

export function markAllRead() {
  const items = loadNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(items);
}

export function getUnreadCount() {
  return loadNotifications().filter((n) => !n.read).length;
}
