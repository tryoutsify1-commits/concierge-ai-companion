import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, BedDouble, Sparkles, Coffee, Wine } from "lucide-react";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager View · The Solène" },
      { name: "description", content: "Operational insights and live performance dashboard for hotel management." },
      { property: "og:title", content: "Manager View · The Solène" },
      { property: "og:description", content: "Operational insights and live performance dashboard." },
    ],
  }),
  component: ManagerPage,
});

const kpis = [
  { label: "Occupancy", value: "—", hint: "Awaiting data", icon: BedDouble },
  { label: "ADR", value: "—", hint: "Avg daily rate", icon: TrendingUp },
  { label: "Guests in-house", value: "—", hint: "Live count", icon: Users },
  { label: "Service requests", value: "—", hint: "Open today", icon: Sparkles },
];

function EmptyMark() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="rounded-full border border-dashed border-border bg-card/80 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
        Awaiting live data
      </div>
    </div>
  );
}

function PanelHeader({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</div>
        <div className="font-display text-xl text-foreground">{title}</div>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-background">
        <Icon className="h-4 w-4 text-gold" />
      </div>
    </div>
  );
}

function ManagerPage() {
  // Mock placeholder data — values are 0/empty so charts render skeletons
  const lineData = Array.from({ length: 12 }, (_, i) => ({ name: `D${i + 1}`, v: 0 }));
  const barData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => ({
    name: d,
    v: 0,
  }));
  const pieData = [
    { name: "Suites", value: 1 },
    { name: "Deluxe", value: 1 },
    { name: "Standard", value: 1 },
  ];
  const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)"];

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <header className="border-b border-border bg-card/60 px-10 py-7 backdrop-blur">
        <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Operations</div>
        <h1 className="mt-1 font-display text-3xl text-foreground">Manager View</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          A discreet view of the house. Connect your PMS, POS, and housekeeping systems
          to bring these panels to life.
        </p>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 p-8">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="luxury-card rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {k.label}
                </div>
                <k.icon className="h-4 w-4 text-gold/70" />
              </div>
              <div className="mt-3 font-display text-4xl text-foreground">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.hint}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="luxury-card relative col-span-1 rounded-lg p-6 lg:col-span-2">
            <PanelHeader eyebrow="Last 12 days" title="Occupancy trend" icon={TrendingUp} />
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="v" stroke="var(--gold)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <EmptyMark />
            </div>
          </div>

          <div className="luxury-card relative rounded-lg p-6">
            <PanelHeader eyebrow="Room mix" title="Inventory" icon={BedDouble} />
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={85}
                    strokeWidth={2}
                    stroke="var(--card)"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} opacity={0.35} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <EmptyMark />
            </div>
          </div>

          <div className="luxury-card relative rounded-lg p-6">
            <PanelHeader eyebrow="This week" title="Restaurant covers" icon={Wine} />
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                  <Bar dataKey="v" fill="var(--gold)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <EmptyMark />
            </div>
          </div>

          <div className="luxury-card relative rounded-lg p-6">
            <PanelHeader eyebrow="In-suite" title="Service requests" icon={Sparkles} />
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                  <Line type="monotone" dataKey="v" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <EmptyMark />
            </div>
          </div>

          <div className="luxury-card relative rounded-lg p-6">
            <PanelHeader eyebrow="Today" title="Breakfast covers" icon={Coffee} />
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                  <Bar dataKey="v" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <EmptyMark />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          · The Solène · est. MMXXV ·
        </div>
      </div>
    </div>
  );
}
