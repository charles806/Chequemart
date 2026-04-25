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

import { useState, useEffect } from "react";
import Icon from "../components/ui/Icon";
import { ICONS } from "../components/ui/icons";
import CircularProgress from "@mui/material/CircularProgress";

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
                  ? "linear-gradient(to top, var(--primary-color), var(--accent-color))"
                  : "linear-gradient(to top, color-mix(in srgb, var(--primary-color) 33%, transparent), color-mix(in srgb, var(--primary-color) 66%, transparent))",
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
                background: isH ? "var(--accent-color)" : "color-mix(in srgb, var(--accent-color) 20%, transparent)",
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

  const segments = data.map((d, i) => {
    const pct = d.count / total;
    const prevOffset = data.slice(0, i).reduce((sum, item) => sum + item.count / total, 0);
    return {
      ...d,
      strokeDasharray:  `${pct * circumference} ${circumference}`,
      strokeDashoffset: -prevOffset * circumference,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={120} height={120} viewBox="0 0 120 120" className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={14} />
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
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="900" fill="var(--text-color)">
          {total}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="var(--text-color-2)">
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
                  className="h-full rounded-full bg-[#ff5252] transition-all duration-500"
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, revenueRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/seller/analytics/summary?period=${period}`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/seller/analytics/revenue?period=${period}`, { headers }),
      ]);

      const summaryData = await summaryRes.json();
      const revenueData = await revenueRes.json();

      setData({
        kpis: [
          { label: "Total Revenue", value: fmt(summaryData.stats?.revenue || 0), change: 12 },
          { label: "Orders", value: summaryData.stats?.orders || 0, change: 8 },
          { label: "Customers", value: summaryData.stats?.customers || 0, change: 5 },
          { label: "Avg. Order", value: fmt(summaryData.stats?.aov || 0), change: -2 },
        ],
        revenue: revenueData.revenue || [],
        orderBreakdown: [
          { status: "Pending",   count: 12, pct: 25, color: "#94a3b8" },
          { status: "Shipped",   count: 18, pct: 38, color: "#6366f1" },
          { status: "Delivered", count: 18, pct: 37, color: "#10b981" },
        ],
        activity: [
          { type: "order", message: "New order #8921 from Lagos", time: "2 mins ago", amount: 15400 },
          { type: "review", message: "New 5-star review for Nike Air", time: "1 hr ago" },
        ]
      });
    } catch (error) {
      console.error("Analytics fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress size={40} className="text-[#ff5252]" />
      </div>
    );
  }

  const chartData = data.revenue;
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
                  ? "bg-[#ff5252] text-white shadow-md shadow-red-200"
                  : "text-gray-400 hover:text-gray-600"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {data.kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-900 text-sm">Revenue</h3>
            <p className="text-2xl font-black text-[#ff5252] mt-0.5">{fmt(totalRev)}</p>
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
          <DonutChart data={data.orderBreakdown} />
        </div>

        {/* Orders volume */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 text-sm mb-1">Order Volume</h3>
          <p className="text-[10px] text-gray-400 mb-4 capitalize">{period} trend</p>
          <OrdersChart data={chartData} />
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-1">Recent Activity</h3>
        <p className="text-[10px] text-gray-400 mb-2">Latest store events</p>
        <ActivityFeed items={data.activity} />
      </div>

    </div>
  );
            }
      
