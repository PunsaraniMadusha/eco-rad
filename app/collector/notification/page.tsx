"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { subscribeToNotifications, markAllRead, Notification } from "@/lib/notifications";

function formatTime(createdAt: any) {
  if (!createdAt) return "Just now";
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffInSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSecs < 60) return "Just now";
  if (diffInSecs < 3600) return `${Math.floor(diffInSecs / 60)}m ago`;
  if (diffInSecs < 86400) return `${Math.floor(diffInSecs / 3600)}h ago`;
  if (diffInSecs < 172800) return "Yesterday";
  return date.toLocaleDateString();
}

export default function CollectorNotificationPage() {
  const { profile, user } = useAuth();
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTruck = async () => {
      try {
        const vehicleDoc = await getDoc(doc(db, "activeVehicles", user.uid));
        if (vehicleDoc.exists()) {
          setVehicleData(vehicleDoc.data());
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      }
    };
    fetchTruck();

    const unsubscribe = subscribeToNotifications(user.uid, (items) => {
      setNotifications(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (user) {
      await markAllRead(user.uid);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "truck":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        );
      case "verified":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case "reward":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>
        );
      case "resolved":
      case "announcement":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        );
      default:
        return (
           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "reward": return "bg-[#FFF4E5]";
      default: return "bg-[#E6F4EA]";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "reward": return "text-[#D97706]";
      default: return "text-[#2E7D32]";
    }
  };

  return (
    <div className="collector-main">
        <div className="text-gray-400 text-sm mb-4 font-semibold uppercase tracking-wider">Collectors-Notification</div>



        {/* Content Area */}
        <div className="space-y-6">
          {/* Greeting Card */}
          <div className="bg-gradient-to-r from-[#DBF2DC] to-[#E9F7E9] rounded-[32px] p-8 flex justify-between items-center relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-[0.2em] mb-1 block">Collector</span>
              <h1 className="text-[36px] font-bold text-gray-800 leading-tight">
                Hello,<span className="text-[#55B56F]">{profile?.fullName?.split(" ")[0] || "Collector"}!</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">Working with Truck {vehicleData?.id || "N/A"} · Zone {vehicleData?.area || profile?.district || "N/A"}</p>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Simple Progress Ring */}
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#FFFFFF" strokeWidth="12" fill="transparent" />
                <circle
                  cx="80" cy="80" r="70"
                  stroke="#55B56F" strokeWidth="12" fill="transparent"
                  strokeDasharray="440" strokeDashoffset={440 * (1 - 0.82)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[32px] font-black text-gray-800 leading-none">82%</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Tasks</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">Today</span>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-white/60 min-h-[400px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-800">Recent Notifications</h2>
               <button
                 onClick={handleMarkAllRead}
                 className="text-xs font-bold text-[#2E7D32] hover:underline"
               >
                 Mark all as read
               </button>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                 <div className="p-8 text-center text-gray-400 font-medium">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                 <div className="p-8 text-center text-gray-400 font-medium">No notifications yet.</div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors ${!notif.read ? 'bg-[#F9FFF9]' : ''}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconBg(notif.type)} ${getIconColor(notif.type)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-[15px] font-bold text-gray-800">{notif.title}</h3>
                        <p className="text-[13px] text-gray-500 font-medium">{notif.description}</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-gray-400">{formatTime(notif.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="p-8"></div>
          </div>
        </div>
    </div>
  );
}
