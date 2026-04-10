import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkPasswordResetRateLimit } from "@/lib/ratelimit";

const SUCCESS_MSG = "If an account with that email exists, a password reset link has been sent.";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
             ?? req.headers.get("x-real-ip")
             ?? "unknown";

    const rl = checkPasswordResetRateLimit(ip);
    if (!rl.allowed) {
      // Return the same success message — don't reveal that the IP is throttled
      return NextResponse.json({ message: SUCCESS_MSG }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: SUCCESS_MSG });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Always return the same response to prevent user enumeration
    if (!user) {
      return NextResponse.json({ message: SUCCESS_MSG });
    }

    const rawToken   = crypto.randomBytes(32).toString("hex");
    const hashed     = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry     = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data:  { resetToken: hashed, resetTokenExpiry: expiry },
    });

    await sendPasswordResetEmail(user.email, rawToken);

    return NextResponse.json({ message: SUCCESS_MSG });
  } catch {
    // Still return the same message so timing doesn't reveal anything
    return NextResponse.json({ message: SUCCESS_MSG });
  }
}
