import { Resend } from "resend";

const resend  = new Resend(process.env.RESEND_API_KEY);
const FROM    = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Shared wrapper so email errors never crash the calling request.
async function send(payload: Parameters<typeof resend.emails.send>[0]) {
  try {
    await resend.emails.send(payload);
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

// ─── Password Reset ───────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, rawToken: string): Promise<void> {
  const link = `${APP_URL}/auth/reset-password?token=${rawToken}`;
  await send({
    from:    FROM,
    to,
    subject: "Reset your Speak Equal password",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem;">Password Reset Request</h2>
        <p style="color:#555;line-height:1.6;">
          We received a request to reset the password for your Speak Equal account.
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${link}" style="display:inline-block;margin:1.5rem 0;padding:0.75rem 1.75rem;background:#C4782A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
        <p style="color:#888;font-size:0.85rem;">
          If you did not request a password reset, you can safely ignore this email.
          Your password will not change.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;" />
        <p style="color:#aaa;font-size:0.78rem;">Speak Equal — Civil Rights Advocacy Platform</p>
      </div>
    `,
  });
}

// ─── Report Status Change ─────────────────────────────────────
export async function sendReportStatusEmail(
  to:       string,
  reportId: string,
  newStatus: string,
): Promise<void> {
  const statusLabel: Record<string, string> = {
    pending:   "Pending Review",
    reviewing: "Under Review",
    resolved:  "Resolved",
  };
  const label = statusLabel[newStatus] ?? newStatus;

  await send({
    from:    FROM,
    to,
    subject: `Your Speak Equal report status has been updated`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem;">Report Status Update</h2>
        <p style="color:#555;line-height:1.6;">
          The status of your discrimination report has been updated to
          <strong>${label}</strong>.
        </p>
        <p style="color:#555;line-height:1.6;">
          You can view the full details of your report by signing in to your Speak Equal account.
        </p>
        <a href="${APP_URL}/dashboard/reports" style="display:inline-block;margin:1.25rem 0;padding:0.65rem 1.5rem;background:#C4782A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View My Reports
        </a>
        <p style="color:#888;font-size:0.85rem;">
          Report ID: ${reportId}
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;" />
        <p style="color:#aaa;font-size:0.78rem;">Speak Equal — Civil Rights Advocacy Platform</p>
      </div>
    `,
  });
}

// ─── Appointment Confirmation ─────────────────────────────────
export async function sendAppointmentConfirmationEmail(
  to:       string,
  slotTime: Date,
  reason:   string | null,
): Promise<void> {
  const formatted = slotTime.toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric",
    year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
  });

  await send({
    from:    FROM,
    to,
    subject: "Your Speak Equal appointment is confirmed",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem;">Appointment Confirmed</h2>
        <p style="color:#555;line-height:1.6;">
          Your in-person appointment with a Speak Equal advocate has been scheduled.
        </p>
        <div style="background:#f9f9f9;border-left:4px solid #C4782A;padding:1rem 1.25rem;margin:1.25rem 0;border-radius:4px;">
          <p style="margin:0;font-weight:600;color:#333;">${formatted}</p>
          ${reason ? `<p style="margin:0.5rem 0 0;color:#555;font-size:0.9rem;">${reason}</p>` : ""}
        </div>
        <p style="color:#555;line-height:1.6;">
          If you need to cancel or reschedule, please sign in to your account.
        </p>
        <a href="${APP_URL}/dashboard/appointments" style="display:inline-block;margin:1.25rem 0;padding:0.65rem 1.5rem;background:#C4782A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View My Appointments
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;" />
        <p style="color:#aaa;font-size:0.78rem;">Speak Equal — Civil Rights Advocacy Platform</p>
      </div>
    `,
  });
}

// ─── Appointment Status Change ────────────────────────────────
export async function sendAppointmentStatusEmail(
  to:        string,
  slotTime:  Date,
  newStatus: string,
): Promise<void> {
  const formatted = slotTime.toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric",
    year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
  });

  const statusMessages: Record<string, string> = {
    completed:  "Your appointment has been marked as completed. Thank you for meeting with a Speak Equal advocate.",
    cancelled:  "Your appointment scheduled for the time below has been cancelled.",
    scheduled:  "Your appointment has been confirmed and is scheduled for the time below.",
  };

  const body = statusMessages[newStatus] ?? `Your appointment status has been updated to ${newStatus}.`;

  await send({
    from:    FROM,
    to,
    subject: `Speak Equal appointment update`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem;">Appointment Update</h2>
        <p style="color:#555;line-height:1.6;">${body}</p>
        <div style="background:#f9f9f9;border-left:4px solid #C4782A;padding:1rem 1.25rem;margin:1.25rem 0;border-radius:4px;">
          <p style="margin:0;font-weight:600;color:#333;">${formatted}</p>
        </div>
        <a href="${APP_URL}/dashboard/appointments" style="display:inline-block;margin:1.25rem 0;padding:0.65rem 1.5rem;background:#C4782A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View My Appointments
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;" />
        <p style="color:#aaa;font-size:0.78rem;">Speak Equal — Civil Rights Advocacy Platform</p>
      </div>
    `,
  });
}
