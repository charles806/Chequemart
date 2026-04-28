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

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Icon from "../components/ui/Icon";
import StatusBadge from "../components/ui/StatusBadge";
import { ICONS } from "../components/ui/icons";
import { useSeller } from "../context/SellerContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt = (n) => "₦" + Number(n).toLocaleString();
const fmtK = (n) => n >= 1000 ? `₦${(n / 1000).toFixed(0)}k` : `₦${n}`;

// ─────────────────────────────────────────────────────────────
// MINI BAR CHART — pure CSS, no library
// ─────────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((d, i) => {
        const height = Math.max((d.revenue / max) * 100, 6);
        const isActive = hovered === i;

        return (
          <div
            key={i}
            className="relative flex-1 flex flex-col items-center justify-end gap-1"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <div
              className={`
                absolute -top-6 text-[10px] font-semibold
                bg-gray-900 text-white px-2 py-1 rounded-md
                shadow-md whitespace-nowrap
                transition-all duration-200
                ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
              `}
            >
              {fmtK(d.revenue)}
            </div>

            {/* Bar */}
            <div
              className={`
                w-full rounded-t-xl transition-all duration-300
                ${isActive ? "scale-105" : "scale-100"}
              `}
              style={{
                height: `${height}%`,
                background: isActive
                  ? "linear-gradient(to top, #4f46e5, #818cf8)"
                  : "linear-gradient(to top, #c7d2fe, #e0e7ff)",
              }}
            />

            {/* Label */}
            <span
              className={`
                text-[10px] font-medium transition-colors duration-200
                ${isActive ? "text-gray-800" : "text-gray-400"}
              `}
            >
              {d.label}
            </span>
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
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0
    },
    weeklyRevenue: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, revenueRes, ordersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/seller/analytics/summary`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/seller/analytics/revenue`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/seller/orders?limit=5`, { headers })
        ]);

        const [summaryData, revenueData, ordersData] = await Promise.all([
          summaryRes.json(),
          revenueRes.json(),
          ordersRes.json()
        ]);

        setDashboardData({
          summary: summaryData.summary || dashboardData.summary,
          weeklyRevenue: revenueData.weekly || [],
          recentOrders: ordersData.orders || []
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const STAT_ICONS = [ICONS.bar, ICONS.package, ICONS.tag, ICONS.users];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress size={40} className="text-[#ff5252]" />
      </div>
    );
  }

  const kpis = [
    { label: "Total Revenue", value: fmt(dashboardData.summary.totalRevenue), change: 0 },
    { label: "Total Orders", value: dashboardData.summary.totalOrders, change: 0 },
    { label: "Avg. Order Value", value: fmt(dashboardData.summary.avgOrderValue), change: 0 },
    { label: "Total Customers", value: dashboardData.summary.totalCustomers, change: 0 },
  ];

  return (
    <div className="space-y-5">

      {/* Welcome banner */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl shadow-black/20">
        <p className="text-gray-600 text-sm mb-0.5 font-medium">Welcome back 👋</p>
        <h2 className="text-gray-900 text-2xl font-black">{seller.storeName || "My Store"}</h2>
        <p className="text-gray-400 text-[10px] font-semibold mt-1 uppercase tracking-wider">Here's what's happening in your store today.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-white text-xl font-black">{fmt(wallet.availableBalance)}</p>
            <p className="text-white/50 text-[10px] font-bold mt-1 uppercase">Available Balance</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-white text-xl font-black">{fmt(wallet.escrowBalance)}</p>
            <p className="text-[#ff5252] text-[10px] font-bold mt-1 uppercase tracking-widest">In Escrow</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
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
              {fmt(dashboardData.weeklyRevenue.reduce((s, d) => s + d.revenue, 0))} this week
            </p>
          </div>
          <Icon d={ICONS.bar} size={18} className="text-[#ff5252]/30" />
        </div>
        <MiniBarChart data={dashboardData.weeklyRevenue} />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-black text-gray-900 text-sm">Recent Orders</h3>
          <span className="text-[10px] text-[#ff5252] font-bold cursor-pointer hover:underline">
            <Link to="/seller/orders">
              View all
            </Link>
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {dashboardData.recentOrders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-gray-400 text-sm italic font-medium">No orders yet</p>
            </div>
          ) : (
            dashboardData.recentOrders.map((order) => (
              <div key={order._id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
                <div className="w-9 h-9 rounded-xl bg-[#ff5252]/8 flex items-center justify-center shrink-0">
                  <Icon d={ICONS.truck} size={16} className="text-[#ff5252]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {order.products.map(p => p.name).join(', ')}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-gray-400 font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-gray-400">{order.buyer?.name || "Customer"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-sm font-black text-gray-900">{fmt(order.totalAmount)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
