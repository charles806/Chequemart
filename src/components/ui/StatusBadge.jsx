import React from "react";

const STATUS_CONFIG = {
  pending:    { bg: "bg-neutral-100", text: "text-neutral-600", dot: "bg-neutral-400", label: "Pending" },
  processing: { bg: "bg-warning-50", text: "text-warning-700", dot: "bg-warning-500", label: "Processing" },
  confirmed:  { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", label: "Confirmed" },
  shipped:    { bg: "bg-info-50", text: "text-info-700", dot: "bg-info-500", label: "Shipped" },
  delivered:  { bg: "bg-success-50", text: "text-success-700", dot: "bg-success-500", label: "Delivered" },
  collected:  { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500", label: "Collected" },
  cancelled:  { bg: "bg-error-50", text: "text-error-700", dot: "bg-error-500", label: "Cancelled" },
  paid:       { bg: "bg-success-50", text: "text-success-700", dot: "bg-success-500", label: "Paid" },
  failed:     { bg: "bg-error-50", text: "text-error-700", dot: "bg-error-500", label: "Failed" },
  active:     { bg: "bg-success-50", text: "text-success-700", dot: "bg-success-500", label: "Active" },
  inactive:   { bg: "bg-neutral-100", text: "text-neutral-500", dot: "bg-neutral-400", label: "Inactive" },
  draft:      { bg: "bg-neutral-100", text: "text-neutral-500", dot: "bg-neutral-400", label: "Draft" },
  available:  { bg: "bg-success-50", text: "text-success-700", dot: "bg-success-500", label: "Available" },
  out_of_stock: { bg: "bg-error-50", text: "text-error-700", dot: "bg-error-500", label: "Out of Stock" },
  low_stock:  { bg: "bg-warning-50", text: "text-warning-700", dot: "bg-warning-500", label: "Low Stock" },
  escrow_held: { bg: "bg-info-50", text: "text-info-700", dot: "bg-info-500", label: "Escrow Held" },
  escrow_released: { bg: "bg-success-50", text: "text-success-700", dot: "bg-success-500", label: "Escrow Released" },
  escrow_refunded: { bg: "bg-warning-50", text: "text-warning-700", dot: "bg-warning-500", label: "Refunded" },
};

export default function StatusBadge({ status, label, size = "sm", showDot = true, className = "" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const displayLabel = label || config.label;

  const sizes = {
    xs: "px-2 py-0.5 text-2xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${config.bg} ${config.text}
        ${sizes[size] || sizes.sm}
        ${className}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {displayLabel}
    </span>
  );
}

export { STATUS_CONFIG };
