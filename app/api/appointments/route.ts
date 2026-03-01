import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: available future slots
export async function GET() {
  const slots = await prisma.timeSlot.findMany({
    where: { isBooked: false, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json(slots);
}

// POST: book a slot
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slotId, reason, source, conversationId } = await req.json();

  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBooked) {
    return NextResponse.json({ error: "Slot unavailable" }, { status: 409 });
  }

  const [, appointment] = await prisma.$transaction([
    prisma.timeSlot.update({ where: { id: slotId }, data: { isBooked: true } }),
    prisma.appointment.create({
      data: {
        userId: session.user.id,
        slotId,
        reason: reason ?? null,
        source: source ?? "calendar",
        conversationId: conversationId ?? null,
      },
    }),
  ]);

  // TODO: swap this for a real email provider (Resend, SendGrid, Nodemailer)
  console.log(`[EMAIL] Booking confirmation to ${session.user.email} for slot ${slotId}`);

  return NextResponse.json(appointment);
}

// PATCH: cancel or reschedule
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appointmentId, action, newSlotId } = await req.json();
  // action: "cancel" | "reschedule"

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "cancel") {
    await prisma.$transaction([
      prisma.timeSlot.update({ where: { id: appointment.slotId }, data: { isBooked: false } }),
      prisma.appointment.update({ where: { id: appointmentId }, data: { status: "cancelled" } }),
    ]);
    console.log(`[EMAIL] Cancellation notice to ${session.user.email}`);
    return NextResponse.json({ success: true });
  }

  if (action === "reschedule" && newSlotId) {
    const newSlot = await prisma.timeSlot.findUnique({ where: { id: newSlotId } });
    if (!newSlot || newSlot.isBooked) {
      return NextResponse.json({ error: "New slot unavailable" }, { status: 409 });
    }

    await prisma.$transaction([
      // Free old slot
      prisma.timeSlot.update({ where: { id: appointment.slotId }, data: { isBooked: false } }),
      // Book new slot
      prisma.timeSlot.update({ where: { id: newSlotId }, data: { isBooked: true } }),
      // Update appointment
      prisma.appointment.update({
        where: { id: appointmentId },
        data: { slotId: newSlotId, status: "scheduled" },
      }),
    ]);
    console.log(`[EMAIL] Reschedule notice to ${session.user.email}`);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}