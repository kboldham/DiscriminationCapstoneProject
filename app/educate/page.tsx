import AiChatAssistant from "@/app/components/AiChatAssistant";

export default function Documentation() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <AiChatAssistant
        title="AI Chat Assistant"
        description="Ask questions about documenting incidents, reporting options, and practical next steps."
      />
    </div>
  );
}
