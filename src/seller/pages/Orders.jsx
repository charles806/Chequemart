/**
 * FILE: src/pages/Orders.jsx
 *
 * Order fulfilment management page.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount:
 *   → GET /api/seller/orders?status=all&page=1&limit=10
 *
 * Update order status:
 *   → PUT /api/seller/orders/:id/status
 *   Body: { status: "Shipped" | "Delivered" | "Cancelled" }
 *   Backend should:
 *     1. Validate transition is allowed (no going backwards)
 *     2. Update order in MongoDB
 *     3. Send email/push notification to buyer
 *     4. If status → "Delivered": start 7-day escrow release countdown
 *
 * STATUS TRANSITIONS:
 *   Pending   → Shipped | Cancelled
 *   Shipped   → Delivered
 *   Delivered → (no changes allowed)
 *   Cancelled → (no changes allowed)
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import Icon from "../components/ui/Icon";
import StatusBadge from "../components/ui/StatusBadge";
import Toast, { useToast } from "../components/ui/Toast";
import { ICONS } from "../components/ui/icons";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

const fmt = (n) => "₦" + Number(n).toLocaleString();

// Valid next statuses per current status
const TRANSITIONS = {
  Pending:   ["Shipped", "Cancelled"],
  Shipped:   ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

// ─────────────────────────────────────────────────────────────
// ORDER DETAIL DRAWER
// ─────────────────────────────────────────────────────────────
const OrderDetail = ({ order, onClose, onUpdateStatus }) => {
  const transitions = TRANSITIONS[order.status] || [];

  // PUT /api/seller/orders/:id/status
  const handleStatus = (newStatus) => {
    onUpdateStatus(order._id, newStatus);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh] animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon d={ICONS.orders} size={15} className="text-primary" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm leading-none uppercase">#{order._id.slice(-6)}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
          >
            <Icon d={ICONS.close} size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Amount hero */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center space-y-1.5">
            <p className="text-3xl font-black text-gray-900">{fmt(order.amount)}</p>
            <StatusBadge status={order.status} />
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {[
              ["Product",  order.products.map(p => p.name).join(", ")],
              ["Quantity", `${order.products.reduce((s, p) => s + p.quantity, 0)} items`],
              ["Customer", order.buyer?.name || "Customer"],
              ["Date",     new Date(order.createdAt).toLocaleDateString()],
              ["Tracking", order.trackingNumber || "Not yet assigned"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span className="text-gray-400 font-medium">{k}</span>
                <span className={`font-bold text-right max-w-[55%] ${k === "Tracking" && !order.trackingNumber ? "text-gray-300" : "text-gray-800"}`}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          <div className="flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <Icon d={ICONS.map} size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-600">Shipping Address</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          {/* Delivered — escrow note */}
          {order.status === "Delivered" && (
            <div className="flex gap-2.5 bg-green-50 border border-green-100 rounded-xl p-3">
              <Icon d={ICONS.check} size={15} className="text-green-500 flex-shrink-0 mt-0.5 stroke-[3]" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Order delivered. Escrow funds release within 7 days of buyer confirmation or automatically.
              </p>
            </div>
          )}

          {/* Status update buttons */}
          {transitions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Update Status</p>
              <div className="flex gap-2">
                {transitions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer
                      ${s === "Cancelled"
                        ? "border-2 border-red-200 text-red-500 hover:bg-red-50"
                        : "bg-primary text-white hover:bg-primary-hover shadow-md shadow-red-200"}`}
                  >
                    Mark as {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ORDERS PAGE
// ─────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const { toast, showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/orders?status=all&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Fetch orders failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // PUT /api/seller/orders/:id/status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`✅ Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      showToast("❌ Failed to update status");
    }
  };

  const FILTERS = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "All" || o.status === filter;
    const q           = search.toLowerCase();
    const matchSearch = (o._id && o._id.toLowerCase().includes(q))      ||
                        (o.products && o.products.some(p => p.name.toLowerCase().includes(q))) ||
                        (o.buyer && o.buyer.name && o.buyer.name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Orders</h1>
        <p className="text-xs text-gray-400">{orders.length} total orders</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          ["Total",     orders.length,                                        "text-gray-900"   ],
          ["Pending",   orders.filter((o) => o.status === "Pending").length,  "text-yellow-600" ],
          ["Shipped",   orders.filter((o) => o.status === "Shipped").length,  "text-blue-600"   ],
          ["Delivered", orders.filter((o) => o.status === "Delivered").length,"text-green-600"  ],
        ].map(([l, v, c]) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
            <p className={`text-lg font-black ${c}`}>{v}</p>
            <p className="text-[10px] text-gray-400 font-semibold">{l}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Icon d={ICONS.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, product or customer…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0
              transition cursor-pointer
              ${filter === f
                ? "bg-primary text-white shadow-md shadow-red-200"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-2 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
             <CircularProgress size={30} className="text-[#ff5252]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 text-gray-400">
            <Icon d={ICONS.orders} size={36} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-semibold">No orders found</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelected(order)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3
                hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                <Icon d={ICONS.truck} size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {order.products.map(p => p.name).join(", ")}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="font-mono uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                  <span>{order.buyer?.name || "Customer"}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-gray-900">{fmt(order.totalAmount)}</p>
                {order.trackingNumber && (
                  <p className="text-[10px] text-blue-400 font-medium mt-0.5">{order.trackingNumber}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
