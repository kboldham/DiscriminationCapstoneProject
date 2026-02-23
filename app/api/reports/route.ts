import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const reporterName = typeof body.name === "string" ? body.name.trim() : "";
  const reporterEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const followUpPreference = typeof body.followUpPreference === "string" ? body.followUpPreference : "anonymous";
  const discriminationType = typeof body.discriminationType === "string" ? body.discriminationType : "";
  const customType = typeof body.customType === "string" ? body.customType.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const incidentDate = typeof body.date === "string" ? body.date : "";
  const incidentTime = typeof body.time === "string" ? body.time : "";
  const isEstimatedTime = Boolean(body.isEstimatedTime);
  const personsInvolved = typeof body.personsInvolved === "string" ? body.personsInvolved.trim() : "";
  const details = typeof body.info === "string" ? body.info.trim() : "";

  const uploadedFileNames = Array.isArray(body.uploadedFileNames)
    ? body.uploadedFileNames.filter((item: unknown) => typeof item === "string" && item.length > 0)
    : [];

  if (!discriminationType || !location || !incidentDate || (!incidentTime && !isEstimatedTime) || !personsInvolved || !details) {
    return NextResponse.json({ error: "Missing required report fields." }, { status: 400 });
  }

  if (discriminationType === "other" && !customType) {
    return NextResponse.json({ error: "Specific discrimination type is required when selecting Other." }, { status: 400 });
  }

  if (followUpPreference === "contact" && !reporterEmail) {
    return NextResponse.json({ error: "Email is required for follow-up." }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      userId: session?.user?.id || null,
      reporterName: reporterName || null,
      reporterEmail: reporterEmail || null,
      followUpPreference,
      discriminationType,
      customType: customType || null,
      location,
      incidentDate,
      incidentTime: incidentTime || null,
      isEstimatedTime,
      personsInvolved,
      details,
      uploadedFileNames: uploadedFileNames.length > 0 ? uploadedFileNames.join(", ") : null,
    },
  });

  return NextResponse.json({ ok: true, reportId: report.id }, { status: 201 });
}
