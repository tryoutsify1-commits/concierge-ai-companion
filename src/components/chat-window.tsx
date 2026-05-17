import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef } from "react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { loadThreads, saveThreads, deriveTitle } from "@/lib/threads";
import { Sparkles, Waves, UtensilsCrossed, Sun, Car } from "lucide-react";
import soleneMark from "@/assets/solene-mark.png";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  { icon: Waves, label: "Reserve a cabana by the infinity pool" },
  { icon: UtensilsCrossed, label: "Book dinner at Le Cèdre tonight" },
  { icon: Sun, label: "What time is sunset at Lumière?" },
  { icon: Car, label: "Arrange a chauffeur to Saint-Tropez" },
];

export function ChatWindow({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: UIMessage[];
}) {
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  // Persist on changes
  useEffect(() => {
    if (messages.length === 0) return;
    const all = loadThreads();
    const existing = all.find((t) => t.id === threadId);
    const title = existing?.title && existing.title !== "New conversation"
      ? existing.title
      : deriveTitle(messages);
    const updated = {
      id: threadId,
      title,
      updatedAt: Date.now(),
      messages,
    };
    const next = existing
      ? all.map((t) => (t.id === threadId ? updated : t))
      : [updated, ...all];
    saveThreads(next);
  }, [messages, threadId]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const text = String(fd.get("prompt") || "").trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
    form.reset();
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleSuggestion = (text: string) => {
    if (isLoading) return;
    void sendMessage({ text });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-10 py-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-card">
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
          <div>
            <div className="font-display text-2xl text-foreground">Aurelia</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Your AI Concierge · Online
            </div>
          </div>
        </div>
        <div className="hidden text-right md:block">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Suite 412 · Garance</div>
          <div className="font-display text-base text-foreground">Bonsoir, M. Laurent</div>
        </div>
      </header>

      {/* Conversation */}
      <Conversation className="relative flex-1 bg-background">
        <ConversationContent className="mx-auto w-full max-w-3xl px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <img
                src={soleneMark}
                alt=""
                className="h-24 w-24 object-contain opacity-90"
              />
              <h2 className="mt-6 font-display text-3xl text-foreground">
                Comment puis-je vous aider ce soir ?
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Reservations, recommendations, in-suite requests — all attended to with care.
              </p>
              <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s.label)}
                    className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-left text-sm text-foreground/80 transition-colors hover:border-gold/50 hover:bg-accent/40"
                  >
                    <s.icon className="h-4 w-4 text-gold transition-transform group-hover:scale-110" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                return (
                  <Message key={m.id} from={m.role}>
                    {m.role === "assistant" && (
                      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        Aurelia
                      </div>
                    )}
                    <MessageContent>
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}
              {status === "submitted" && (
                <Message from="assistant">
                  <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    Aurelia
                  </div>
                  <MessageContent>
                    <Shimmer>Composing a reply…</Shimmer>
                  </MessageContent>
                </Message>
              )}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer */}
      <div className="border-t border-border bg-card/60 px-6 py-5 backdrop-blur">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
          <PromptInput onSubmit={() => { /* handled at form level */ }}>
            <PromptInputTextarea
              ref={textareaRef}
              name="prompt"
              placeholder="Ask Aurelia anything — amenities, dining, requests…"
              autoFocus
            />
            <PromptInputFooter className="justify-between">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Replies within moments
              </div>
              <PromptInputSubmit
                status={status}
                disabled={isLoading}
              />
            </PromptInputFooter>
          </PromptInput>
        </form>
      </div>
    </div>
  );
}
