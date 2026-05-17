import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChatWindow } from "@/components/chat-window";
import { loadThreads, saveThreads, createThread } from "@/lib/threads";
import type { UIMessage } from "ai";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    const all = loadThreads();
    const found = all.find((t) => t.id === threadId);
    if (found) {
      setInitial(found.messages);
    } else {
      const t = { ...createThread(), id: threadId };
      saveThreads([t, ...all]);
      setInitial([]);
    }
  }, [threadId]);

  if (initial === null) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <span className="font-display text-lg">Loading conversation…</span>
      </div>
    );
  }

  return <ChatWindow key={threadId} threadId={threadId} initialMessages={initial} />;
}
