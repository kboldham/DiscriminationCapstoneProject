"use client";

import Link from "next/link";
import Navbar from "./components/navbar";
import ChatBox from "./components/Chatbot";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section style={{
          background:    "linear-gradient(135deg, #1E1A16 0%, #2C2118 60%, #1E1A16 100%)",
          padding:       "6rem 1.5rem 5rem",
          textAlign:     "center",
          position:      "relative",
          overflow:      "hidden",
        }}>
          {/* decorative circles */}
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative" }}>
            <span className="section-label" style={{ color: "#FFFFFF", marginBottom: "1rem", display: "block" }}>
              City of Durham, North Carolina
            </span>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize:   "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color:      "#FFFFFF",
              marginBottom: "1.25rem",
              lineHeight: 1.15,
            }}>
              You Have the Right<br />to Be Treated Fairly
            </h1>
            <p style={{
              fontFamily:   "var(--font-body)",
              fontSize:     "1.1rem",
              color:        "rgba(255,255,255,0.82)",
              maxWidth:     "560px",
              margin:       "0 auto 2.25rem",
              lineHeight:   1.7,
            }}>
              The Speak Equal is here to help you understand your rights,
              file a discrimination report, and schedule support — safely and confidentially.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/report" className="btn-primary" style={{ background: "#fff", color: "var(--color-primary)", fontSize: "1rem", padding: "0.75rem 2rem" }}>
                File a Report
              </Link>
              <Link href="/educate" className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff", fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Know Your Rights
              </Link>
            </div>
          </div>
        </section>

        {/* ── PROTECTED CLASSES STRIP ── */}
        <section style={{ background: "var(--color-primary-light)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "1.25rem 1.5rem", overflowX: "auto" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", marginRight: "0.5rem" }}>
              Protected classes:
            </span>
            {["Race","Color","Religion","Sex","National Origin","Age 40+","Disability","Sexual Orientation","Gender Identity","Familial Status","Veteran Status"].map((c, i) => (
              <span key={c} style={{
                background:   "var(--color-primary)",
                color:        "#fff",
                fontSize:     "0.90rem",
                fontWeight:   600,
                padding:      "0.2rem 0.65rem",
                borderRadius: "999px",
                whiteSpace:   "nowrap",
              }}>{c}</span>
            ))}
          </div>
        </section>

        {/* ── AI ADVOCATE SECTION ── */}
        <section style={{ maxWidth: "960px", margin: "0 auto", padding: "4rem 1.5rem 0" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="section-label">AI Advocate</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", marginTop: "0.5rem", marginBottom: "0.6rem" }}>
              We&apos;re Here to Listen
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              Ask any question about your rights, file a report, or book an appointment — all through a conversation. No forms, no pressure, no account required.
            </p>
          </div>
          <ChatBox mode="general" />
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">How it works</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", marginTop: "0.5rem" }}>
              What We Offer
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                icon:  "",
                title: "File a Report",
                desc:  "Submit a discrimination report using our AI assistant or fill out the form manually. Both paths capture the same information — use whichever feels right.",
                href:  "/report",
                cta:   "Report Now",
              },
              {
                icon:  "",
                title: "Know Your Rights",
                desc:  "Read plain-language guides on Durham's 11 protected classes, applicable city and state laws, and what to expect after filing a report.",
                href:  "/educate",
                cta:   "Learn More",
              },
              {
                icon:  "",
                title: "Schedule an Appointment",
                desc:  "Book an in-person or phone consultation at theanonymously if needed, no login required.",
                href:  "/report#appointments",
                cta:   "Book a time",
              },
            ].map(({ icon, title, desc, href, cta }) => (
              <div key={title} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ fontSize: "2rem" }}>{icon}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}>{title}</h3>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", fontSize: "0.925rem", lineHeight: 1.65, flex: 1 }}>{desc}</p>
                <Link href={href} className="btn-primary" style={{ alignSelf: "flex-start", fontSize: "0.875rem", padding: "0.45rem 1.1rem" }}>{cta} →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── SAFETY & PRIVACY ── */}
        <section style={{ background: "var(--color-accent-light)", borderTop: "1px solid #c6eedd", borderBottom: "1px solid #c6eedd", padding: "3rem 1.5rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}></div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", marginBottom: "0.75rem", color: "var(--color-text-primary)" }}>
              Your Safety and Privacy is our Top Priority
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              You are never required to create an account. Reports can be filed anonymously and appointments can be scheduled as walk in appointments without providing personal iformation. We are here to create a safe and welcoming environment for residents of the city of Durham to voice their concerns about discrimination, and we will never require you to share more than you are comfortable with.
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#1E1A16", color: "rgba(255,255,255,0.65)", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "rgba(255,255,255,0.85)", marginBottom: "0.75rem" }}>
            Speak Equal
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", maxWidth: "640px", margin: "0 auto", lineHeight: 1.7 }}>
            Disclaimer: This is a capstone project created for educational purposes. It is not an official platform. For official reporting and resources, please contact the Durham Human Relations Commission directly. Reports may only be submitted by Durham, NC residents.
          </p>
        </footer>
      </main>
    </>
  );
}