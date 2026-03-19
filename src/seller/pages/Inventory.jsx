/**
 * FILE: src/pages/Inventory.jsx
 *
 * Stock level management page.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount:
 *   → GET /api/seller/inventory
 *   Returns products with stock fields only (lighter than full products)
 *
 * On restock:
 *   → PUT /api/seller/inventory/:id
 *   Body: { stock: number }
 *   Backend auto-updates status:
 *     stock === 0        → "Out"
 *     stock <= threshold → "Low Stock"
 *     stock >  threshold → "Active"
 *   If stock crosses threshold UP, send "back in stock" notification (optional)
 *
 * MongoDB collection: products
 * ─────────────────────────────────────────────────────────────
 */

import { useState }        from "react";
import Icon                from "../components/ui/Icon";
import StatusBadge         from "../components/ui/StatusBadge";
import Toast, { useToast } from "../components/ui/Toast";
import { ICONS }           from "../components/ui/icons";
import { mockProducts }    from "../mock/products";

// ─────────────────────────────────────────────────────────────
// RESTOCK MODAL
// ─────────────────────────────────────────────────────────────
/**
 * PUT /api/seller/inventory/:id
 * Body: { stock: number }
 */
const RestockModal = ({ product, onSave, onClose }) => {
  const [qty,   setQty]   = useState(product.stock);
  const [saved, setSaved] = useState(false);

  const autoStatus = (n) =>
    n === 0 ? "Out" : n <= product.lowStockThreshold ? "Low Stock" : "Active";

  const handleSave = () => {
    const n = Number(qty);
    if (isNaN(n) || n < 0) return;
    setSaved(true);
    setTimeout(() => { onSave(product.id, n); onClose(); }, 700);
  };

  const newStatus   = autoStatus(Number(qty));
  const statusColor = {
    Out:          "bg-red-50 border-red-100 text-red-600",
    "Low Stock":  "bg-orange-50 border-orange-100 text-orange-600",
    Active:       "bg-green-50 border-green-100 text-green-600",
  }[newStatus];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon d={ICONS.inventory} size={15} className="text-primary" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm leading-none">Update Stock</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-40">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
          >
            <Icon d={ICONS.close} size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Current stock */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-medium">Current Stock</p>
            <p className="text-2xl font-black text-gray-900">
              {product.stock} <span className="text-sm text-gray-400 font-normal">units</span>
            </p>
          </div>
          <StatusBadge status={product.status} />
        </div>

        {/* Qty adjuster */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
            New Quantity
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(0, Number(q) - 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
            >
              <Icon d={ICONS.minus} size={16} className="text-gray-600" />
            </button>
            <input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="flex-1 text-center py-2.5 rounded-xl bg-gray-50 border border-gray-200
                text-xl font-black text-gray-900 focus:outline-none focus:ring-2
                focus:ring-primary/25 focus:border-primary/40 transition"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Number(q) + 1)}
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition cursor-pointer"
            >
              <Icon d={ICONS.plus} size={16} className="text-primary" />
            </button>
          </div>
        </div>

        {/* Live status preview */}
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border ${statusColor}`}>
          <Icon d={ICONS.tag} size={13} />
          Status will update to: <strong>{newStatus}</strong>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all cursor-pointer
            flex items-center justify-center gap-2 shadow-md
            ${saved ? "bg-green-500 shadow-green-200" : "bg-primary hover:bg-primary-hover shadow-red-200"}`}
        >
          {saved
            ? <><Icon d={ICONS.check} size={15} className="stroke-3" /> Saved!</>
            : "Update Stock"}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// INVENTORY PAGE
// ─────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [products,   setProducts]   = useState(mockProducts);
  const [restocking, setRestocking] = useState(null);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");
  const { toast, showToast }        = useToast();

  // PUT /api/seller/inventory/:id
  const handleRestock = (id, newStock) => {
    const autoStatus = (n, threshold) =>
      n === 0 ? "Out" : n <= threshold ? "Low Stock" : "Active";

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: newStock, status: autoStatus(newStock, p.lowStockThreshold) }
          : p
      )
    );
    showToast("✅ Stock updated successfully");
  };

  const FILTERS   = ["All", "Active", "Low Stock", "Out"];
  const outCount  = products.filter((p) => p.status === "Out").length;
  const lowCount  = products.filter((p) => p.status === "Low Stock").length;
  const goodCount = products.filter((p) => p.status === "Active").length;

  const filtered = products.filter((p) => {
    const matchFilter = filter === "All" || p.status === filter;
    const q           = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q)  ||
                        p.category.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Inventory</h1>
        <p className="text-xs text-gray-400">{products.length} products tracked</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["In Stock",    goodCount, "text-green-600",  "bg-green-50",  "border-green-100" ],
          ["Low Stock",   lowCount,  "text-orange-600", "bg-orange-50", "border-orange-100"],
          ["Out of Stock",outCount,  "text-primary",    "bg-red-50",    "border-red-100"   ],
        ].map(([l, v, tc, bg, bc]) => (
          <div key={l} className={`${bg} border ${bc} rounded-2xl p-3.5 text-center`}>
            <p className={`text-2xl font-black ${tc}`}>{v}</p>
            <p className="text-[10px] text-gray-500 font-semibold leading-tight mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {(lowCount + outCount) > 0 && (
        <div className="flex gap-2.5 bg-orange-50 border border-orange-200 rounded-2xl p-3.5">
          <Icon d={ICONS.warning} size={16} className="text-orange-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>{lowCount + outCount} product{(lowCount + outCount) > 1 ? "s" : ""}</strong> need restocking.
            Update stock to keep listings active and visible to buyers.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Icon d={ICONS.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU or category…"
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
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0
              transition cursor-pointer
              ${filter === f
                ? "bg-primary text-white shadow-md shadow-red-200"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inventory list */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <Icon d={ICONS.inventory} size={36} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-semibold">No products found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => {
              const barPct   = Math.min((p.stock / 20) * 100, 100);
              const barColor = p.stock === 0 ? "var(--primary-color)" : p.stock <= p.lowStockThreshold ? "var(--accent-color)" : "#22c55e";

              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50/50 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-[10px] text-gray-400 mb-2">{p.category} · {p.sku}</p>
                    {/* Stock bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${barPct}%`, backgroundColor: barColor }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600 w-16 text-right shrink-0">
                        {p.stock} units
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setRestocking(p)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
                      bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                  >
                    <Icon d={ICONS.refresh} size={12} />
                    Restock
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {restocking && (
        <RestockModal
          product={restocking}
          onSave={handleRestock}
          onClose={() => setRestocking(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
