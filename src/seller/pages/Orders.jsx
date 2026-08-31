/**
 * FILE: src/pages/Orders.jsx
 *
 * Order fulfilment management page for sellers.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount:
 *   → GET /api/seller/orders?status=all&page=1&limit=10
 *
 * Update order status:
 *   → PUT /api/seller/orders/:id/status
 *   Body: { status: "Shipped" | "Collected" | "Cancelled" }
 *   Backend should:
 *     1. Validate transition is allowed (no going backwards)
 *     2. Update order in MongoDB
 *     3. Send email/push notification to buyer
 *     4. If status → "Collected": start 7-day escrow release countdown
 *
 * STATUS TRANSITIONS (Seller):
 *   Pending   → Shipped | Cancelled
 *   Shipped   → Collected
 *   Collected → (no changes allowed)
 *   Cancelled → (no changes allowed)
 *
 * PAYMENT STATUS:
 *   - Unpaid: Cannot fulfill order
 *   - Paid: Can proceed with fulfillment
 * ─────────────────────────────────────────────────────────────
 * TODO: For 1000+ orders, consider virtualizing with @tanstack/react-virtual
 */

import { useState, useEffect } from "react";
import { authFetch } from "../../api";
import Icon from "../components/ui/Icon";
import StatusBadge from "../components/ui/StatusBadge";
import Toast, { useToast } from "../components/ui/Toast";
import { ICONS } from "../components/ui/icons";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useSearchParams } from "react-router-dom";

const fmt = (n) => "₦" + Number(n).toLocaleString();

// Status transitions - what states can each status transition to
const TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  processing: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["collected"],
  collected: [],
  cancelled: [],
};

// Status transitions requiring payment to be paid first
const REQUIRES_PAID = ["confirmed", "shipped", "delivered", "collected"];

// ─────────────────────────────────────────────────────────────
// ORDER DETAIL DRAWER
// ─────────────────────────────────────────────────────────────
const OrderDetail = ({ order, onClose, onUpdateStatus, onReleaseEscrow }) => {
  const transitions = TRANSITIONS[order.status] || [];
  const paymentStatus = order.paymentStatus === "paid" || order.isPaid ? "Paid" : "Unpaid";
  const isPaid = paymentStatus === "Paid";
  const hasTracking = !!order.trackingNumber;

  // PUT /api/seller/orders/:id/status
  const handleStatus = (newStatus) => {
    // Validate payment requirement
    if (REQUIRES_PAID.includes(newStatus) && !isPaid) {
      alert("Cannot mark order as " + newStatus + " - payment not received yet");
      return;
    }
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
              <Icon d={ICONS.orders} size={15} className="text-primary-500" />
            </div>
            <div>
              <h3 className="font-black text-neutral-900 text-sm leading-none uppercase">#{order._id.slice(-6)}</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition cursor-pointer"
          >
            <Icon d={ICONS.close} size={14} className="text-neutral-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Amount hero */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-center space-y-1.5">
            <p className="text-3xl font-black text-neutral-900">{fmt(order.totalAmount || order.amount)}</p>
            <div className="flex justify-center gap-2">
              <StatusBadge status={order.status} />
              <StatusBadge status={paymentStatus} category="payment" />
            </div>
          </div>

          {/* Payment status alert */}
          {!isPaid && (
            <div className="flex gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3">
              <Icon d={ICONS.warning} size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-600">Awaiting Payment</p>
                <p className="text-xs text-red-500 mt-0.5">
                  Order will not be shipped until payment is confirmed.
                </p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-50 overflow-hidden">
            {[
              ["Product", order.products.map(p => p.name).join(", ")],
              ["Quantity", `${order.products.reduce((s, p) => s + p.quantity, 0)} items`],
              ["Customer", order.buyer?.name || order.buyer?.email || "Customer"],
              ["Date", new Date(order.createdAt).toLocaleDateString()],
              ["Tracking", order.trackingNumber || "Not yet assigned"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span className="text-neutral-400 font-medium">{k}</span>
                <span className={`font-bold text-right max-w-[55%] ${k === "Tracking" && !order.trackingNumber ? "text-neutral-300" : "text-neutral-800"}`}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          <div className="flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <Icon d={ICONS.map} size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-neutral-600">Shipping Address</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          {/* Collected — escrow release */}
          {order.status === "Collected" && (
            <div className="flex gap-2.5 bg-green-50 border border-green-100 rounded-xl p-3">
              <Icon d={ICONS.check} size={15} className="text-green-500 flex-shrink-0 mt-0.5 stroke-[3]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Order collected. Funds should be released to your wallet automatically.
                </p>
                <button
                  onClick={() => { onReleaseEscrow(order._id); onClose(); }}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition cursor-pointer"
                >
                  Release Escrow Now
                </button>
              </div>
            </div>
          )}

          {/* Status update buttons */}
          {transitions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Update Status</p>
              <div className="flex gap-2">
                {transitions.map((s) => {
                  const requiresPayment = REQUIRES_PAID.includes(s);
                  const disabled = requiresPayment && !isPaid;

                  return (
                    <button
                      key={s}
                      onClick={() => handleStatus(s)}
                      disabled={disabled}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer
                        ${disabled
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          : s === "Cancelled"
                            ? "border-2 border-red-200 text-red-500 hover:bg-red-50"
                            : "bg-[#ff5252] text-white hover:bg-primary-600 shadow-md shadow-primary-200"
                        }`}
                    >
                      {s === "Cancelled" ? "Cancel" : "Mark as " + s}
                      {requiresPayment && !isPaid && " (Pay First)"}
                    </button>
                  );
                })}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentFilter, setPaymentFilter] = useState("All");
  const statusFilter = searchParams.get("status") || "All";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const { toast, showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/seller/orders?status=all&limit=50`);
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      showToast("Failed to update status");
    }
  };

  const handleReleaseEscrow = async (orderId) => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/release-escrow`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        showToast("✅ Escrow released — funds added to available balance");
        fetchOrders();
      } else {
        showToast("❌ " + (data.message || "Failed to release escrow"));
      }
    } catch (error) {
      showToast("❌ " + (error.message || "Failed to release escrow"));
    }
  };

  const STATUS_FILTERS = ["All", "pending", "processing", "confirmed", "shipped", "delivered", "collected", "cancelled"];
  const PAYMENT_FILTERS = ["All", "Pending", "Paid", "Unpaid"];

  const filtered = orders.filter((o) => {
    const statusMatch = statusFilter === "All" || o.status === statusFilter;

    const paymentStatus = o.paymentStatus || (o.isPaid ? "Paid" : "Unpaid");
    const paymentMatch = paymentFilter === "All" || paymentStatus === paymentFilter;

    const q = search.toLowerCase();
    const searchMatch = (o._id && o._id.toLowerCase().includes(q)) ||
      (o.products && o.products.some(p => p.name.toLowerCase().includes(q))) ||
      (o.buyer && o.buyer.name && o.buyer.name.toLowerCase().includes(q));
    return statusMatch && paymentMatch && searchMatch;
  });

  const getPaymentStatus = (order) => (order.paymentStatus === "paid" || order.isPaid) ? "Paid" : "Unpaid";

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900">Orders</h1>
          <p className="text-xs text-neutral-400">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print
        </button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mb-6 pb-4 border-b-2 border-neutral-300">
        <h2 className="text-2xl font-bold text-neutral-900">ChequeMart</h2>
        <p className="text-sm text-neutral-500">Seller Orders Report</p>
        <p className="text-xs text-neutral-400">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-neutral-900">{orders.length}</p>
          <p className="text-[10px] text-neutral-400 font-semibold">Total</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-yellow-600">{orders.filter((o) => o.status === "pending").length}</p>
          <p className="text-[10px] text-neutral-400 font-semibold">Pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-orange-600">{orders.filter((o) => o.status === "processing").length}</p>
          <p className="text-[10px] text-neutral-400 font-semibold">Processing</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-purple-600">{orders.filter((o) => o.status === "confirmed").length}</p>
          <p className="text-[10px] text-neutral-400 font-semibold">Confirmed</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-blue-600">{orders.filter((o) => o.status === "shipped").length}</p>
          <p className="text-[10px] text-neutral-400 font-semibold">Shipped</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-green-600">{orders.filter((o) => o.status === "delivered").length}</p>
          <p className="text-[10px] text-neutral-400 font-semibold">Delivered</p>
        </div>
      </div>

      {/* Payment status strip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-green-600">
            {orders.filter((o) => getPaymentStatus(o) === "Paid").length}
          </p>
          <p className="text-[10px] text-neutral-400 font-semibold">Paid</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 text-center">
          <p className="text-lg font-black text-red-600">
            {orders.filter((o) => getPaymentStatus(o) === "Unpaid").length}
          </p>
          <p className="text-[10px] text-neutral-400 font-semibold">Unpaid</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon d={ICONS.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, product or customer"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition"
        />
      </div>

      {/* Filter tabs - Status */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <span className="text-xs font-bold text-neutral-400 self-center mr-1">Status:</span>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              if (f === "All") next.delete("status");
              else next.set("status", f);
              setSearchParams(next, { replace: true });
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0
              transition cursor-pointer
              ${statusFilter === f
                ? "bg-[#ff5252] text-white shadow-md shadow-primary-200"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"}`}
          >
            {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter tabs - Payment */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <span className="text-xs font-bold text-neutral-400 self-center mr-1">Payment:</span>
        {PAYMENT_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0
              transition cursor-pointer
              ${paymentFilter === f
                ? f === "Paid" ? "bg-green-500 text-white shadow-md" : f === "Unpaid" ? "bg-red-500 text-white shadow-md" : "bg-[#ff5252] text-white shadow-md"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="overflow-x-auto">
        <div className="space-y-2 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <CircularProgress size={30} className="text-primary-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-neutral-100 text-neutral-400">
              <Icon d={ICONS.orders} size={36} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-semibold">No orders found</p>
            </div>
          ) : (
            filtered.map((order) => {
              const paymentStatus = getPaymentStatus(order);
              const isPaid = paymentStatus === "Paid";

              return (
                <div
                  key={order._id}
                  onClick={() => setSelected(order)}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:border-neutral-200 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50/80 flex items-center justify-center flex-shrink-0">
                    <Icon d={ICONS.truck} size={18} className="text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-bold text-neutral-900 truncate">
                        {order.products.map(p => p.name).join(", ")}
                      </p>
                      <StatusBadge status={order.status} />
                      <StatusBadge status={paymentStatus} category="payment" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span className="font-mono uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                      <span>{order.buyer?.name || "Customer"}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-neutral-900">{fmt(order.totalAmount || order.amount)}</p>
                    {order.trackingNumber && (
                      <p className="text-[10px] text-blue-400 font-medium mt-0.5">{order.trackingNumber}</p>
                    )}
                    {!isPaid && (
                      <p className="text-[10px] text-red-400 font-medium mt-0.5">Unpaid</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          onReleaseEscrow={handleReleaseEscrow}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
