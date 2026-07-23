"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/RoleGuard";



import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function AdminRewardRedeemManagementPage() {
  const pathname = usePathname();
  type RewardRedeemRecord = {
    id: string;
    createdAt: any;
    residentName: string;
    nic: string;
    rewardName: string;
  };

  const [records, setRecords] = useState<RewardRedeemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "redemptions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RewardRedeemRecord[];
      setRecords(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);



  return (
        <div className="admin-main">
        <section className="admin-header-card">
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <span className="admin-chip">REWARD REDEEM MANAGEMENT</span>
              <h1>Reward Redeem Management</h1>
              <p>Track redemptions made by residents, drivers and collectors.</p>
            </div>
            <div style={{ maxWidth: 420 }}>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or NIC"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #cde5d4",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "#1f3420",
                  background: "white",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            {loading ? (
              <div style={{ color: "#556b54" }}>Loading redemption records...</div>
            ) : records.length === 0 ? (
              <div style={{ color: "#556b54" }}>No redemption records yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #e6f4e8" }}>
                      <th style={{ padding: 8 }}>Date</th>
                      <th style={{ padding: 8 }}>Name</th>
                      <th style={{ padding: 8 }}>NIC</th>
                      <th style={{ padding: 8 }}>Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records
                      .filter((r) => {
                        const query = searchTerm.trim().toLowerCase();
                        if (!query) return true;
                        return (
                          r.residentName.toLowerCase().includes(query) ||
                          r.nic.toLowerCase().includes(query)
                        );
                      })
                      .map((r) => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #f3f7f3" }}>
                          <td style={{ padding: 8 }}>
                            {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : "Just now"}
                          </td>
                          <td style={{ padding: 8 }}>{r.residentName}</td>
                          <td style={{ padding: 8 }}>{r.nic}</td>
                          <td style={{ padding: 8 }}>{r.rewardName}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>


      <style>{`
        .admin-root {
          min-height: 100vh;
          background: linear-gradient(180deg, #ecf7ee 0%, #f9fcf8 40%, #fcfefd 100%);
          display: flex;
          gap: 24px;
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
          color: #15251f;
        }

        .admin-sidebar {
          width: 260px;
          background: #ffffff;
          border-radius: 32px;
          box-shadow: 0 20px 50px rgba(23, 63, 31, 0.08);
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: #2e7d32;
          color: white;
          display: grid;
          place-items: center;
          font-size: 1.2rem;
        }

        .admin-logo p {
          margin: 0;
          font-weight: 700;
          font-size: 1rem;
        }

        .admin-logo small {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .admin-nav {
          display: grid;
          gap: 10px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          text-decoration: none;
          text-align: left;
          color: #31402c;
          padding: 14px 18px;
          border-radius: 18px;
          transition: all 0.2s ease;
          font-weight: 600;
        }

        .admin-nav-icon {
          width: 22px;
          display: inline-block;
          text-align: center;
          font-size: 1rem;
        }

        .admin-nav-label {
          flex: 1;
        }

        .admin-nav-item:hover,
        .admin-nav-item.active {
          background: #e6f4e8;
          color: #166529;
        }

        .admin-nav-separator {
          height: 1px;
          border-radius: 999px;
          background: rgba(22, 101, 31, 0.08);
          margin: 10px 0;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
        }

        .admin-top {
          display: flex;
          justify-content: flex-end;
          gap: 18px;
          align-items: center;
        }

        .admin-usercard {
          display: flex;
          align-items: center;
          gap: 14px;
          background: white;
          border-radius: 22px;
          padding: 12px 16px;
          box-shadow: 0 20px 50px rgba(23, 63, 31, 0.06);
        }

        .admin-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #2e7d32;
          color: white;
          display: grid;
          place-items: center;
          font-weight: 700;
        }

        .admin-user-name,
        .admin-user-role {
          margin: 0;
        }

        .admin-user-name {
          font-weight: 700;
        }

        .admin-user-role {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .admin-header-card {
          padding: 28px;
          border-radius: 32px;
          background: linear-gradient(90deg, rgba(241, 253, 244, 0.95), rgba(227, 247, 232, 0.95));
          box-shadow: 0 20px 50px rgba(23, 63, 31, 0.08);
        }

        .admin-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #e6f4e8;
          color: #166529;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .admin-header-card h1 {
          margin: 16px 0 8px;
          font-size: 2rem;
        }

        .admin-header-card p {
          margin: 0;
          color: #556b54;
        }

        @media (max-width: 920px) {
          .admin-root {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>

  );
}
