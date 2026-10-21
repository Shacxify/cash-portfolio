import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Loader2, Sparkles, X } from "lucide-react";
import { EMAIL, OPEN_ASK_EVENT } from "@/lib/site";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does Cash do at Centene?",
  "What's Cash's strongest project?",
  "Which tools does Cash use most?",
  "How can I get in touch?",
];

const ERRORS: Record<number, string> = {
  429: "I'm getting a lot of questions right now. Give it a minute, or email Cash directly.",
  503: `The assistant is offline at the moment. You can reach Cash at ${EMAIL}.`,
};

export function AskCash() {
  const [open, setOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    // The hero has its own button, so the floating launcher waits until it scrolls away.
    const onScroll = () => setShowLauncher(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener(OPEN_ASK_EVENT, onOpen);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener(OPEN_ASK_EVENT, onOpen);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = async (text: string) => {
    const question = text.trim().slice(0, 600);
    if (!question || loading) return;
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      const reply =
        res.ok && data.reply
          ? data.reply
          : (ERRORS[res.status] ??
            `Something went wrong on my end. Feel free to email Cash at ${EMAIL}.`);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `I couldn't connect just now. You can email Cash at ${EMAIL}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLauncher && !open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 text-[14px] font-medium text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            style={{ background: "#361D2E" }}
          >
            <Sparkles size={16} />
            Ask my AI
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask about Cash"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 z-[55] flex max-h-[min(560px,calc(100vh-2rem))] flex-col overflow-hidden rounded-2xl shadow-2xl sm:right-auto sm:w-[380px]"
            style={{ background: "#FAFAF9", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "#361D2E", color: "#fff" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <div>
                  <div className="text-[14px] font-semibold leading-tight">Ask about Cash</div>
                  <div className="text-[11px] opacity-70">
                    Answers drawn from Cash's CV and projects
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 transition-colors hover:bg-white/15"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              aria-live="polite"
            >
              {messages.length === 0 && (
                <div>
                  <p className="text-[14px] leading-relaxed" style={{ color: "rgba(0,0,0,0.72)" }}>
                    Hi! I'm an AI assistant that knows Cash's experience and projects. Ask me
                    anything, or start with one of these:
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="rounded-xl px-3 py-2 text-left text-[13px] transition-colors hover:bg-white"
                        style={{ border: "1px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.78)" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed"
                    style={
                      m.role === "user"
                        ? { background: "#86A397", color: "#0a0a0a" }
                        : {
                            background: "#fff",
                            border: "1px solid rgba(0,0,0,0.08)",
                            color: "rgba(0,0,0,0.82)",
                          }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: "rgba(0,0,0,0.5)" }}
                >
                  <Loader2 size={14} className="animate-spin" /> Thinking…
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 px-3 py-3"
              style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={600}
                placeholder="Ask about Cash's experience…"
                aria-label="Your question"
                className="flex-1 rounded-full bg-white px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#86A397]"
                style={{ border: "1px solid rgba(0,0,0,0.12)" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
                style={{ background: "#361D2E" }}
              >
                <ArrowUp size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
