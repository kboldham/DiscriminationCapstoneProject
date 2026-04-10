import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: manual form submission (anonymous submissions are allowed)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const body = await req.json();
  const {
    incidentDate, discriminationType, description, attachments,
    category,
    firstName, lastName, phone, address, zipCode,
    respondentName, respondentAddress, respondentPhone,
  } = body;
  // attachments = [{ fileName, fileUrl, fileType }] — uploaded separately, URLs passed here

  if (!incidentDate || !discriminationType || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      userId,
      source: "form",
      incidentDate: new Date(incidentDate),
      discriminationType,
      category:          category          ?? null,
      description,
      firstName:         firstName         ?? null,
      lastName:          lastName          ?? null,
      phone:             phone             ?? null,
      address:           address           ?? null,
      zipCode:           zipCode           ?? null,
      respondentName:    respondentName    ?? null,
      respondentAddress: respondentAddress ?? null,
      respondentPhone:   respondentPhone   ?? null,
      attachments: attachments?.length
        ? { create: attachments.map((a: { fileName: string; fileUrl: string; fileType: string }) => ({
            fileName: a.fileName,
            fileUrl: a.fileUrl,
            fileType: a.fileType,
          }))}
        : undefined,
    },
    include: { attachments: true },
  });

  return NextResponse.json(report);
}

// GET: current user's own reports
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    include: { attachments: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reports);
}