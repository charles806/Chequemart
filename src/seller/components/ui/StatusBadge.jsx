/**
 * FILE: src/components/ui/StatusBadge.jsx
 *
 * Unified status pill used across all pages.
 * A single source of truth for status colours —
 * change it here and it updates everywhere.
 *
 * USAGE:
 *   import StatusBadge from "../components/ui/StatusBadge";
 *   <StatusBadge status="Shipped" />
 *
 * SUPPORTED VALUES:
 *   Order Status:   "Pending" | "Shipped" | "Collected" | "Cancelled"
 *   Payment Status: "Paid" | "Pending" | "Unpaid"
 *   Products:      "Active"  | "Low Stock" | "Out" | "Draft"
 *   Escrow:         "held"    | "released"  | "disputed" | "refunded"
 *   Transactions:  "completed" | "pending" | "failed"
 */

const STYLES = {
  // Order Status (Seller View)
  Pending:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  Processing:  "bg-amber-100  text-amber-700  border-amber-200",
  Confirmed:   "bg-purple-100 text-purple-700 border-purple-200",
  Shipped:     "bg-blue-100   text-blue-700   border-blue-200",
  Delivered:   "bg-green-100  text-green-700  border-green-200",
  Collected:   "bg-teal-100   text-teal-700   border-teal-200",
  Cancelled:   "bg-gray-100   text-gray-500   border-gray-200",

  // Payment Status
  Paid:       "bg-green-100  text-green-700  border-green-200",
  Unpaid:     "bg-red-100    text-red-600    border-red-200",
  Pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",

  // Products
  Active:      "bg-green-100  text-green-700  border-green-200",
  "Low Stock": "bg-orange-100 text-orange-700 border-orange-200",
  Out:         "bg-red-100    text-red-600    border-red-200",
  Draft:       "bg-gray-100   text-gray-500   border-gray-200",

  // Escrow
  held:        "bg-purple-100 text-purple-700 border-purple-200",
  released:   "bg-green-100  text-green-700  border-green-200",
  disputed:   "bg-red-100    text-red-600    border-red-200",
  refunded:   "bg-gray-100   text-gray-500   border-gray-200",

  // Transactions
  completed:   "bg-green-100  text-green-700  border-green-200",
  pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  failed:     "bg-red-100    text-red-600    border-red-200",
};

// Human-readable labels
const LABELS = {
  Collected:  "Collected",
  held:        "In Escrow",
  released:   "Released",
  disputed:   "Disputed",
  refunded:   "Refunded",
};

// Status categories for proper display
const CATEGORY = {
  // Order statuses
  Pending:    "order",
  Processing: "order",
  Confirmed:  "order",
  Shipped:    "order",
  Delivered:  "order",
  Collected:  "order",
  Cancelled:  "order",
  // Payment statuses
  Paid:      "payment",
  Unpaid:    "payment",
  Pending:   "payment",
  // Products
  Active:    "product",
  "Low Stock": "product",
  Out:       "product",
  Draft:     "product",
  // Escrow
  held:      "escrow",
  released:  "escrow",
  disputed:  "escrow",
  refunded: "escrow",
  // Transactions
  completed: "transaction",
  pending:   "transaction",
  failed:    "transaction",
};

const StatusBadge = ({ status, category }) => {
  const style = STYLES[status] || "bg-gray-100 text-gray-500 border-gray-200";
  const label = LABELS[status] || status;
  const inferredCategory = category || CATEGORY[status] || "default";

  // For payment status, show a small icon indicator
  const paymentIcon = {
    Paid:    "✓",
    Unpaid:  "✕",
    Pending: "◷",
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${style}`}>
      {inferredCategory === "payment" && paymentIcon && (
        <span className="text-xs">{paymentIcon}</span>
      )}
      {label}
    </span>
  );
};

export default StatusBadge;
