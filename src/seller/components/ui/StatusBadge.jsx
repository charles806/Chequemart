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
 *   Orders:       "Pending" | "Shipped" | "Delivered" | "Cancelled"
 *   Products:     "Active"  | "Low Stock" | "Out" | "Draft"
 *   Escrow:       "held"    | "released"  | "disputed" | "refunded"
 *   Transactions: "completed" | "pending" | "failed"
 */

const STYLES = {
  // Orders
  Pending:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  Shipped:     "bg-blue-100   text-blue-700   border-blue-200",
  Delivered:   "bg-green-100  text-green-700  border-green-200",
  Cancelled:   "bg-gray-100   text-gray-500   border-gray-200",

  // Products
  Active:      "bg-green-100  text-green-700  border-green-200",
  "Low Stock": "bg-orange-100 text-orange-700 border-orange-200",
  Out:         "bg-red-100    text-red-600    border-red-200",
  Draft:       "bg-gray-100   text-gray-500   border-gray-200",

  // Escrow
  held:        "bg-purple-100 text-purple-700 border-purple-200",
  released:    "bg-green-100  text-green-700  border-green-200",
  disputed:    "bg-red-100    text-red-600    border-red-200",
  refunded:    "bg-gray-100   text-gray-500   border-gray-200",

  // Transactions
  completed:   "bg-green-100  text-green-700  border-green-200",
  pending:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  failed:      "bg-red-100    text-red-600    border-red-200",
};

// Human-readable labels for escrow statuses
const LABELS = {
  held:     "In Escrow",
  released: "Released",
  disputed: "Disputed",
  refunded: "Refunded",
};

const StatusBadge = ({ status }) => {
  const style = STYLES[status] || "bg-gray-100 text-gray-500 border-gray-200";
  const label = LABELS[status] || status;

  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${style}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
