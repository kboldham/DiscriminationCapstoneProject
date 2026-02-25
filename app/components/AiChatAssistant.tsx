"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

interface AiChatAssistantProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function AiChatAssistant({
  title = "AI Chat Assistant",
  description = "Ask questions about documenting incidents, reporting options, and practical next steps.",
  className = "",
}: AiChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I can help explain discrimination reporting steps and what information to document.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmed }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Chat service is unavailable right now.");
      setIsLoading(false);
      return;
    }

    setMessages([...nextMessages, { role: "assistant", text: data.reply }]);
    setIsLoading(false);
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>

      <div className="border rounded-lg shadow-md bg-white p-4 mb-3 h-[300px] overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={message.role === "user" ? "text-right" : "text-left"}
          >
            <p
              className={`inline-block rounded-lg px-4 py-2 max-w-[90%] ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}

        {isLoading && <p className="text-sm text-gray-500">Assistant is typing…</p>}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white rounded-md px-5 py-3 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}