/**
 * FILE: src/pages/Escrow.jsx
 *
 * Escrow tracking & fund release page.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount (run in parallel):
 *   → GET /api/seller/escrow/summary
 *   → GET /api/seller/escrow?status=all&page=1&limit=10
 *
 * Manual fund release:
 *   → POST /api/seller/escrow/:id/release
 *   Eligibility (backend enforces):
 *     - status === "held"
 *     - deliveryStatus === "delivered"
 *   Backend:
 *     1. Validate eligibility
 *     2. Set escrow.status = "released", escrow.releaseDate = now()
 *     3. Credit seller wallet (available_balance += escrow.amount)
 *     4. Insert wallet_transaction (type: "credit")
 *     5. Notify buyer via email
 *
 * AUTO-RELEASE CRON JOB (backend responsibility):
 *   - Runs daily at midnight
 *   - Finds all escrows where:
 *       status = "held" AND
 *       deliveryStatus = "delivered" AND
 *       DATE_DIFF(NOW, heldSince) >= 7
 *   - Releases funds to seller wallet for each
 *
 * PostgreSQL table: escrow_transactions
 * ─────────────────────────────────────────────────────────────
 */

import { useState }        from "react";
import Icon                from "../components/ui/Icon";
import StatusBadge         from "../components/ui/StatusBadge";
import Toast, { useToast } from "../components/ui/Toast";
import { ICONS }           from "../components/ui/icons";
import { useSeller }       from "../context/SellerContext";
import { mockEscrowSummary, mockEscrows } from "../mock/escrow";

const fmt = (n) => "₦" + Number(n).toLocaleString();

// ─────────────────────────────────────────────────────────────
// ESCROW DETAIL DRAWER
// ─────────────────────────────────────────────────────────────
const EscrowDetail = ({ escrow, onRelease, onClose }) => {
  const [releasing, setReleasing] = useState(false);

  const canRelease =
    escrow.status === "held" && escrow.deliveryStatus === "delivered";

  // POST /api/seller/escrow/:id/release
  const handleRelease = () => {
    setReleasing(true);
    // TODO: replace with real fetch call
    setTimeout(() => {
      onRelease(escrow.id);
      onClose();
    }, 900);
  };

  const TIMELINE = [
    { label: "Order Placed",       done: true                                          },
    { label: "Payment Held",       done: true                                          },
    { label: "Item Shipped",       done: ["shipped","delivered"].includes(escrow.deliveryStatus) },
    { label: "Delivered",          done: escrow.deliveryStatus === "delivered"         },
    { label: "Funds Released",     done: escrow.status === "released"                  },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon d={ICONS.escrow} size={15} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm leading-none">{escrow.id}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{escrow.orderId} · {escrow.customer}</p>
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
          <div className="bg-linear-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-2xl p-4 text-center space-y-1.5">
            <p className="text-3xl font-black text-gray-900">{fmt(escrow.amount)}</p>
            <StatusBadge status={escrow.status} />
          </div>

          {/* Details grid */}
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {[
              ["Product",       escrow.product                          ],
              ["Held Since",    escrow.heldSince                        ],
              ["Auto-Release",  escrow.autoReleaseDate || "—"           ],
              ["Days Held",     `${escrow.daysHeld} day${escrow.daysHeld !== 1 ? "s" : ""}`],
              ["Delivery",      escrow.deliveryStatus.charAt(0).toUpperCase() + escrow.deliveryStatus.slice(1)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span className="text-gray-400 font-medium">{k}</span>
                <span className="font-bold text-gray-800 text-right">{v}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          {escrow.note && (
            <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Icon d={ICONS.info} size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">{escrow.note}</p>
            </div>
          )}

          {/* Release timeline */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Release Timeline</p>
            <div className="space-y-0">
              {TIMELINE.map((step, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center
                      ${step.done ? "bg-green-500" : "bg-gray-200"}`}>
                      {step.done
                        ? <Icon d={ICONS.check} size={10} className="text-white stroke-3" />
                        : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`w-0.5 h-5 mt-0.5 rounded ${step.done ? "bg-green-300" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <p className={`text-sm font-medium ${step.done ? "text-gray-800" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute note */}
          {escrow.status === "disputed" && (
            <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
              <Icon d={ICONS.warning} size={15} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-600">Dispute In Progress</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Funds are frozen while the ChequeMart team reviews the buyer's dispute. You'll be notified of the outcome.
                </p>
              </div>
            </div>
          )}

          {/* Manual release button */}
          {canRelease && (
            <button
              onClick={handleRelease}
              disabled={releasing}
              className="w-full py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold
                hover:bg-green-600 transition cursor-pointer flex items-center justify-center gap-2
                shadow-md shadow-green-200 disabled:opacity-60"
            >
              {releasing ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Releasing…</>
              ) : (
                <><Icon d={ICONS.check} size={15} className="stroke-3" /> Release Funds Now</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ESCROW PAGE
// ─────────────────────────────────────────────────────────────
export default function EscrowPage() {
  const { setWallet }               = useSeller();
  const [summary, setSummary]       = useState(mockEscrowSummary);
  const [escrows, setEscrows]       = useState(mockEscrows);
  const [selected, setSelected]     = useState(null);
  const [filter, setFilter]         = useState("All");
  const [search, setSearch]         = useState("");
  const { toast, showToast }        = useToast();

  // POST /api/seller/escrow/:id/release
  const handleRelease = (id) => {
    const escrow = escrows.find((e) => e.id === id);
    if (!escrow) return;

    // Update escrow status
    setEscrows((prev) =>
      prev.map((e) => e.id === id
        ? { ...e, status: "released", releaseDate: "Today" }
        : e
      )
    );
    // Update summary
    setSummary((s) => ({
      ...s,
      totalHeld:       s.totalHeld - escrow.amount,
      releasedToday:   s.releasedToday + escrow.amount,
      totalReleased:   s.totalReleased + escrow.amount,
    }));
    // Update global wallet context (optimistic)
    setWallet((w) => ({ ...w, availableBalance: w.availableBalance + escrow.amount }));
    showToast(`✅ ${fmt(escrow.amount)} released to your wallet`);
  };

  const FILTERS = ["All", "In Escrow", "Released", "Disputed"];

  // Map filter label → status value
  const STATUS_MAP = {
    "All":       null,
    "In Escrow": "held",
    "Released":  "released",
    "Disputed":  "disputed",
  };

  const filtered = escrows.filter((e) => {
    const statusVal   = STATUS_MAP[filter];
    const matchFilter = !statusVal || e.status === statusVal;
    const q           = search.toLowerCase();
    const matchSearch =
      e.id.toLowerCase().includes(q)      ||
      e.product.toLowerCase().includes(q) ||
      e.customer.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Escrow</h1>
        <p className="text-xs text-gray-400">Track funds held during active orders</p>
      </div>

      {/* Summary banner */}
      <div className="bg-linear-to-br from-purple-600 to-purple-800 rounded-3xl p-5 shadow-xl shadow-purple-900/30">
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Total Held",       fmt(summary.totalHeld),       "text-white"         ],
            ["Pending Release",  fmt(summary.pendingRelease),  "text-yellow-300"    ],
            ["Released Today",   fmt(summary.releasedToday),   "text-green-300"     ],
            ["Total Released",   fmt(summary.totalReleased),   "text-purple-200"    ],
          ].map(([l, v, c]) => (
            <div key={l} className="bg-white/10 rounded-2xl p-3">
              <p className={`text-lg font-black ${c}`}>{v}</p>
              <p className="text-[10px] text-white/50 font-semibold mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-release policy card */}
      <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <Icon d={ICONS.clock} size={16} className="text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">7-Day Auto-Release</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Funds are automatically released to your wallet 7 days after delivery is confirmed, or you can release them manually once the order is marked delivered.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon d={ICONS.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by escrow ID, product or customer…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0
              transition cursor-pointer
              ${filter === f
                ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Escrow list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 text-gray-400">
            <Icon d={ICONS.escrow} size={36} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-semibold">No escrow records found</p>
          </div>
        )}

        {filtered.map((escrow) => {
          const canRelease =
            escrow.status === "held" && escrow.deliveryStatus === "delivered";

          return (
            <div
              key={escrow.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-gray-200 transition-all"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setSelected(escrow)}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Icon d={ICONS.escrow} size={18} className="text-purple-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-bold text-gray-900 truncate">{escrow.product}</p>
                    <StatusBadge status={escrow.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-mono">{escrow.id}</span>
                    <span>{escrow.customer}</span>
                    <span>{escrow.heldSince}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-gray-900">{fmt(escrow.amount)}</p>
                  <p className="text-[10px] text-gray-400 capitalize mt-0.5">{escrow.deliveryStatus}</p>
                </div>
              </div>

              {/* Inline release button — only when eligible */}
              {canRelease && (
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    <Icon d={ICONS.clock} size={11} className="inline mr-1" />
                    Auto-releases {escrow.autoReleaseDate}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRelease(escrow.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition cursor-pointer"
                  >
                    <Icon d={ICONS.check} size={12} className="stroke-3" />
                    Release Now
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <EscrowDetail
          escrow={selected}
          onRelease={handleRelease}
          onClose={() => setSelected(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
