"use client";

import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import { Bot, Send, Sparkles, User, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What is my attendance in Data Structures?",
  "When is my next exam?",
  "Explain binary search tree",
  "Create a study plan for OS exam",
  "What are my pending assignments?",
  "Generate flashcards for DBMS normalization",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Maviqo AI, your personal study assistant. I can help you with your coursework, explain concepts, generate study materials, and answer questions about your academic data. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that request right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Network issue occurred while contacting Maviqo AI. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] pb-20 lg:pb-0">
      <PageHeader title="AI Assistant" subtitle="Powered by Maviqo AI" />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "assistant"
                ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white"
                : "bg-[var(--muted)]"
            )}>
              {msg.role === "assistant" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={cn(
              "chat-bubble",
              msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
            )}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-[var(--muted-foreground)] mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-2 rounded-xl bg-[var(--muted)] text-sm hover:bg-[var(--border)] transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="chat-bubble chat-bubble-ai flex items-center gap-1.5 py-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex items-center gap-2 p-2 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything about your academics..."
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
