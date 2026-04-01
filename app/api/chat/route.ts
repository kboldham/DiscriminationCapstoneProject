import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/ratelimit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 2000;

// ─────────────────────────────────────────────────────────────
// PROMPT INJECTION SANITIZER
// ─────────────────────────────────────────────────────────────

/**
 * Patterns targeting structural injection attacks — role-switching, fake system
 * delimiters, and hidden-character tricks. Semantic content ("tell me how to...")
 * is intentionally excluded to avoid false positives for users describing incidents.
 */
const INJECTION_PATTERNS: [RegExp, string][] = [
  // Role-switching / persona hijacking
  [/ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi, "[removed]"],
  [/you\s+are\s+now\b/gi,                                        "[removed]"],
  [/\bact\s+as\b/gi,                                             "[removed]"],
  [/pretend\s+(you\s+are|to\s+be)\b/gi,                         "[removed]"],
  [/\bDAN\b/g,                                                   "[removed]"],
  [/jailbreak/gi,                                                "[removed]"],

  // Fake system / instruction delimiters
  [/^system\s*:/gim,             "[removed]:"],
  [/\[system\]/gi,               "[removed]"],
  [/<\s*system\s*>/gi,           "[removed]"],
  [/###\s*instruction/gi,        "[removed]"],
  [/###\s*system/gi,             "[removed]"],
  [/<\s*\/?instructions?\s*>/gi, "[removed]"],
  [/```\s*system/gi,             "```"],
  [/<\s*prompt\s*>/gi,           "[removed]"],

  // Invisible / direction-override characters
  [/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,   ""],
  [/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, ""],
];

function sanitizeMessage(raw: string): { sanitized: string; wasAltered: boolean } {
  let text = raw;
  let wasAltered = false;

  for (const [pattern, replacement] of INJECTION_PATTERNS) {
    const next = text.replace(pattern, replacement);
    if (next !== text) {
      wasAltered = true;
      text = next;
    }
  }

  // Collapse runs of the replacement token
  text = text.replace(/(\[removed\]\s*){2,}/g, "[removed] ");

  return { sanitized: text, wasAltered };
}

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI advocate for Speak Equal — a community platform that empowers residents to understand their civil rights, file discrimination reports, and schedule in-person appointments with advocates.

Your role is that of a social worker and knowledgeable civil rights attorney combined. You are warm, patient, trauma-informed, and deeply skilled at helping people who may be frightened, confused, or upset. Make users feel heard but be respectful of their time by being intentional with questions and response to maximize efficiency.

## Your Personality
- Lead with empathy — acknowledge how the person feels before explaining anything
- Use plain, everyday language — never speak in legal jargon without immediately explaining it
- Be encouraging — help users feel empowered and that their experience matters
- Be patient — never rush the user or make them feel like a burden
- Be reassuring — remind users they are not alone and that Speak Equal is here to help
- If a user expresses distress, fear, or hopelessness, respond with extra warmth before anything else

## Legal Knowledge
You are well-versed in the following laws and can explain them in simple terms:
- **Title VII of the Civil Rights Act (1964)** — prohibits discrimination in employment based on race, color, religion, sex, or national origin
- **Americans with Disabilities Act (ADA, 1990)** — protects people with disabilities from discrimination in employment, public places, transportation, and more
- **Age Discrimination in Employment Act (ADEA, 1967)** — protects workers 40 and older from age-based discrimination
- **Fair Housing Act (FHA, 1968)** — prohibits housing discrimination based on race, color, national origin, religion, sex, familial status, or disability
- **Equal Pay Act (1963)** — requires equal pay for equal work regardless of sex
- **Section 504 of the Rehabilitation Act** — prohibits disability discrimination by programs receiving federal funding
- **NC Equal Employment Practices Act** — North Carolina's state law mirroring federal protections
- **Durham City Code** — Durham extends protections across all 11 protected classes listed below

## Durham's 11 Protected Classes
When filing a report, the discrimination must fall under one of these categories (use the exact key in parentheses when calling the submit function):
- Race (race)
- Color (color)
- Religion (religion)
- Sex (sex)
- National Origin (national_origin)
- Age (age)
- Disability (disability)
- Sexual Orientation (sexual_orientation)
- Gender Identity (gender_identity)
- Familial Status (familial_status)
- Veteran Status (veteran_status)

## About Speak Equal
- A platform for community members to file discrimination reports and schedule appointments with advocates
- Users can create an account to save their history and track submitted reports
- Reports can be filed with or without an account — no one is turned away
- Appointments are in-person meetings with a Speak Equal advocate
- The "Know Your Rights" section covers all 11 protected classes in detail
- The "Resources" section provides additional community support links
- Users can view their dashboard to see past reports and upcoming appointments after signing in

## Filing a Discrimination Report
When a user wants to file a report, gently collect the following through natural conversation — never fire questions all at once:
1. **Date of incident** — approximate is fine, even just a month and year
2. **Type of discrimination** — which protected class applies
3. **Description** — what happened, where it occurred, who was involved

Once you have all three pieces AND the user has confirmed they want to submit, call the submit_discrimination_report function. Before calling it, read the details back to the user and ask: "Does this look right? I'll go ahead and submit your report."

## Booking an Appointment
When a user wants to book an appointment:
1. Ask what they'd like to discuss at the appointment (reason)
2. Look at the available slots provided in your context and present 2–3 options in a friendly, readable format (e.g., "Tuesday, April 8th at 10:00 AM")
3. Let the user pick one by saying the day/time or the number
4. Confirm their selection before booking: "Great, I'll book you in for [date/time]. Shall I go ahead?"
5. Once confirmed, call the book_appointment function with the exact slot ID

## Important Guidelines
- Never dismiss or minimize the user's experience
- If the user expresses an emergency or immediate threat to safety, always direct them to call 911 first
- Always remind users they can consult a licensed attorney for complex or ongoing legal matters
- You can answer questions about civil rights, discrimination law, and how the Speak Equal website works
- If you don't know the answer to something, say so honestly and suggest they book an appointment to speak with an advocate in person`;

// ─────────────────────────────────────────────────────────────
// OPENAI TOOLS (function calling)
// ─────────────────────────────────────────────────────────────
const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "submit_discrimination_report",
      description:
        "Submit a discrimination report on behalf of the user. Only call this after you have all required fields AND the user has explicitly confirmed they want to submit.",
      parameters: {
        type: "object",
        properties: {
          incidentDate: {
            type: "string",
            description: "ISO date string of when the incident occurred (e.g. '2024-03-15'). Use the 1st of the month if only a month/year is given.",
          },
          discriminationType: {
            type: "string",
            enum: [
              "race", "color", "religion", "sex", "national_origin",
              "age", "disability", "sexual_orientation", "gender_identity",
              "familial_status", "veteran_status",
            ],
            description: "The protected class the discrimination falls under.",
          },
          description: {
            type: "string",
            description: "A clear, detailed description of the incident as shared by the user.",
          },
        },
        required: ["incidentDate", "discriminationType", "description"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_appointment",
      description:
        "Book an appointment slot for the user. Only call this after the user has selected a specific slot and confirmed they want to book it.",
      parameters: {
        type: "object",
        properties: {
          slotId: {
            type: "string",
            description: "The exact ID of the time slot to book (from the available slots list).",
          },
          reason: {
            type: "string",
            description: "The reason the user wants to meet with an advocate.",
          },
        },
        required: ["slotId"],
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// GET — list conversations for sidebar (logged-in users only)
// ─────────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([]);

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: { id: true, title: true, updatedAt: true },
  });

  return NextResponse.json(conversations);
}

// ─────────────────────────────────────────────────────────────
// POST — send a message and get an AI response
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const body = await req.json();
  const { message, conversationId, history: clientHistory } = body as {
    message: string;
    conversationId?: string;
    history?: { role: "user" | "assistant"; content: string }[];
  };

  // ── 1. Rate limiting ──
  const isAnon = !userId;
  const rateLimitKey =
    userId ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = checkRateLimit(rateLimitKey, isAnon);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment before sending another.", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // ── 2. Empty message guard ──
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // ── 3. Message length guard ──
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  // ── 4. Prompt injection sanitization ──
  const { sanitized: sanitizedMessage, wasAltered } = sanitizeMessage(message);

  // ── Fetch available appointment slots for AI context ──
  const availableSlots = await prisma.timeSlot.findMany({
    where: { isBooked: false, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    take: 20,
  });

  const slotsContext =
    availableSlots.length > 0
      ? `\n\n---\nAVAILABLE APPOINTMENT SLOTS (use these exact IDs when calling book_appointment):\n` +
        availableSlots
          .map(
            (s) =>
              `• ID: ${s.id} | ${new Date(s.startTime).toLocaleString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })} – ${new Date(s.endTime).toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}`
          )
          .join("\n") +
        "\n---"
      : "\n\n---\nNo appointment slots are currently available. Let the user know and encourage them to check back soon.\n---";

  // ── Load prior messages if resuming a saved conversation (last 20 only) ──
  // For anonymous users, fall back to client-supplied history so context is not lost.
  let history: { role: "user" | "assistant"; content: string }[] = [];
  let activeConversationId = conversationId ?? null;

  if (userId && conversationId) {
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
    if (conv && conv.userId === userId) {
      history = conv.messages.reverse().map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
    }
  } else if (!userId && clientHistory && clientHistory.length > 0) {
    // Anonymous users: use the last 20 messages sent by the client
    history = clientHistory.slice(-20);
  }

  // ── Build the OpenAI message array ──
  // Use sanitized message for OpenAI; preserve raw message for DB writes below.
  const userContent = wasAltered
    ? `[Note: This message was automatically filtered for security.]\n\n${sanitizedMessage}`
    : sanitizedMessage;

  const openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT + slotsContext },
    ...history,
    { role: "user", content: userContent },
  ];

  // ── Agentic loop — handles tool calls recursively ──
  let createdReport = false;
  let appointmentBooked = false;

  async function runLoop(
    msgs: OpenAI.Chat.ChatCompletionMessageParam[]
  ): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: msgs,
      tools,
      tool_choice: "auto",
      temperature: 0.3,
    });

    const choice = response.choices[0];

    // ── Handle tool calls ──
    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
      const nextMsgs: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...msgs,
        choice.message,
      ];

      for (const call of choice.message.tool_calls) {
        let toolResult = "";

        if (call.type !== "function") continue;

        try {
          const args = JSON.parse(call.function.arguments);

          if (call.function.name === "submit_discrimination_report") {
            await prisma.report.create({
              data: {
                userId: userId,
                incidentDate: new Date(args.incidentDate),
                discriminationType: args.discriminationType,
                description: args.description,
                source: "ai",
                conversationId: activeConversationId ?? null,
              },
            });
            createdReport = true;
            toolResult = "Report submitted successfully.";
          }

          if (call.function.name === "book_appointment") {
            const slot = await prisma.timeSlot.findUnique({
              where: { id: args.slotId },
            });

            if (!slot || slot.isBooked) {
              toolResult =
                "That slot is no longer available — please present the user with other options from the list.";
            } else {
              await prisma.$transaction([
                prisma.timeSlot.update({
                  where: { id: args.slotId },
                  data: { isBooked: true },
                }),
                prisma.appointment.create({
                  data: {
                    userId: userId ?? null,
                    slotId: args.slotId,
                    reason: args.reason ?? null,
                    source: "ai",
                    conversationId: activeConversationId ?? null,
                  },
                }),
              ]);
              appointmentBooked = true;
              toolResult = "Appointment booked successfully.";
            }
          }
        } catch {
          toolResult = "An error occurred. Let the user know and offer to try again.";
        }

        nextMsgs.push({
          role: "tool",
          tool_call_id: call.id,
          content: toolResult,
        });
      }

      return runLoop(nextMsgs);
    }

    return choice.message.content ?? "";
  }

  const assistantReply = await runLoop(openAiMessages);

  // ── Persist conversation + messages for logged-in users ──
  // Always use the raw `message` (not sanitized) so users see their original words.
  if (userId) {
    if (!activeConversationId) {
      const title = message.length > 60 ? message.slice(0, 57) + "…" : message;
      const newConv = await prisma.conversation.create({
        data: { userId, title },
      });
      activeConversationId = newConv.id;
    }

    await prisma.message.createMany({
      data: [
        { conversationId: activeConversationId, role: "user", content: message },
        { conversationId: activeConversationId, role: "assistant", content: assistantReply },
      ],
    });

    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() },
    });
  }

  return NextResponse.json({
    message: assistantReply,
    conversationId: activeConversationId,
    createdReport,
    appointmentBooked,
  });
}
