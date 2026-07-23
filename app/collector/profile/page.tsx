"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/RoleGuard";

export default function CollectorProfilePage() {
  const { user, profile: authProfile, loading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    district: "",
    address: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authProfile) {
      setProfile({
        fullName: authProfile.fullName || "",
        email: authProfile.email || "",
        phone: authProfile.phone || "",
        district: authProfile.district || "",
        address: authProfile.address || "",
      });
    }
  }, [authProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map hyphenated IDs to camelCase state keys
    const key = id === "full-name" ? "fullName" : id;
    setProfile(prev => ({ ...prev, [key]: value }));
    if (message) setMessage(null);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsUpdating(true);
    setMessage(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        district: profile.district,
        address: profile.address,
        updatedAt: serverTimestamp(),
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (authProfile) {
      setProfile({
        fullName: authProfile.fullName || "",
        email: authProfile.email || "",
        phone: authProfile.phone || "",
        district: authProfile.district || "",
        address: authProfile.address || "",
      });
    }
    setMessage(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collector/tasks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="collector-main">
        <div className="text-gray-400 text-sm mb-4 font-semibold uppercase tracking-wider">Collectors-Profile</div>



        {/* Profile Card */}
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-white/60">
          <h2 className="text-[24px] font-bold text-gray-800 mb-8">Profile</h2>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label htmlFor="full-name" className="text-[13px] font-medium text-gray-500 ml-1">Full name</label>
              <input
                id="full-name"
                type="text"
                value={profile.fullName}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-[#E9F0E6] rounded-[15px] text-[14px] font-medium text-gray-700 focus:outline-none border-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium text-gray-500 ml-1">Email</label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-[#E9F0E6] rounded-[15px] text-[14px] font-medium text-gray-700 focus:outline-none border-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-[13px] font-medium text-gray-500 ml-1">Phone</label>
              <input
                id="phone"
                type="text"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-[#E9F0E6] rounded-[15px] text-[14px] font-medium text-gray-700 focus:outline-none border-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="district" className="text-[13px] font-medium text-gray-500 ml-1">District</label>
              <input
                id="district"
                type="text"
                value={profile.district}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-[#E9F0E6] rounded-[15px] text-[14px] font-medium text-gray-700 focus:outline-none border-none"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label htmlFor="address" className="text-[13px] font-medium text-gray-500 ml-1">Address</label>
              <input
                id="address"
                type="text"
                value={profile.address}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-[#E9F0E6] rounded-[15px] text-[14px] font-medium text-gray-700 focus:outline-none border-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-12">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="px-8 py-2.5 rounded-full border border-gray-200 text-gray-600 font-bold text-[14px] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-8 py-2.5 rounded-full bg-[#4CAF50] text-white font-bold text-[14px] shadow-lg shadow-[#4CAF50]/20 hover:bg-[#43a047] transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
    </div>
  );
}
