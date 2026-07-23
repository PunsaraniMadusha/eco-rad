"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RoleGuard } from "@/components/RoleGuard";

const sidebarItems = [
  { label: "Overview", href: "/admin/overview", icon: "📊" },
  { label: "Live Tracking", href: "/admin/live-tracking", icon: "📍" },
  { label: "Notification", href: "/admin/notification", icon: "🔔" },
  { divider: true, componentKey: "sep-top" },
  { label: "Residents", href: "/admin/users", icon: "👥" },
  { label: "Employees", href: "/admin/employee", icon: "👨‍💼" },
  { label: "Vehicles", href: "/admin/vehicle", icon: "🚗" },
  { label: "Route Management", href: "/admin/route-management", icon: "🛣️" },
  { label: "Collection Center", href: "/admin/collection-center", icon: "🏬" },
  { divider: true, componentKey: "sep-people" },
  { label: "Reward Management", href: "/admin/reward-management", icon: "🎁" },
  { label: "Reward Store Management", href: "/admin/reward-store-management", icon: "🏪" },
  { label: "Reward Redeem Management", href: "/admin/reward-redeem-management", icon: "🎟️" },
  { divider: true, componentKey: "sep-reward" },
  { label: "Complaints", href: "/admin/complaint", icon: "💬" },
  { label: "Schedules", href: "/admin/schedules", icon: "📅" },
  { divider: true, componentKey: "sep-meta" },
  { label: "Reports", href: "/admin/report", icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If landing or login, do not apply layout
  const isLandingOrLogin = pathname === "/admin" || pathname === "/admin/login";

  if (isLandingOrLogin) {
    return <>{children}</>;
  }

  return (
    <RoleGuard allowedRole="admin">
      <div className="admin-layout-root">

        {/* Sidebar */}
        <aside className={`admin-layout-sidebar ${sidebarOpen ? "admin-layout-sidebar--open" : ""}`}>
          <div className="admin-layout-logo">
            <div className="admin-layout-logo-icon" aria-label="EcoCycle Lanka logo">
              <svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <path d="M32 6c6 4 12 4 16 9 4 5 6 12 4 19-2 7-4 10-6 14-2 4-2 8-4 12-2 4-8 6-14 6s-12-2-14-6c-2-4-2-8-4-12-2-4-4-7-6-14-2-7 0-14 4-19 4-5 10-5 16-9z" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
                <path d="M22 22c3-6 9-9 16-8 7 1 12 6 13 13" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M46 22l3 6-6-1" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M42 42c-3 6-9 9-16 8-7-1-12-6-13-13" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M18 42l-3-6 6 1" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M32 28c6 1 10 6 10 12-6 1-12-2-15-7-1-2-1-4 0-5 2-1 3-1 5 0z" fill="white" opacity="0.95" />
                <path d="M32 40c-1-3-1-6 1-9 2-3 6-5 10-5-1 6-4 11-10 14z" fill="white" opacity="0.85" />
              </svg>
            </div>
            <div>
              <p>EcoCycle</p>
              <small>LANKA</small>
            </div>
          </div>

          <nav className="admin-layout-nav">
            {sidebarItems.map((item) =>
              "divider" in item ? (
                <div key={item.componentKey} className="admin-layout-nav-separator" />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={pathname === item.href ? "admin-layout-nav-item active" : "admin-layout-nav-item"}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="admin-layout-nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="admin-layout-nav-label">{item.label}</span>
                </Link>
              )
            )}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="admin-layout-overlay"
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
        <div className="admin-layout-main">

          {/* Topbar */}
          <header className="admin-layout-topbar">
            <button
              className="admin-layout-hamburger"
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

            <div className="admin-layout-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input placeholder="Search residents, districts, trucks..." readOnly style={{ cursor: "default" }} />
            </div>

            <div className="admin-layout-usercard">
              <div className="admin-layout-avatar">AU</div>
              <div className="admin-layout-user-info">
                <p className="admin-layout-user-name">Admin User</p>
                <p className="admin-layout-user-role">System Admin</p>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="admin-layout-content">{children}</main>
        </div>

        <style>{`
          .admin-layout-root {
            min-height: 100vh;
            background: linear-gradient(180deg, #ecf7ee 0%, #f9fcf8 40%, #fcfefd 100%);
            display: flex;
            font-family: 'DM Sans', sans-serif;
            color: #15251f;
          }

          .admin-layout-sidebar {
            width: 260px;
            background: #ffffff;
            border-right: 1px solid rgba(22, 101, 31, 0.08);
            padding: 28px 20px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            flex-shrink: 0;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
          }

          .admin-layout-logo {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .admin-layout-logo-icon {
            width: 44px;
            height: 44px;
            border-radius: 16px;
            background: #2e7d32;
            color: white;
            display: grid;
            place-items: center;
            font-size: 0.85rem;
            font-weight: 800;
          }

          .admin-layout-logo p {
            margin: 0;
            font-weight: 700;
            font-size: 1rem;
            line-height: 1.2;
          }

          .admin-layout-logo small {
            color: #6b7280;
            font-size: 0.75rem;
          }

          .admin-layout-nav {
            display: grid;
            gap: 6px;
          }

          .admin-layout-nav-item {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            text-decoration: none;
            text-align: left;
            color: #31402c;
            padding: 12px 16px;
            border-radius: 14px;
            transition: all 0.2s ease;
            font-weight: 600;
            font-size: 0.88rem;
          }

          .admin-layout-nav-icon {
            width: 22px;
            display: inline-block;
            text-align: center;
            font-size: 1rem;
          }

          .admin-layout-nav-label {
            flex: 1;
          }

          .admin-layout-nav-item:hover,
          .admin-layout-nav-item.active {
            background: #e6f4e8;
            color: #166529;
          }

          .admin-layout-nav-separator {
            height: 1px;
            border-radius: 999px;
            background: rgba(22, 101, 31, 0.08);
            margin: 6px 0;
          }

          .admin-layout-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
          }

          .admin-layout-topbar {
            height: 70px;
            background: #fff;
            border-bottom: 1px solid rgba(22, 101, 31, 0.08);
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 0 24px;
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .admin-layout-hamburger {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            color: #374151;
            padding: 6px;
            border-radius: 8px;
            transition: background 0.15s;
          }
          .admin-layout-hamburger:hover { background: #f3f4f6; }

          .admin-layout-search {
            flex: 1;
            max-width: 420px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f5f7f5;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 0 12px;
            height: 38px;
          }
          .admin-layout-search input {
            flex: 1;
            border: none;
            background: transparent;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.82rem;
            color: #374151;
            outline: none;
          }
          .admin-layout-search input::placeholder { color: #9ca3af; }

          .admin-layout-usercard {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-left: auto;
          }

          .admin-layout-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #2e7d32;
            color: white;
            display: grid;
            place-items: center;
            font-weight: 700;
            font-size: 0.85rem;
          }

          .admin-layout-user-info {
            display: flex;
            flex-direction: column;
          }

          .admin-layout-user-name {
            margin: 0;
            font-weight: 700;
            font-size: 0.85rem;
            line-height: 1.2;
          }

          .admin-layout-user-role {
            margin: 0;
            color: #6b7280;
            font-size: 0.72rem;
          }

          .admin-layout-content {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
          }

          .admin-layout-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 30;
            cursor: pointer;
          }

          @media (max-width: 820px) {
            .admin-layout-sidebar {
              position: fixed;
              left: -260px;
              top: 0;
              z-index: 40;
              height: 100vh;
              width: 260px;
              transition: left 0.25s cubic-bezier(.22,1,.36,1);
              box-shadow: 4px 0 24px rgba(0,0,0,0.08);
            }
            .admin-layout-sidebar--open {
              left: 0;
            }
            .admin-layout-overlay {
              display: block;
            }
            .admin-layout-hamburger {
              display: flex;
            }
            .admin-layout-search {
              display: none;
            }
            .admin-layout-user-info {
              display: none;
            }
            .admin-layout-content {
              padding: 16px;
            }
          }
        `}</style>
      </div>
    </RoleGuard>
  );
}
