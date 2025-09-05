import React from "react";
import {
  Camera,
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Wrench,
  Settings,
  Bell,
  Search,
  Plus,
  AlertTriangle,
  Boxes,
  DollarSign,
} from "lucide-react";

// --- Admin Dashboard (closer to the reference layout) ---
// Plain React (JSX) + Tailwind v4
// Place in: src/pages/AdminDashboard.jsx

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-slate-100">
        <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold leading-tight">FilmGear Pro</div>
            <div className="text-xs text-slate-400 -mt-0.5">Inventory System</div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-2 text-[11px] uppercase tracking-wider text-slate-400">Navigation</div>
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {sideNav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${n.active ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/60"}`}
            >
              <n.icon className="w-4 h-4" />
              <span>{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 text-xs text-slate-500 border-t border-slate-800">v0.3 • Admin</div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200">
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <div className="relative flex-1 md:w-[560px]">
              <input className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Search equipment..." />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg hover:opacity-95">
              <Plus className="w-4 h-4" /> Add Equipment
            </button>
            <button className="relative w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white">2</span>
            </button>
          </div>
        </header>

        {/* Page header */}
        <div className="px-4 md:px-6 pt-6 pb-2">
          <h1 className="text-[20px] leading-tight font-semibold">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome to your film equipment inventory management system</p>
        </div>

        {/* Content */}
        <section className="px-4 md:px-6 pb-10 space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard icon={Boxes} title="Total Equipment" subtitle="Active inventory items" value={mock.kpis.totalEquipment} />
            <KpiCard icon={DollarSign} title="Monthly Revenue" subtitle={<span>vs last month <span className={`${mock.kpis.monthlyDelta.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>{mock.kpis.monthlyDelta}</span></span>} value={mock.kpis.monthlyRevenue} money />
            <KpiCard icon={Users} title="Active Rentals" subtitle="Equipment currently rented" value={mock.kpis.activeRentals} />
            <KpiCard icon={AlertTriangle} title="Overdue Items" subtitle="Items past return date" value={mock.kpis.overdue} danger />
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Utilization */}
            <Card>
              <CardTitle title="Equipment Utilization" subtitle="Current rental status of your inventory" />
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Utilization Rate</span>
                  <span className="text-slate-500">{mock.utilization.rate}%</span>
                </div>
                <Progress value={mock.utilization.rate} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                {mock.utilization.breakdown.map((b) => (
                  <div key={b.label} className="flex items-center justify-between ring-1 ring-slate-200 rounded-lg px-3 py-2 bg-white">
                    <div className="inline-flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
                      {b.label}
                    </div>
                    <span className="font-medium">{b.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Categories */}
            <Card>
              <CardTitle title="Equipment Categories" subtitle="Breakdown by equipment type" />
              <ul className="mt-4 divide-y divide-slate-200">
                {mock.categories.map((c) => (
                  <li key={c.name} className="flex items-center justify-between py-3">
                    <span>{c.name}</span>
                    <span className="inline-flex items-center justify-center text-sm px-2 py-0.5 rounded-lg ring-1 ring-slate-200 bg-slate-50 w-8 text-center">{c.count}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardTitle title="Recent Activity" subtitle="Latest equipment rentals and maintenance updates" />
              <ul className="mt-4 space-y-3">
                {mock.activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className={`mt-1 w-2.5 h-2.5 rounded-full ${a.dot}`} />
                    <div className="flex-1">
                      <div className="text-sm">{a.text}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{a.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */
function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5">{children}</div>
  );
}

function CardTitle({ title, subtitle }) {
  return (
    <div>
      <div className="font-semibold">{title}</div>
      {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
    </div>
  );
}

function KpiCard({ icon: Icon, title, subtitle, value, danger, money }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-[28px] leading-none font-semibold">{money ? formatMoney(value) : value}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
        </div>
        <div className={`w-10 h-10 rounded-lg inline-flex items-center justify-center ${danger ? "bg-rose-50 text-rose-600 ring-1 ring-rose-100" : "bg-slate-50 text-slate-700 ring-1 ring-slate-200"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function Progress({ value = 0 }) {
  return (
    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
      <div className="h-3 bg-slate-800" style={{ width: `${value}%` }} />
    </div>
  );
}

/* ---------------- Utils & Mock Data ---------------- */
function formatMoney(n) {
  try {
    return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${n}`;
  }
}

const sideNav = [
  { label: "Overview", href: "#", icon: LayoutDashboard, active: true },
  { label: "Equipment", href: "#", icon: Package },
  { label: "Rentals", href: "#", icon: ClipboardList },
  { label: "Maintenance", href: "#", icon: Wrench },
  { label: "Settings", href: "#", icon: Settings },
];

const mock = {
  kpis: {
    totalEquipment: 6,
    monthlyRevenue: 8750,
    monthlyDelta: "+12.5%",
    activeRentals: 2,
    overdue: 0,
  },
  utilization: {
    rate: 33,
    breakdown: [
      { label: "Available", value: 3, color: "bg-emerald-500" },
      { label: "Rented", value: 2, color: "bg-sky-500" },
      { label: "Maintenance", value: 1, color: "bg-amber-500" },
    ],
  },
  categories: [
    { name: "Camera", count: 3 },
    { name: "Lens", count: 1 },
    { name: "Lighting", count: 1 },
    { name: "Audio", count: 1 },
    { name: "Stabilizer", count: 1 },
  ],
  activity: [
    { id: 1, text: "Sony FX9 checked out to Production Studios Inc.", time: "2h ago", dot: "bg-emerald-500" },
    { id: 2, text: "DJI Ronin returned and inspected.", time: "6h ago", dot: "bg-sky-500" },
    { id: 3, text: "Projector lamp hours reached 95% — schedule replacement.", time: "Yesterday", dot: "bg-amber-500" },
  ],
};
