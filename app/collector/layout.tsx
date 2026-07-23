"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RoleGuard } from "@/components/RoleGuard";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/collector",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
  },
  {
    label: "Tasks",
    href: "/collector/tasks",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
      </svg>
    ),
  },
  {
    label: "Notifications",
    href: "/collector/notification",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/collector/profile",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
];

export default function CollectorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "C";
    return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <RoleGuard allowedRole="collector">
      <div className="collector-layout-root flex min-h-screen bg-[#F1F5F0] font-sans">

        {/* Sidebar */}
        <aside className={`collector-layout-sidebar w-64 bg-white/50 p-6 flex flex-col gap-8 flex-shrink-0 sticky top-0 h-100vh overflow-y-auto ${sidebarOpen ? "collector-layout-sidebar--open" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1F3915]">
              EcoCycle <span className="text-xs block font-normal text-[#2E7D32] -mt-1">LANKA</span>
            </span>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#55B56F] text-white rounded-[12px] shadow-lg shadow-[#55B56F]/20"
                      : "text-gray-600 hover:bg-white rounded-lg hover:text-gray-800"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="collector-layout-overlay"
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") setSidebarOpen(false);
            }}
          />
        )}

        {/* Main Area */}
        <div className="collector-layout-main flex-1 flex flex-col min-w-0">

          {/* Topbar */}
          <header className="collector-layout-topbar h-[70px] bg-white/40 border-b border-white/20 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <button
              className="collector-layout-hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="flex items-center gap-3 bg-white/60 px-4 py-1.5 rounded-full border border-white/40 shadow-sm ml-auto">
              <div className="w-9 h-9 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner">
                {profile?.fullName ? getInitials(profile.fullName) : "C"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 leading-tight">{profile?.fullName || "Collector"}</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">Collector</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="collector-layout-content p-6 flex-1 overflow-y-auto">{children}</main>
        </div>

        <style>{`
          .collector-layout-sidebar {
            transition: left 0.25s cubic-bezier(.22,1,.36,1);
          }
          .collector-layout-hamburger {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            color: #374151;
            padding: 6px;
            border-radius: 8px;
            transition: background 0.15s;
          }
          .collector-layout-hamburger:hover {
            background: #f3f4f6;
          }
          .collector-layout-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 30;
            cursor: pointer;
          }

          @media (max-width: 900px) {
            .collector-layout-sidebar {
              position: fixed;
              left: -260px;
              top: 0;
              z-index: 40;
              height: 100vh;
              width: 260px;
              background: #ffffff !important;
              box-shadow: 4px 0 24px rgba(0,0,0,0.08);
            }
            .collector-layout-sidebar--open {
              left: 0;
            }
            .collector-layout-overlay {
              display: block;
            }
            .collector-layout-hamburger {
              display: flex;
            }
            .collector-layout-content {
              padding: 16px;
            }
          }
        `}</style>
      </div>
    </RoleGuard>
  );
}
