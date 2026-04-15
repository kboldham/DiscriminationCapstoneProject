"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserRow {
  id:        string;
  name:      string | null;
  email:     string;
  role:      string;
  createdAt: string;
  _count:    { reports: number; appointments: number };
}

const NAV = [
  { href: "/admin",              label: "Dashboard"    },
  { href: "/admin/reports",      label: "Reports"      },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/slots",        label: "Time Slots"   },
  { href: "/admin/users",        label: "Users", active: true },
];

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers]               = useState<UserRow[]>([]);
  const [loading, setLoading]           = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [feedback, setFeedback]         = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/dashboard");
    if (status === "authenticated") fetchUsers();
  }, [status]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  async function handleSetRole(userId: string, newRole: "user" | "admin") {
    setActionUserId(userId);
    const res = await fetch("/api/admin/users", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ userId, action: "setRole", role: newRole }),
    });
    if (res.ok) {
      setFeedback({ type: "success", msg: `Role updated to ${newRole}.` });
      await fetchUsers();
    } else {
      const d = await res.json();
      setFeedback({ type: "error", msg: d.error ?? "Failed to update role." });
    }
    setActionUserId(null);
  }

  async function handleResetPassword(userId: string, email: string) {
    setActionUserId(userId);
    const res = await fetch("/api/admin/users", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ userId, action: "resetPassword" }),
    });
    if (res.ok) {
      setFeedback({ type: "success", msg: `Password reset email sent to ${email}.` });
    } else {
      setFeedback({ type: "error", msg: "Failed to send reset email." });
    }
    setActionUserId(null);
  }

  async function handleDelete(userId: string) {
    setActionUserId(userId);
    const res = await fetch("/api/admin/users", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ userId }),
    });
    if (res.ok) {
      setFeedback({ type: "success", msg: "User deleted." });
      setConfirmDelete(null);
      await fetchUsers();
    } else {
      const d = await res.json();
      setFeedback({ type: "error", msg: d.error ?? "Failed to delete user." });
    }
    setActionUserId(null);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748B", fontFamily: "var(--font-body)" }}>Loading...</p>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0F172A", display: "flex" }}>

      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#0A1628", borderRight: "1px solid #1E293B", padding: "1.5rem 0", flexShrink: 0 }}>
        <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid #1E293B" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#F1F5F9", fontWeight: 700 }}>Speak Equal</div>
          <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "0.2rem" }}>Admin Portal</div>
        </div>
        <nav style={{ padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV.map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.55rem 0.75rem", borderRadius: "8px",
              color:        active ? "#F1F5F9" : "#94A3B8",
              background:   active ? "#1E293B" : "transparent",
              textDecoration: "none", fontSize: "0.875rem",
            }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", padding: "0 0.75rem 1rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 0.75rem", color: "#64748B", textDecoration: "none", fontSize: "0.8rem" }}>
            Back to site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, padding: "2rem", overflowX: "auto" }}>

        {/* Feedback banner */}
        {feedback && (
          <div style={{
            marginBottom: "1.25rem",
            padding: "0.875rem 1.25rem",
            borderRadius: "10px",
            background: feedback.type === "success" ? "#D1FAE5" : "#FEE2E2",
            border: `1px solid ${feedback.type === "success" ? "#6EE7B7" : "#FECACA"}`,
            color: feedback.type === "success" ? "#065F46" : "#991B1B",
            fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600,
          }}>
            {feedback.msg}
          </div>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "#F1F5F9" }}>Users</h1>
          <p style={{ color: "#64748B", fontSize: "0.85rem" }}>{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
        </div>

        {users.length === 0 ? (
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "16px", padding: "4rem", textAlign: "center" }}>
            <p style={{ color: "#64748B", fontFamily: "var(--font-body)" }}>No users found.</p>
          </div>
        ) : (
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155" }}>
                  {["Name / Email", "Role", "Reports", "Appointments", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.875rem 1rem", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isSelf    = u.id === session?.user?.id;
                  const isWorking = actionUserId === u.id;
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #1E293B" }}>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <p style={{ color: "#CBD5E1", fontWeight: 600 }}>{u.email}</p>
                        <p style={{ color: "#64748B", fontSize: "0.75rem" }}>{u.email}</p>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{
                          background: u.role === "admin" ? "#1E3A5F" : "#1E293B",
                          color:      u.role === "admin" ? "#60A5FA" : "#94A3B8",
                          border:     `1px solid ${u.role === "admin" ? "#2563EB" : "#334155"}`,
                          fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px", textTransform: "uppercase",
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", color: "#CBD5E1", textAlign: "center" }}>{u._count.reports}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "#CBD5E1", textAlign: "center" }}>{u._count.appointments}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "#64748B", whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        {confirmDelete === u.id ? (
                          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ color: "#F87171", fontSize: "0.78rem", fontFamily: "var(--font-body)" }}>Are you sure?</span>
                            <button
                              onClick={() => handleDelete(u.id)}
                              disabled={isWorking}
                              style={{ background: "#7F1D1D", color: "#FCA5A5", border: "none", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600 }}
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              style={{ background: "#334155", color: "#94A3B8", border: "none", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            {/* Role toggle */}
                            <button
                              onClick={() => handleSetRole(u.id, u.role === "admin" ? "user" : "admin")}
                              disabled={isSelf || isWorking}
                              title={isSelf ? "Cannot change your own role" : undefined}
                              style={{
                                background: "#1E293B", color: isSelf ? "#475569" : "#94A3B8",
                                border: "1px solid #334155", borderRadius: "6px",
                                padding: "0.25rem 0.6rem", fontSize: "0.75rem",
                                cursor: isSelf ? "not-allowed" : "pointer",
                                fontFamily: "var(--font-body)",
                              }}
                            >
                              {u.role === "admin" ? "Demote" : "Promote"}
                            </button>

                            {/* Reset password */}
                            <button
                              onClick={() => handleResetPassword(u.id, u.email)}
                              disabled={isWorking}
                              style={{ background: "#1E3A5F", color: "#60A5FA", border: "1px solid #2563EB", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}
                            >
                              Reset Password
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setConfirmDelete(u.id)}
                              disabled={isSelf || isWorking}
                              title={isSelf ? "Cannot delete your own account" : undefined}
                              style={{
                                background: "#450A0A", color: isSelf ? "#7F1D1D" : "#FCA5A5",
                                border: "1px solid #7F1D1D", borderRadius: "6px",
                                padding: "0.25rem 0.6rem", fontSize: "0.75rem",
                                cursor: isSelf ? "not-allowed" : "pointer",
                                fontFamily: "var(--font-body)",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
