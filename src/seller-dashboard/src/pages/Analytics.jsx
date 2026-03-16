/**
 * FILE: src/pages/Analytics.jsx
 *
 * Sales analytics & performance overview page.
 * Pure CSS charts — no external library dependency.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount + on period change (run in parallel):
 *   → GET /api/seller/analytics/summary?period=weekly
 *   → GET /api/seller/analytics/revenue?period=weekly
 *   → GET /api/seller/analytics/top-products?period=weekly
 *   → GET /api/seller/analytics/orders-breakdown
 *   → GET /api/seller/analytics/activity?limit=5
 *
 * All aggregations are read-only MongoDB queries.
 * Filter by: seller_id, createdAt range (derived from period param).
 *
 * PERIOD → DATE RANGE:
 *   weekly  → last 7 days
 *   monthly → last 12 months (group by month)
 *   yearly  → all years (group by year)
 * ─────────────────────────────────────────────────────────────
 */

import { useState }       from "react";
import Icon               from "../components/ui/Icon";
import { ICONS }          from "../components/ui/icons";
import {
  mockKPIs,
  mockRevenue,
  mockTopProducts,
  mockOrderBreakdown,
  mockActivity,
} from "../mock/analytics";

const fmt  = (n) => "₦" + Number(n).toLocaleString();
const fmtK = (n) => n >= 1000000 ? `₦${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `₦${(n / 1000).toFixed(0)}k` : `₦${n}`;

// ─────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────
const KPICard = ({ label, value, change }) => {
  const up = change >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5
          ${up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          <Icon d={up ? ICONS.trendUp : ICONS.trendDown} size={8} className="stroke-[3]" />
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// REVENUE BAR CHART — pure CSS
// ─────────────────────────────────────────────────────────────
const RevenueChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="flex items-end gap-1 h-32 w-full">
      {data.map((d, i) => {
        const h   = Math.max((d.revenue / max) * 100, 3);
        const isH = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 cursor-default group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <div className={`text-[9px] font-black text-gray-700 bg-white border border-gray-100
              shadow-md rounded-lg px-1.5 py-1 whitespace-nowrap transition-all duration-100 text-center
              ${isH ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <p>{fmtK(d.revenue)}</p>
              <p className="text-gray-400 font-normal">{d.orders} orders</p>
            </div>
            {/* Bar */}
            <div
              className="w-full rounded-t-lg transition-all duration-200"
              style={{
                height:     `${h}%`,
                background: isH
                  ? "linear-gradient(to top, #ff5252, #ff8a80)"
                  : "linear-gradient(to top, #ff525255, #ff5252aa)",
              }}
            />
            <span className="text-[9px] text-gray-400 font-semibold truncate w-full text-center">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ORDERS VOLUME CHART — indigo bars
// ─────────────────────────────────────────────────────────────
const OrdersChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map((d) => d.orders));

  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((d, i) => {
        const h   = Math.max((d.orders / max) * 100, 3);
        const isH = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-0.5 cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={`text-[9px] font-bold text-gray-700 bg-white border border-gray-100
              shadow-sm rounded-md px-1 py-0.5 transition-all duration-100
              ${isH ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {d.orders}
            </div>
            <div
              className="w-full rounded-t-md transition-all duration-200"
              style={{
                height:     `${h}%`,
                background: isH ? "#6366f1" : "#6366f133",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DONUT CHART — SVG, no library
// ─────────────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  const r = 48, cx = 60, cy = 60;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d) => {
    const pct = d.count / total;
    const seg = {
      ...d,
      strokeDasharray:  `${pct * circumference} ${circumference}`,
      strokeDashoffset: -offset * circumference,
    };
    offset += pct;
    return seg;
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={120} height={120} viewBox="0 0 120 120" className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={14} />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeDasharray={seg.strokeDasharray}
            strokeDashoffset={seg.strokeDashoffset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="900" fill="#111">
          {total}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#9ca3af">
          orders
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1">
        {data.map((d) => (
          <div key={d.status} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <p className="text-xs text-gray-600 font-medium">{d.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width:`${d.pct}%`, backgroundColor: d.color }} />
              </div>
              <span className="text-xs font-bold text-gray-500 w-8 text-right">{d.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TOP PRODUCTS TABLE
// ─────────────────────────────────────────────────────────────
const TopProducts = ({ products }) => {
  const max = products[0]?.revenue || 1;
  return (
    <div className="space-y-3">
      {products.map((p, i) => (
        <div key={p.id} className="flex items-center gap-3">
          <span className="w-5 text-xs font-black text-gray-300 flex-shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${p.growth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.growth >= 0 ? "+" : ""}{p.growth}%
                </span>
                <span className="text-xs font-black text-gray-900">{fmt(p.revenue)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(p.revenue / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 w-14 text-right flex-shrink-0">
                {p.sales} sold
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────────────────────────
const ActivityFeed = ({ items }) => {
  const iconMap = {
    order:         ICONS.orders,
    payout:        ICONS.send,
    review:        ICONS.star,
    restock_alert: ICONS.warning,
  };
  const colorMap = {
    order:         "bg-green-100 text-green-600",
    payout:        "bg-blue-100 text-blue-500",
    review:        "bg-yellow-100 text-yellow-500",
    restock_alert: "bg-orange-100 text-orange-500",
  };

  return (
    <div className="space-y-0 divide-y divide-gray-50">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[item.type]}`}>
            <Icon d={iconMap[item.type]} size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 font-medium leading-tight">{item.message}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
          </div>
          {item.amount && (
            <p className="text-sm font-black text-green-600 flex-shrink-0">+{fmt(item.amount)}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ANALYTICS PAGE
// ─────────────────────────────────────────────────────────────
const PERIODS = ["weekly", "monthly", "yearly"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("weekly");

  const chartData = mockRevenue[period];
  const totalRev  = chartData.reduce((s, d) => s + d.revenue, 0);
  const totalOrd  = chartData.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="space-y-4">

      {/* Header + period switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Analytics</h1>
          <p className="text-xs text-gray-400">Performance overview for your store</p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer
                ${period === p
                  ? "bg-primary text-white shadow-md shadow-red-200"
                  : "text-gray-400 hover:text-gray-600"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-900 text-sm">Revenue</h3>
            <p className="text-2xl font-black text-primary mt-0.5">{fmt(totalRev)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Orders</p>
            <p className="text-lg font-black text-gray-900">{totalOrd}</p>
          </div>
        </div>
        <RevenueChart data={chartData} />
      </div>

      {/* Order breakdown + orders volume side by side (stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 text-sm mb-4">Order Breakdown</h3>
          <DonutChart data={mockOrderBreakdown} />
        </div>

        {/* Orders volume */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 text-sm mb-1">Order Volume</h3>
          <p className="text-[10px] text-gray-400 mb-4 capitalize">{period} trend</p>
          <OrdersChart data={chartData} />
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-sm">Top Products</h3>
          <span className="text-[10px] text-gray-400 font-semibold capitalize">By revenue · {period}</span>
        </div>
        <TopProducts products={mockTopProducts} />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-1">Recent Activity</h3>
        <p className="text-[10px] text-gray-400 mb-2">Latest store events</p>
        <ActivityFeed items={mockActivity} />
      </div>

    </div>
  );
            }
      
