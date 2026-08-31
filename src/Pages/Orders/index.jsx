import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authFetch } from '../../api';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle, FaRegArrowAltCircleLeft, FaRedo, FaChevronDown, FaCalendarAlt, FaMapMarkerAlt, FaWallet, FaGift, FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { toast } from 'sonner';
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const STATUS_FILTERS = ['all', 'pending', 'processing', 'confirmed', 'shipped', 'delivered', 'collected', 'cancelled'];

const statusConfig = {
  pending:    { label: "Pending",    dot: "bg-neutral-400", text: "text-neutral-600",    bg: "bg-neutral-50",  icon: <FaBoxOpen /> },
  processing: { label: "Processing", dot: "bg-amber-500",   text: "text-amber-600",      bg: "bg-amber-50",    icon: <FaBoxOpen /> },
  confirmed:  { label: "Confirmed",  dot: "bg-purple-500",  text: "text-purple-600",     bg: "bg-purple-50",   icon: <FaCheckCircle /> },
  shipped:    { label: "Shipped",    dot: "bg-blue-500",    text: "text-blue-600",       bg: "bg-blue-50",     icon: <FaShippingFast /> },
  delivered:  { label: "Delivered",  dot: "bg-green-500",   text: "text-green-600",      bg: "bg-green-50",    icon: <FaCheckCircle /> },
  collected:  { label: "Collected",  dot: "bg-teal-500",    text: "text-teal-600",       bg: "bg-teal-50",     icon: <FaCheckCircle /> },
  cancelled:  { label: "Cancelled",  dot: "bg-red-500",     text: "text-red-600",        bg: "bg-red-50",      icon: <FaTimesCircle /> },
};

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyAfterRedirect = async () => {
      const reference = searchParams.get('reference');
      if (reference) {
        try {
          const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/orders/verify/${reference}`);
          const data = await res.json();
          if (data.success && !data.alreadyPaid) toast.success(`Payment confirmed — ${data.orders?.length || 0} order(s) updated`);
          else if (data.alreadyPaid) toast.info('Payment already confirmed');
        } catch { /* silent */ }
        const url = new URL(window.location);
        url.searchParams.delete('reference');
        url.searchParams.delete('trxref');
        window.history.replaceState({}, '', url);
      }
    };
    verifyAfterRedirect().finally(fetchOrders);
  }, []);

  const fetchOrders = async () => {
    setLoading(true); setError(null);
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/orders`);
      const { success, orders } = await response.json();
      if (success) setOrders(orders);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const transformOrder = (order) => ({
    id: order._id,
    date: order.createdAt,
    status: (order.status || 'pending').toLowerCase(),
    items: (order.products || []).map(p => ({ name: p.name, price: p.price, qty: p.quantity, image: p.image })),
    total: order.totalAmount,
    payment: order.isPaid ? "Paid" : order.paymentStatus || "Pending",
    address: order.shippingAddress?.address || 'N/A',
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    trackingHistory: order.trackingHistory || [],
  });

  const getFilteredOrders = () => {
    const q = search.toLowerCase();
    return orders
      .filter(o => activeFilter === 'all' || o.status === activeFilter)
      .filter(o => {
        if (!q) return true;
        return (o._id && o._id.toLowerCase().includes(q)) ||
          (o.products && o.products.some(p => p.name.toLowerCase().includes(q)));
      })
      .map(transformOrder);
  };
  const filteredOrders = getFilteredOrders();

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleMarkAsCollected = async (orderId) => {
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/collect`, { method: "PATCH" });
      const data = await response.json();
      if (data.success) { toast.success('Order marked as collected'); fetchOrders(); }
      else toast.error(data.message);
    } catch { toast.error("Failed to mark order as collected"); }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`, { method: "PATCH" });
      const data = await response.json();
      if (data.success) { toast.success('Order cancelled'); fetchOrders(); }
      else toast.error(data.message);
    } catch { toast.error("Failed to cancel order"); }
  };

  const getCount = (status) => orders.filter(o => o.status === status).length;

  return (
    <section className="py-8 pb-12 bg-neutral-50 min-h-screen">
      <div className="my-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
            <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <FaRegArrowAltCircleLeft className="rotate-180 text-xs" />
            <span className="text-neutral-700">My Orders</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <FaBoxOpen className="text-primary-500" /> My Orders
              </h1>
              <p className="mt-1 text-neutral-400">{orders.length} orders placed</p>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchOrders} />}

        {/* Search */}
        {!loading && orders.length > 0 && (
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or product name"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition"
            />
          </div>
        )}

        {/* Filter tabs — Tailwind button pills */}
        {!loading && orders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
            {STATUS_FILTERS.map((f) => {
              const count = f === 'all' ? orders.length : getCount(f);
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition cursor-pointer
                    ${activeFilter === f
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                      : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'}`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeFilter === f ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {loading ? <LoadingSpinner /> : filteredOrders.length === 0 ? (
          <EmptyState
            icon={FiShoppingBag}
            title="No orders found"
            description={activeFilter === 'all' && !search
              ? "You haven't placed any orders yet. Start shopping to see your orders here."
              : `No ${activeFilter === 'all' ? '' : activeFilter + ' '}orders${search ? ' matching "' + search + '"' : ''} found.`}
            actionLabel="Start Shopping"
            actionLink="/products"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-neutral-100">
                  {/* Header */}
                  <div className="p-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-neutral-50 to-white">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Order ID</p>
                        <p className="font-semibold text-neutral-800 font-mono text-sm">{order.id}</p>
                      </div>
                      <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
                      <div>
                        <p className="text-xs text-neutral-400 mb-1 flex items-center gap-1"><FaCalendarAlt className="text-xs" /> Date Placed</p>
                        <p className="font-medium text-neutral-800">{formatDate(order.date)}</p>
                      </div>
                      <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Total</p>
                        <p className="font-semibold text-neutral-800">₦{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-sm font-medium text-neutral-800 line-clamp-1 max-w-[200px]">{item.name}</p>
                            <p className="text-xs text-neutral-400">Qty: {item.qty}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-neutral-400">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-100">
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleMarkAsCollected(order.id)}
                          className="px-4 py-2 rounded-lg bg-success-500 text-white text-sm font-semibold hover:bg-success-600 transition cursor-pointer"
                        >
                          Mark as Collected
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 rounded-lg border-2 border-error-200 text-error-500 text-sm font-semibold hover:bg-error-50 transition cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <Link
                          to="/products"
                          className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-500 text-sm font-semibold hover:border-primary-500 hover:text-primary-500 transition inline-flex items-center gap-2"
                        >
                          <FaRedo className="text-xs" /> Buy Again
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Expandable */}
                  <Accordion expanded={expandedOrder === order.id} onChange={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="!shadow-none !bg-neutral-50">
                    <AccordionSummary expandIcon={<FaChevronDown className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />} className="!min-h-0 !py-2 !px-5 hover:!bg-neutral-100">
                      <span className="text-sm font-medium text-neutral-500">View Order Details</span>
                    </AccordionSummary>
                    <AccordionDetails className="!pt-0 !px-5 !pb-5">
                      <div className="bg-white rounded-lg p-4 border border-neutral-100">
                        {/* Items list */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-neutral-800 mb-3">Items Ordered</h4>
                          <div className="flex flex-col gap-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-100 shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-neutral-800">{item.name}</p>
                                  <p className="text-xs text-neutral-400">Qty: {item.qty}</p>
                                </div>
                                <p className="text-sm font-semibold text-neutral-800">₦{item.price.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                          <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-primary-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-neutral-400 mb-1">Shipping Address</p>
                              <p className="text-sm font-medium text-neutral-800">
                                {order.shippingAddress?.fullName && <>{order.shippingAddress.fullName}<br /></>}
                                {order.address}
                                {order.shippingAddress?.city && <>, {order.shippingAddress.city}</>}
                                {order.shippingAddress?.state && <> {order.shippingAddress.state}</>}
                                {order.shippingAddress?.phone && <><br />{order.shippingAddress.phone}</>}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FaWallet className="text-primary-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-neutral-400 mb-1">Payment</p>
                              <p className="text-sm font-medium text-neutral-800">{order.payment}</p>
                              {order.trackingNumber && (
                                <p className="text-xs text-neutral-400 mt-1">Tracking: <span className="text-neutral-600 font-medium">{order.trackingNumber}</span></p>
                              )}
                              {order.carrier && (
                                <p className="text-xs text-neutral-400 mt-0.5">Carrier: <span className="text-neutral-600 font-medium">{order.carrier}</span></p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FaGift className="text-primary-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-neutral-400 mb-1">Order Summary</p>
                              <p className="text-sm font-medium text-neutral-800">
                                Subtotal: ₦{order.total.toLocaleString()}<br />
                                <span className="text-primary-500">Total: ₦{order.total.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Tracking timeline */}
                        {order.trackingHistory.length > 0 && (
                          <div className="pt-4 mt-4 border-t border-neutral-100">
                            <h4 className="text-sm font-semibold text-neutral-800 mb-3">Tracking History</h4>
                            <div className="relative pl-6">
                              <div className="absolute left-2 top-1 bottom-1 w-px bg-neutral-200" />
                              {order.trackingHistory.map((entry, idx) => {
                                const entryCfg = statusConfig[entry.status?.toLowerCase()] || statusConfig.pending;
                                return (
                                  <div key={idx} className="relative mb-4 last:mb-0">
                                    <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white ${entryCfg.dot}`} />
                                    <div>
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-xs font-bold ${entryCfg.text}`}>{entryCfg.label}</span>
                                        <span className="text-xs text-neutral-400">{formatDate(entry.timestamp)}</span>
                                      </div>
                                      {entry.description && (
                                        <p className="text-xs text-neutral-500">{entry.description}</p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
