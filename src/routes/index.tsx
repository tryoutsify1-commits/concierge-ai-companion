import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { loadThreads, saveThreads, createThread } from "@/lib/threads";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const threads = loadThreads();
    if (threads.length > 0) {
      navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id }, replace: true });
    } else {
      const t = createThread();
      saveThreads([t]);
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    }
  }, [navigate]);
  return (
    <div className="flex h-full items-center justify-center">
      <div className="font-display text-xl text-muted-foreground">Preparing your suite…</div>
    </div>
  );
}
