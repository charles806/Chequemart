/**
 * FILE: src/components/ui/Toast.jsx
 *
 * Shared toast notification component.
 * Replaces the per-page toast duplication that existed before.
 *
 * USAGE — in any page:
 *   import { useToast } from "../components/ui/Toast";
 *
 *   const { toast, showToast } = useToast();
 *
 *   showToast("✅ Product saved");           // default (dark)
 *   showToast("❌ Something went wrong", "error");
 *
 *   return (
 *     <>
 *       ...page content...
 *       <Toast toast={toast} />
 *     </>
 *   );
 */

import { useState, useCallback } from "react";

// ── Hook ────────────────────────────────────────────────────
export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = "default") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, [duration]);

  return { toast, showToast };
};

// ── Component ───────────────────────────────────────────────
const TOAST_STYLES = {
  default: "bg-gray-900 text-white",
  success: "bg-green-600 text-white",
  error:   "bg-red-500   text-white",
  info:    "bg-blue-600  text-white",
};

const Toast = ({ toast }) => {
  if (!toast) return null;

  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.default;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-6 left-1/2 z-50
        text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl
        animate-toast-in whitespace-nowrap
        ${style}
      `}
      style={{ transform: "translateX(-50%)" }}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
