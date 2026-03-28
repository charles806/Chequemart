/**
 * FILE: src/pages/Dashboard.jsx
 *
 * Overview page — stat cards, revenue chart, recent orders.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount, fetch all three in parallel (Promise.all):
 *
 * → GET /api/seller/analytics/summary?period=weekly
 *   Returns: { totalRevenue, totalOrders, avgOrderValue, totalCustomers }
 *
 * → GET /api/seller/analytics/revenue?period=weekly
 *   Returns: { weekly: [{ label, revenue, orders }] }
 *
 * → GET /api/seller/orders?status=all&limit=5
 *   Returns: { orders: [...] }  (most recent 5)
 *
 * All from MongoDB orders collection, filtered by seller_id.
 * ─────────────────────────────────────────────────────────────
 */

import { useState }    from "react";
import Icon            from "../components/ui/Icon";
import StatusBadge     from "../components/ui/StatusBadge";
import { ICONS }       from "../components/ui/icons";
import { useSeller }   from "../context/SellerContext";
import { mockOrders }  from "../mock/orders";
import { mockRevenue, mockKPIs } from "../mock/analytics";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt  = (n) => "₦" + Number(n).toLocaleString();
const fmtK = (n) => n >= 1000 ? `₦${(n / 1000).toFixed(0)}k` : `₦${n}`;

// ─────────────────────────────────────────────────────────────
// MINI BAR CHART — pure CSS, no library
// ─────────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="flex items-end gap-1.5 h-28 w-full cursor-pointer">
      {data.map((d, i) => {
        const h   = Math.max((d.revenue / max) * 100, 4);
        const isH = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <div className={`text-[9px] font-black text-gray-700 bg-white border border-gray-100
              shadow-md rounded-lg px-2 py-1 whitespace-nowrap transition-all duration-100
              ${isH ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {fmtK(d.revenue)}
            </div>
            {/* Bar */}
            <div
              className="w-full rounded-t-lg transition-all duration-200"
              style={{
                height:     `${h}%`,
                background: isH
                  ? "linear-gradient(to top, var(--[#ff5252]-color), var(--accent-color))"
                  : "linear-gradient(to top, color-mix(in srgb, var(--[#ff5252]-color) 33%, transparent), color-mix(in srgb, var(--[#ff5252]-color) 66%, transparent))",
              }}
            />
            <span className="text-[9px] text-gray-400 font-semibold">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, change, icon }) => {
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#ff5252]/10 flex items-center justify-center">
          <Icon d={icon} size={16} className="text-[#ff5252]" />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5
          ${positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          <Icon d={positive ? ICONS.trendUp : ICONS.trendDown} size={9} className="stroke-3" />
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-xl font-black text-gray-900 leading-none">{value}</p>
      <p className="text-[10px] text-gray-400 font-semibold mt-1">{label}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { seller, wallet } = useSeller();
  const recentOrders       = mockOrders.slice(0, 5);
  const chartData          = mockRevenue.weekly;

  const STAT_ICONS = [ICONS.bar, ICONS.package, ICONS.tag, ICONS.users];

  return (
    <div className="space-y-5">

      {/* Welcome banner */}
      <div className="bg-linear-to-br from-dark to-dark-2 rounded-3xl p-5 shadow-xl shadow-black/20 cursor-pointer">
        <p className="text-black/60 text-sm mb-0.5">Welcome back 👋</p>
        <h2 className="text-black text-2xl font-black">{seller.storeName}</h2>
        <p className="text-black/40 text-xs mt-1">Here's what's happening in your store today.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-black/10 rounded-2xl p-3">
            <p className="text-black text-lg font-black">{fmt(wallet.availableBalance)}</p>
            <p className="text-black/50 text-[10px] font-semibold mt-0.5">Available Balance</p>
          </div>
          <div className="bg-black/10 rounded-2xl p-3">
            <p className="text-yellow-300 text-lg font-black">{fmt(wallet.escrowBalance)}</p>
            <p className="text-black/50 text-[10px] font-semibold mt-0.5">In Escrow</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        {mockKPIs.slice(0, 4).map((kpi, i) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            icon={STAT_ICONS[i]}
          />
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-900 text-sm">Weekly Revenue</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {fmt(chartData.reduce((s, d) => s + d.revenue, 0))} this week
            </p>
          </div>
          <Icon d={ICONS.bar} size={18} className="text-[#ff5252]/30" />
        </div>
        <MiniBarChart data={chartData} />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-black text-gray-900 text-sm">Recent Orders</h3>
          <span className="text-[10px] text-[#ff5252] font-bold cursor-pointer hover:underline">
            View all
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-xl bg-[#ff5252]/8 flex items-center justify-center shrink-0">
                <Icon d={ICONS.truck} size={16} className="text-[#ff5252]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{order.product}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-gray-400 font-mono">{order.id}</p>
                  <p className="text-[10px] text-gray-400">{order.customer}</p>
                </div>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <p className="text-sm font-black text-gray-900">{fmt(order.amount)}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
