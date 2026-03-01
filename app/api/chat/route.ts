import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = '';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, conversationId } = await req.json();
  const userId = session.user.id;

  // Get or create conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!conversation || conversation.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } else {
    conversation = await prisma.conversation.create({
      data: { userId, title: message.slice(0, 60) },
      include: { messages: true },
    });
  }

  // Save user message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "user", content: message },
  });

  // Build history for OpenAI
  const history = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message },
    ],
  });

  const aiText = completion.choices[0].message.content ?? "";

  // Save assistant message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: aiText },
  });

  // Auto-create report if AI extracted one
  const reportMatch = aiText.match(/<report>([\s\S]*?)<\/report>/);
  let createdReport = null;
  if (reportMatch) {
    try {
      const data = JSON.parse(reportMatch[1]);
      createdReport = await prisma.report.create({
        data: {
          userId,
          conversationId: conversation.id,
          source: "ai",
          incidentDate: new Date(data.incidentDate),
          discriminationType: data.discriminationType,
          description: data.description,
        },
      });
    } catch (e) {
      console.error("Failed to parse AI report block", e);
    }
  }

  // Check for appointment intent
  const apptMatch = aiText.match(/<book_appointment>([\s\S]*?)<\/book_appointment>/);
  let appointmentIntent = null;
  if (apptMatch) {
    try {
      appointmentIntent = JSON.parse(apptMatch[1]);
    } catch (e) {
      console.error("Failed to parse appointment block", e);
    }
  }

  // Strip the structured blocks from the visible message
  const cleanMessage = aiText
    .replace(/<report>[\s\S]*?<\/report>/, "")
    .replace(/<book_appointment>[\s\S]*?<\/book_appointment>/, "")
    .trim();

  return NextResponse.json({
    conversationId: conversation.id,
    message: cleanMessage,
    createdReport,
    appointmentIntent, // frontend opens slot picker when this is non-null
  });
}

// GET: load user's past conversations for resume sidebar
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });

  return NextResponse.json(conversations);
}