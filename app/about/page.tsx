import Navbar from "../components/navbar";

const team = [
  { name: "Corey Little",    role: "Project Manager",   bio: "Bio", linkedin: "#", github: "#" },
  { name: "Savion Brown",    role: "Lead Developer",    bio: "Bio", linkedin: "#", github: "#" },
  { name: "Deshawn Johnson", role: "Lead UI & Design",  bio: "Bio", linkedin: "#", github: "#" },
  { name: "Kyle Oldham",     role: "Lead Developer",    bio: "Bio", linkedin: "#", github: "#" },
  { name: "Melanie Osley",   role: "Lead Researcher",   bio: "Bio", linkedin: "#", github: "#" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section style={{
          background: "linear-gradient(135deg, #1E1A16 0%, #2C2118 100%)",
          padding:    "5rem 1.5rem 4rem",
          textAlign:  "center",
        }}>
          <span className="section-label" style={{ color: "#FFFFFF", display: "block", marginBottom: "0.75rem" }}>
            About Speak Equal
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: "1rem" }}>
            Built by our Community, for our Community
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.8)", maxWidth: "580px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
            Speak Equal is an independent platform dedicated to empowering residents, facilitating in-person advocacy appointments, and making civil rights education accessible to everyone.
          </p>
        </section>

        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "4rem 1.5rem" }}>

          {/* ── ABOUT THE ORG ── */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <span className="section-label" style={{ display: "block", marginBottom: "0.75rem" }}>The Organization</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", marginBottom: "1rem" }}>
              Durham Committee on the Affairs of Black People, Inc (DCABP, Inc.)
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: "1rem" }}>
              Durham Committee on the Affairs of Black People Inc. (DCABP Inc.) is a 501(c)(3) nonprofit community-based organization established in 2014. DCABP Inc. has stood at the forefront to champion Social Justice and Racial Equity (SJ/RE) since its inception. DCABP Inc. initiatives prioritize focus areas in Civic, Economic, Health, Housing, and Youth/Education. They are supported by dedicated staff, college student interns, and volunteers such as ourselves.  
            </p>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", lineHeight: 1.75 }}>
              Speak Equal is bridging the gap between community members and the resources they need to assert their civil rights. We serve as a neutral, independent facilitator connecting residents with trained advocates through a secure and accessible platform.
            </p>
          </div>

          {/* ── ABOUT THE PROJECT ── */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <span className="section-label" style={{ display: "block", marginBottom: "0.75rem" }}>The Project</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", marginBottom: "1rem" }}>
              Our Capstone
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: "1rem" }}>
              Students developed this platform as a two-semester Capstone project — an AI-integrated prototype that assists residents facing discrimination issues across the 11 protected classes in Durham, NC.
            </p>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", lineHeight: 1.75 }}>
              The platform includes an AI-powered assistant trained on Durham's discrimination laws and
              protected classes, a traditional form-based reporting path, a built-in appointment scheduler,
              and an admin dashboard for Speak Equal advocates to manage submissions and appointments.
            </p>
          </div>

          {/* ── TEAM ── */}
          <div>
            <span className="section-label" style={{ display: "block", marginBottom: "0.75rem" }}>The Team</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", marginBottom: "1.5rem" }}>
              Meet The Team
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
              {team.map(({ name, role, bio, linkedin, github }) => (
                <div key={name} className="card" style={{ textAlign: "center" }}>
                  {/* Avatar placeholder */}
                  <div style={{
                    width:        "64px",
                    height:       "64px",
                    borderRadius: "50%",
                    background:   "var(--color-primary-light)",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    margin:       "0 auto 1rem",
                    fontSize:     "1.5rem",
                    fontWeight:   700,
                    color:        "var(--color-primary)",
                    fontFamily:   "var(--font-heading)",
                  }}>
                    {name.charAt(0)}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", marginBottom: "0.25rem" }}>{name}</h3>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{role}</span>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginTop: "0.75rem" }}>{bio}</p>
                  {/* Social links */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "1rem" }}>
                    <a href={linkedin} aria-label={`${name} LinkedIn`} className="social-link social-link--linkedin">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href={github} aria-label={`${name} GitHub`} className="social-link social-link--github">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#1E1A16", color: "rgba(255,255,255,0.65)", padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "rgba(255,255,255,0.85)" }}>
            Speak Equal
          </p>
        </footer>
      </main>
    </>
  );
}