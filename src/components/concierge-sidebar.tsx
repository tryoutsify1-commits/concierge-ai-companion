import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { MessageSquarePlus, MessageCircle, BarChart3, Trash2, Sparkles, Bell, BedDouble } from "lucide-react";
import { loadThreads, saveThreads, createThread, type Thread } from "@/lib/threads";
import { cn } from "@/lib/utils";
import soleneMark from "@/assets/solene-mark.png";

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function ConciergeSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [threads, setThreads] = useState<Thread[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setThreads(loadThreads());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveThreads(threads);
  }, [threads, hydrated]);

  const handleNewThread = useCallback(() => {
    const t = createThread();
    setThreads((prev) => [t, ...prev]);
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }, [navigate]);

  const handleDelete = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setThreads((prev) => prev.filter((t) => t.id !== id));
      if (pathname.includes(id)) navigate({ to: "/" });
    },
    [navigate, pathname]
  );

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <img
            src={soleneMark}
            alt="The Solène crest"
            className="h-11 w-11 object-contain"
          />
          <div className="leading-tight">
            <div className="font-display text-xl tracking-wide text-gold">The Solène</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/60">
              Côte d'Azur
            </div>
          </div>
        </div>
      </div>

      <div className="mx-6 gold-rule opacity-60" />

      {/* Guest card */}
      <div className="mx-5 mt-5 rounded-md border border-sidebar-border/60 bg-sidebar-accent/40 px-4 py-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/55">Suite</div>
        <div className="mt-1 flex items-center justify-between">
          <div className="font-display text-lg text-sidebar-foreground">Garance · 412</div>
          <BedDouble className="h-4 w-4 text-gold/80" />
        </div>
        <div className="mt-1 text-xs text-sidebar-foreground/60">
          M. & Mme. Laurent · 3 nights
        </div>
      </div>

      {/* Primary nav */}
      <nav className="mt-6 px-3">
        <NavRow
          to="/manager"
          icon={<BarChart3 className="h-4 w-4" />}
          label="Manager View"
          active={pathname.startsWith("/manager")}
        />
      </nav>

      {/* Concierge section */}
      <div className="mt-7 flex items-center justify-between px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/55">
          Concierge
        </span>
        <button
          onClick={handleNewThread}
          className="flex items-center gap-1.5 rounded-full border border-gold/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold transition hover:bg-gold/10"
        >
          <MessageSquarePlus className="h-3 w-3" />
          New
        </button>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto px-3 pb-4">
        {threads.length === 0 ? (
          <div className="mx-3 mt-4 rounded-md border border-dashed border-sidebar-border/60 px-4 py-6 text-center">
            <Sparkles className="mx-auto h-4 w-4 text-gold/70" />
            <p className="mt-2 text-xs text-sidebar-foreground/60">
              Begin a conversation with Aurelia, your AI concierge.
            </p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {threads.map((t) => {
              const active = pathname === `/chat/${t.id}`;
              return (
                <li key={t.id}>
                  <div
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
                      active
                        ? "bg-gold/15 text-sidebar-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                    )}
                  >
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <MessageCircle className={cn("h-3.5 w-3.5 shrink-0", active ? "text-gold" : "text-sidebar-foreground/50")} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{t.title}</div>
                        <div className="truncate text-[10px] text-sidebar-foreground/45">
                          {formatRelative(t.updatedAt)}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(t.id, e)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-sidebar-foreground/50 hover:text-destructive" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border/60 px-6 py-4">
        <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/60">
          <Bell className="h-3 w-3 text-gold" />
          24/7 in-suite assistance
        </div>
      </div>
    </aside>
  );
}

function NavRow({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-gold/15 text-sidebar-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
      )}
    >
      <span className={cn(active ? "text-gold" : "text-sidebar-foreground/55")}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
