import React from "react";

const typeConfig = {
  success: {
    bg: "bg-success-50",
    border: "border-l-4 border-success",
    text: "text-success-700",
    icon: (
      <svg className="w-5 h-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-warning-50",
    border: "border-l-4 border-warning",
    text: "text-warning-700",
    icon: (
      <svg className="w-5 h-5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  error: {
    bg: "bg-error-50",
    border: "border-l-4 border-error",
    text: "text-error-700",
    icon: (
      <svg className="w-5 h-5 text-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-info-50",
    border: "border-l-4 border-info",
    text: "text-info-700",
    icon: (
      <svg className="w-5 h-5 text-info shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function Alert({ type = "info", message, onClose, className = "" }) {
  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 px-4 py-3 rounded-lg ${config.bg} ${config.border} ${className}`}
    >
      {config.icon}
      <p className={`text-sm flex-1 ${config.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`text-current opacity-50 hover:opacity-100 transition-opacity shrink-0 ${config.text}`}
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
