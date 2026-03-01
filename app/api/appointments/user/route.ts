// app/api/appointments/mine/route.ts
// Returns only the current logged-in user's appointments
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where:   { userId: session.user.id },
    include: { slot: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(appointments);
}