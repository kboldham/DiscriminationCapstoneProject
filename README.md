# SpeakEqual

A full-stack civil rights reporting and advocacy platform serving residents of Durham, NC. Built as a capstone project to demonstrate applied security engineering in a production web application.

Residents can file discrimination reports anonymously or with an account, schedule confidential Zoom consultations with an advocate, and learn about their rights under local and federal civil rights law.

**Live:** [speakequal.org](https://speakequal.org) · **Stack:** Next.js · TypeScript · PostgreSQL · OpenAI · Vercel

---

## Security Implementation

This section documents the security controls implemented across the application. Each control reflects a deliberate design decision, not a default.

### Defense in Depth — Three-Layer Authorization

Every protected route enforces authorization independently at three layers. No single misconfiguration can expose protected data.

```
Request
  │
  ▼
Next.js Middleware        ← JWT session check; blocks unauthenticated requests
  │                          before any route handler runs
  ▼
Server Component          ← getServerSession() re-checked before any data renders
  │
  ▼
API Route Handler         ← session + role === "admin" verified before any DB write
```

### Authentication

- NextAuth `CredentialsProvider` with JWT session strategy; token stored in HTTP-only cookie
- User `role` is re-fetched from the database on every token refresh — admin privilege changes take effect on the next request without requiring sign-out
- Role-based access enforced in middleware, server components, and API routes independently

### Password Security

- bcryptjs at 12 salt rounds (~250–400ms per hash on Vercel — imperceptible to users, expensive for brute force)
- Minimum 8 characters enforced at registration and password change
- Password reset tokens generated with `crypto.randomBytes(32)` — the raw token is emailed to the user and a SHA-256 hash is stored in the database. A database breach does not yield valid reset links.
- Reset tokens expire after 1 hour; cleared from the database on use
- Forgot-password returns identical responses whether the email exists or not — prevents user enumeration

### Rate Limiting

In-memory sliding window rate limiter (`lib/ratelimit.ts`) — no external dependency.

| Endpoint | Limit |
|----------|-------|
| Login | 10 attempts / 60s per IP |
| Registration | 5 attempts / 60s per IP |
| Forgot / Reset password | 5 attempts / 60s per IP |
| AI Chat (authenticated) | 15 requests / 60s |
| AI Chat (anonymous) | 8 requests / 60s |

Returns `Retry-After` header on 429 responses. Store auto-cleans every 10 minutes.

### Prompt Injection Defense

SpeakEqual feeds user-supplied free text directly into an OpenAI API call. Without sanitization, a malicious user could attempt to override the system prompt, extract confidential configuration, or manipulate AI behavior for other users via stored conversation history.

All incoming messages and conversation history context are scrubbed against 15+ regex patterns before reaching OpenAI:
- Role-switching phrases: `ignore previous instructions`, `act as`, `DAN`, `jailbreak`
- Fake system delimiters: `[system]`, `<s>`, `###system`
- Invisible Unicode: U+200B–U+202E, U+2066–U+2069, U+FEFF

Filtered content is logged server-side. Users are notified when sanitization occurs.

### Webhook Signature Verification

Calendly webhook payloads are verified using HMAC-SHA256. The raw request body is preserved before JSON parsing — once parsed, the original byte sequence is lost and the computed digest will not match. Requests with invalid signatures return 401.

### Data Privacy & Account Deletion

Account deletion runs as a single database transaction:
1. Reports are anonymized — `userId` set to `null` (reports preserved for audit purposes)
2. Appointments are deleted
3. Conversations and all messages are deleted
4. User record is deleted

Anonymous report filing and anonymous appointment booking are both supported — `userId` is nullable on `Report` and `Appointment`.

### Input Validation & API Authorization

- All `/api/admin/*` routes verify session existence and `role === "admin"` server-side before any operation
- Users can only read and write their own reports and appointments
- Prisma parameterizes all queries by default — no raw SQL interpolation
- Error responses return generic messages to the client; full stack traces are logged server-side only

---

## Features

- **AI-assisted report filing** — Conversational intake via GPT-4o-mini. The AI collects incident details and submits the report via OpenAI function calling, then sends a confirmation email with a unique tracking code.
- **Manual report filing** — Structured form covering incident date, discrimination type, category, description, and optional complainant and respondent contact information.
- **Anonymous filing** — No account required. Anonymous filers receive a tracking code to check report status at `/track` without logging in.
- **Appointment scheduling** — Month calendar showing live Calendly availability. Selecting a slot opens Calendly with that time pre-filled. Booking confirmation and Zoom join link delivered by email via webhook.
- **Role-based access control** — Users access their own data only. Admins manage all reports, appointments, and users, update statuses, and add internal notes.
- **Educational content** — Durham's 11 protected classes and applicable federal law (Title VII, ADA, ADEA, FHA, Equal Pay Act, Section 504).
- **Report status tracking** — Anonymous and authenticated filers can check report status by tracking code.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.x |
| UI | React 19, Tailwind CSS 4.x |
| Auth | NextAuth 4.24.13 |
| Password hashing | bcryptjs 3.0.3 |
| ORM | Prisma 6.19.2 |
| Database | PostgreSQL via Neon |
| AI | OpenAI gpt-4o-mini (SDK 6.22.0) |
| Email | Resend 6.10.0 |
| Scheduling | Calendly API + Webhooks |
| Deployment | Vercel |

---

## Architecture

```
Browser
  │
  ▼
Next.js Middleware  ─── JWT check → block or pass
  │
  ▼
Server Component / API Route  ─── re-verify session + role
  │
  ▼
Prisma Client  ─── parameterized queries
  │
  ▼
Neon PostgreSQL
```

---

## Database Design

- `userId` nullable on `Report` and `Appointment` — anonymous filing supported throughout
- Reports use `SetNull` on user delete — preserved for audit after account deletion
- `calendlyEventId` unique constraint — webhook handler is idempotent against duplicate delivery
- One `Conversation` can produce multiple `Reports` — a resident may describe several incidents in a single session
- Password reset: hashed token + expiry stored on `User`; raw token exists only in the email and the user's browser

---

## Calendly Integration

1. Admin sets availability in the Calendly dashboard
2. Resident opens Schedule tab → app calls `/api/slots` (server-side proxy — API token never reaches the browser)
3. Server fetches `event_type_available_times` in 7-day chunks (Calendly API limit), returns sanitized slot data
4. Resident selects a slot → **Book** opens Calendly with that time pre-selected
5. Resident completes booking → Calendly emails Zoom link automatically
6. Calendly fires `invitee.created` webhook → server verifies HMAC-SHA256 → creates `Appointment` record → sends branded confirmation email

---

## Email Notifications

Sent via Resend from `noreply@speakequal.org`. All sends are fire-and-forget — email failure never crashes the request.

| Trigger | Content |
|---------|---------|
| Report filed | Confirmation + unique tracking code |
| Report status updated | New status + dashboard link |
| Appointment booked (webhook) | Date/time + Zoom join link |
| Appointment status updated | New status + date/time |
| Forgot password | Reset link (1-hour expiry) |

---
## License

MIT
