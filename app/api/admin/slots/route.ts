// app/api/admin/slots/route.ts
// Returns ALL time slots (including booked) for admin view
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slots = await prisma.timeSlot.findMany({
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(slots);
}