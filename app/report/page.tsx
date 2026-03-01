"use client";

import { useState } from "react";
import Navbar from "../components/navbar";

const DISCRIMINATION_TYPES = [
  { value: "race",              label: "Race" },
  { value: "color",             label: "Color" },
  { value: "religion",          label: "Religion" },
  { value: "sex",               label: "Sex" },
  { value: "national_origin",   label: "National Origin" },
  { value: "age",               label: "Age (40+)" },
  { value: "disability",        label: "Disability" },
  { value: "sexual_orientation",label: "Sexual Orientation" },
  { value: "gender_identity",   label: "Gender Identity or Expression" },
  { value: "familial_status",   label: "Familial Status" },
  { value: "veteran_status",    label: "Veteran Status" },
];

type Tab = "report" | "appointment";
type ReportMode = "form" | "ai";
type ApptMode = "calendar" | "ai";

// ── Fake slots for UI testing — replace with real API call later ──
const MOCK_SLOTS = [
  { id: "s1", startTime: "2026-03-03T09:00:00", endTime: "2026-03-03T09:30:00" },
  { id: "s2", startTime: "2026-03-03T10:00:00", endTime: "2026-03-03T10:30:00" },
  { id: "s3", startTime: "2026-03-04T13:00:00", endTime: "2026-03-04T13:30:00" },
  { id: "s4", startTime: "2026-03-05T14:00:00", endTime: "2026-03-05T14:30:00" },
  { id: "s5", startTime: "2026-03-06T09:00:00", endTime: "2026-03-06T09:30:00" },
];

function formatSlot(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export default function ReportPage() {
  const [tab, setTab]               = useState<Tab>("report");
  const [reportMode, setReportMode] = useState<ReportMode>("form");
  const [apptMode, setApptMode]     = useState<ApptMode>("calendar");

  // ── Report form state ──
  const [reportForm, setReportForm] = useState({
    incidentDate: "", discriminationType: "", description: "",
  });
  const [attachments, setAttachments]   = useState<File[]>([]);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportLoading, setReportLoading]     = useState(false);

  // ── Appointment state ──
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [apptReason, setApptReason]     = useState("");
  const [apptAnon, setApptAnon]         = useState(false);
  const [apptSubmitted, setApptSubmitted] = useState(false);

  // ── AI chat placeholder state ──
  const [chatInput, setChatInput] = useState("");

  async function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReportLoading(true);

    // Upload attachments first (get back URLs), then post report
    // For now this is wired to the real API — works without AI
    try {
      const uploadedAttachments: { fileName: string; fileUrl: string; fileType: string }[] = [];

      for (const file of attachments) {
        const fd = new FormData();
        fd.append("file", file);
        const res  = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        uploadedAttachments.push(data);
      }

      await fetch("/api/reports", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reportForm, attachments: uploadedAttachments }),
      });

      setReportSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  }

  async function handleApptSubmit() {
    if (!selectedSlot) return;
    await fetch("/api/appointments", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: selectedSlot,
        reason: apptReason,
        source: "calendar",
        anonymous: apptAnon,
      }),
    });
    setApptSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section style={{
          background: "linear-gradient(135deg, #0f2d5e 0%, #1E4D8C 100%)",
          padding:    "4rem 1.5rem 3rem",
          textAlign:  "center",
        }}>
          <span className="section-label" style={{ color: "#7dd3fc", display: "block", marginBottom: "0.75rem" }}>
            Speak Equal
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff", marginBottom: "0.75rem" }}>
            File a Report or Schedule an Appointment
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.8)", maxWidth: "520px", margin: "0 auto", fontSize: "0.95rem", lineHeight: 1.7 }}>
            You may submit reports and schedule appointments anonymously. Creating an account lets you track your report status.
          </p>
        </section>

        {/* ── TAB SWITCHER ── */}
        <div style={{ background: "var(--color-bg-card)", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 1.5rem", display: "flex" }}>
            {(["report", "appointment"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding:        "1rem 1.5rem",
                  fontFamily:     "var(--font-body)",
                  fontWeight:     tab === t ? 600 : 400,
                  fontSize:       "0.925rem",
                  color:          tab === t ? "var(--color-primary)" : "var(--color-text-secondary)",
                  background:     "none",
                  border:         "none",
                  borderBottom:   tab === t ? "2px solid var(--color-primary)" : "2px solid transparent",
                  cursor:         "pointer",
                  textTransform:  "capitalize",
                  transition:     "all 0.15s",
                }}
              >
                {t === "report" ? "File a Report" : "Schedule Appointment"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* ════════════════════════════ REPORT TAB ════════════════════════════ */}
          {tab === "report" && (
            <>
              {reportSubmitted ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}></div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", marginBottom: "0.75rem" }}>Report Submitted</h2>
                  <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>
                    Thank you. The Durham Human Relations Commission will review your report.
                    If you created an account, you can track its status in your dashboard.
                  </p>
                  <button onClick={() => setReportSubmitted(false)} className="btn-outline" style={{ marginTop: "1.5rem" }}>
                    Submit another report
                  </button>
                </div>
              ) : (
                <>
                  {/* Mode toggle */}
                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem" }}>
                    {(["form", "ai"] as ReportMode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setReportMode(m)}
                        style={{
                          flex:         1,
                          padding:      "0.875rem",
                          borderRadius: "12px",
                          border:       `2px solid ${reportMode === m ? "var(--color-primary)" : "var(--color-border)"}`,
                          background:   reportMode === m ? "var(--color-primary-light)" : "var(--color-bg-card)",
                          cursor:       "pointer",
                          transition:   "all 0.15s",
                        }}
                      >
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: reportMode === m ? "var(--color-primary)" : "var(--color-text-primary)" }}>
                          {m === "form" ? "Fill out manually" : "Use AI Assistant"}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                          {m === "form" ? "Answer the fields yourself" : "Chat to guide you through it"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* ── MANUAL FORM ── */}
                  {reportMode === "form" && (
                    <form onSubmit={handleReportSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>Discrimination Report</h2>

                      <div>
                        <label style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                          Date & Time of Incident *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          className="form-input"
                          value={reportForm.incidentDate}
                          onChange={e => setReportForm(f => ({ ...f, incidentDate: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                          Type of Discrimination *
                        </label>
                        <select
                          required
                          className="form-input"
                          value={reportForm.discriminationType}
                          onChange={e => setReportForm(f => ({ ...f, discriminationType: e.target.value }))}
                        >
                          <option value="">Select a protected class…</option>
                          {DISCRIMINATION_TYPES.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                          Description of Incident *
                        </label>
                        <textarea
                          required
                          rows={5}
                          className="form-input"
                          placeholder="Describe what happened, including any relevant context…"
                          value={reportForm.description}
                          onChange={e => setReportForm(f => ({ ...f, description: e.target.value }))}
                          style={{ resize: "vertical" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                          Supporting Evidence (optional)
                        </label>
                        <div style={{
                          border:       "2px dashed var(--color-border)",
                          borderRadius: "10px",
                          padding:      "1.5rem",
                          textAlign:    "center",
                          cursor:       "pointer",
                          background:   "var(--color-bg-muted)",
                        }}>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            style={{ display: "none" }}
                            id="file-upload"
                            onChange={e => setAttachments(Array.from(e.target.files ?? []))}
                          />
                          <label htmlFor="file-upload" style={{ cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                            📎 Click to upload files (images, PDFs, documents)
                          </label>
                          {attachments.length > 0 && (
                            <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
                              {attachments.map(f => (
                                <span key={f.name} style={{ background: "var(--color-primary-light)", color: "var(--color-primary)", fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "999px", fontFamily: "var(--font-body)" }}>
                                  {f.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <button type="submit" className="btn-primary" disabled={reportLoading} style={{ fontSize: "1rem", padding: "0.75rem" }}>
                        {reportLoading ? "Submitting…" : "Submit Report"}
                      </button>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", textAlign: "center" }}>
                        You may submit anonymously. No account is required.
                      </p>
                    </form>
                  )}

                  {/* ── AI PLACEHOLDER ── */}
                  {reportMode === "ai" && (
                    <div className="card">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          AI Assistant — Coming Soon
                        </span>
                      </div>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Report via AI Chat</h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
                        The AI assistant will ask you a few questions and help fill out your report. 
                        This feature is being connected — use the placeholder below to test the UI.
                      </p>

                      {/* Chat display area */}
                      <div style={{
                        background:   "var(--color-bg-muted)",
                        borderRadius: "12px",
                        padding:      "1.5rem",
                        minHeight:    "260px",
                        marginBottom: "1rem",
                        display:      "flex",
                        flexDirection: "column",
                        gap:          "0.75rem",
                      }}>
                        {/* Static AI greeting bubble */}
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: "#fff", fontSize: "0.8rem" }}>AI</span>
                          </div>
                          <div style={{ background: "#fff", border: "1px solid var(--color-border)", borderRadius: "12px 12px 12px 2px", padding: "0.75rem 1rem", maxWidth: "80%" }}>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                              Hello, I'm the Durham Human Relations AI Assistant. I'm here to help you file a discrimination report. 
                              Can you start by telling me approximately when the incident occurred?
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: "center", marginTop: "auto" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-text-muted)", background: "#fff", padding: "0.25rem 0.75rem", borderRadius: "999px", border: "1px solid var(--color-border)" }}>
                            🔧 AI not yet connected — messages won't send
                          </span>
                        </div>
                      </div>

                      {/* Input bar */}
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Type your message here…"
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          disabled
                          style={{ opacity: 0.6 }}
                        />
                        <button className="btn-primary" disabled style={{ opacity: 0.6, whiteSpace: "nowrap" }}>
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ════════════════════════ APPOINTMENT TAB ════════════════════════ */}
          {tab === "appointment" && (
            <>
              {apptSubmitted ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", marginBottom: "0.75rem" }}>Appointment Booked</h2>
                  <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>
                    Your appointment has been confirmed. A confirmation will be sent if you provided contact info.
                  </p>
                  <button onClick={() => setApptSubmitted(false)} className="btn-outline" style={{ marginTop: "1.5rem" }}>
                    Book another
                  </button>
                </div>
              ) : (
                <>
                  {/* Anonymous notice */}
                  <div style={{ background: "var(--color-accent-light)", border: "1px solid #c6eedd", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.25rem" }}></span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                      <strong>Anonymous appointments are available.</strong> If you do not feel safe sharing your identity, 
                      you may book without creating an account. Toggle the option below.
                    </p>
                  </div>

                  {/* Mode toggle */}
                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem" }}>
                    {(["calendar", "ai"] as ApptMode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setApptMode(m)}
                        style={{
                          flex:         1,
                          padding:      "0.875rem",
                          borderRadius: "12px",
                          border:       `2px solid ${apptMode === m ? "var(--color-primary)" : "var(--color-border)"}`,
                          background:   apptMode === m ? "var(--color-primary-light)" : "var(--color-bg-card)",
                          cursor:       "pointer",
                          transition:   "all 0.15s",
                        }}
                      >
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: apptMode === m ? "var(--color-primary)" : "var(--color-text-primary)" }}>
                          {m === "calendar" ? "Pick a time slot" : "Use AI Assistant"}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                          {m === "calendar" ? "Browse available times" : "Chat to schedule"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* ── CALENDAR SLOT PICKER ── */}
                  {apptMode === "calendar" && (
                    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>Available Appointment Times</h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                        In-person appointments at 101 City Hall Plaza, Durham, NC 27701.
                      </p>

                      {/* Slot grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                        {MOCK_SLOTS.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(selectedSlot === slot.id ? null : slot.id)}
                            style={{
                              padding:      "0.875rem",
                              borderRadius: "10px",
                              border:       `2px solid ${selectedSlot === slot.id ? "var(--color-primary)" : "var(--color-border)"}`,
                              background:   selectedSlot === slot.id ? "var(--color-primary-light)" : "var(--color-bg-card)",
                              cursor:       "pointer",
                              textAlign:    "left",
                              transition:   "all 0.15s",
                            }}
                          >
                            <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: selectedSlot === slot.id ? "var(--color-primary)" : "var(--color-text-primary)" }}>
                              {formatSlot(slot.startTime)}
                            </p>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>30 min session</p>
                          </button>
                        ))}
                      </div>

                      <div>
                        <label style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                          Reason for appointment (optional)
                        </label>
                        <textarea
                          rows={3}
                          className="form-input"
                          placeholder="Briefly describe why you'd like to meet…"
                          value={apptReason}
                          onChange={e => setApptReason(e.target.value)}
                          style={{ resize: "vertical" }}
                        />
                      </div>

                      {/* Anonymous toggle */}
                      <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={apptAnon}
                          onChange={e => setApptAnon(e.target.checked)}
                          style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)" }}
                        />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                          Book anonymously — do not attach my account to this appointment
                        </span>
                      </label>

                      <button
                        className="btn-primary"
                        disabled={!selectedSlot}
                        onClick={handleApptSubmit}
                        style={{ fontSize: "1rem", padding: "0.75rem", opacity: selectedSlot ? 1 : 0.5 }}
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  )}

                  {/* ── AI APPOINTMENT PLACEHOLDER ── */}
                  {apptMode === "ai" && (
                    <div className="card">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          AI Assistant — Coming Soon
                        </span>
                      </div>
                      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Schedule via AI Chat</h2>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
                        The AI will gather your availability and book an appointment. Use the calendar tab to schedule now.
                      </p>

                      <div style={{ background: "var(--color-bg-muted)", borderRadius: "12px", padding: "1.5rem", minHeight: "220px", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: "#fff", fontSize: "0.8rem" }}>AI</span>
                          </div>
                          <div style={{ background: "#fff", border: "1px solid var(--color-border)", borderRadius: "12px 12px 12px 2px", padding: "0.75rem 1rem", maxWidth: "80%" }}>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                              Hi! I can help you book an appointment with the Durham Human Relations Commission. 
                              Would you prefer a morning or afternoon session?
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "auto" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-text-muted)", background: "#fff", padding: "0.25rem 0.75rem", borderRadius: "999px", border: "1px solid var(--color-border)" }}>
                            🔧 AI not yet connected — use calendar tab to book
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <input type="text" className="form-input" placeholder="Type your message…" disabled style={{ opacity: 0.6 }} />
                        <button className="btn-primary" disabled style={{ opacity: 0.6, whiteSpace: "nowrap" }}>Send</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <footer style={{ background: "#0f2d5e", color: "rgba(255,255,255,0.7)", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
            SpeakEqual · North Carolina Central University
          </p>
        </footer>
      </main>
    </>
  );
}