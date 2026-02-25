import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt =
  "You are a supportive educational assistant for people reporting discrimination in Durham, NC. You are not a lawyer. Give practical, plain-language guidance, suggest documenting facts, preserving evidence, and contacting local legal aid or civil rights resources for legal advice.";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Missing OPENAI_API_KEY. Add it to your environment to enable the chatbot.",
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.4,
  });

  const reply = completion.choices[0]?.message?.content?.trim();

  if (!reply) {
    return NextResponse.json({ error: "No response generated." }, { status: 502 });
  }

  return NextResponse.json({ reply }, { status: 200 });
}