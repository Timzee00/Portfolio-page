"use client";

import { createContext, useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

type ChatMessage = { role: "user" | "assistant"; content: string };

type AIChatContextValue = {
  askAbout: (projectSlug: string, promptText: string) => void;
};

const AIChatContext = createContext<AIChatContextValue | null>(null);

/** Use this from any page to open the widget pre-loaded with a
 *  project-specific question — e.g. a "explain this project" button. */
export function useAIChat() {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error("useAIChat must be used inside AIChatProvider");
  return ctx;
}

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const projectSlugRef = useRef<string | undefined>(undefined);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          projectSlug: projectSlugRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function askAbout(projectSlug: string, promptText: string) {
    projectSlugRef.current = projectSlug;
    setOpen(true);
    void send(promptText);
  }

  return (
    <AIChatContext.Provider value={{ askAbout }}>
      {children}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        data-cursor="magnetic"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-design text-background shadow-lg"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-muted/20 bg-surface shadow-2xl"
          >
            <div className="border-b border-muted/10 px-4 py-3">
              <p className="font-display text-sm font-semibold">Ask about TIMZEE</p>
              <p className="font-mono text-xs text-muted">
                Ask about background, skills, or any project
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <p className="font-mono text-xs text-muted">
                  Try: &quot;What does TIMZEE work on?&quot; or &quot;Summarize the commerce
                  dashboard project.&quot;
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-8 rounded-xl bg-accent-dev/10 px-3 py-2 text-sm"
                      : "mr-8 rounded-xl bg-background px-3 py-2 text-sm"
                  }
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <p className="font-mono text-xs text-muted">Thinking…</p>
              )}
              {error && <p className="text-xs text-accent-design">{error}</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-muted/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-full border border-muted/30 bg-background px-3 py-2 text-sm outline-none focus:border-accent-dev"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label="Send"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-design text-background disabled:opacity-50"
              >
                <FiSend size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AIChatContext.Provider>
  );
}
