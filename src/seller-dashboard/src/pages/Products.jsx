/**
 * FILE: src/pages/Products.jsx
 *
 * Product listing page with Add / Edit / Delete.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount:
 *   → GET /api/seller/products?page=1&limit=10
 *
 * Add product:
 *   → POST /api/seller/products/add
 *   Body: { name, price, stock, category, condition, sku, description, images[] }
 *   Upload images first → POST /api/cloudinary/upload (per image)
 *
 * Edit product:
 *   → PUT /api/seller/products/:id
 *
 * Delete product:
 *   → DELETE /api/seller/products/:id
 *   Backend should also clean up Cloudinary images for this product.
 *
 * MongoDB collection: products
 * ─────────────────────────────────────────────────────────────
 */

import { useState }        from "react";
import Icon                from "../components/ui/Icon";
import StatusBadge         from "../components/ui/StatusBadge";
import ProductModal        from "../components/ui/ProductModal";
import Toast, { useToast } from "../components/ui/Toast";
import { ICONS }           from "../components/ui/icons";
import { mockProducts }    from "../mock/products";

const fmt = (n) => "₦" + Number(n).toLocaleString();

// ─────────────────────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────────────────────
const DeleteConfirm = ({ product, onConfirm, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center space-y-4 animate-pop-in">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
        <Icon d={ICONS.trash} size={24} className="text-red-500" />
      </div>
      <div>
        <h3 className="font-black text-gray-900 text-base">Delete Product?</h3>
        <p className="text-sm text-gray-500 mt-1">
          <strong>{product.name}</strong> will be permanently removed from your store.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition cursor-pointer"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products,     setProducts]     = useState(mockProducts);
  const [search,       setSearch]       = useState("");
  const [modalProduct, setModalProduct] = useState(undefined); // undefined=closed, null=add, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast }            = useToast();

  // ── Derived stats ─────────────────────────────────────────
  const total    = products.length;
  const active   = products.filter((p) => p.status === "Active").length;
  const lowStock = products.filter((p) => p.status === "Low Stock").length;
  const out      = products.filter((p) => p.status === "Out").length;

  // ── Filtered list ─────────────────────────────────────────
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  // ── Handlers ──────────────────────────────────────────────

  // POST /api/seller/products/add  OR  PUT /api/seller/products/:id
  const handleSave = (saved) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
    });
    showToast(saved.id && products.find((p) => p.id === saved.id)
      ? "✅ Product updated"
      : "✅ Product added");
  };

  // DELETE /api/seller/products/:id
  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("🗑️ Product deleted");
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Products</h1>
          <p className="text-xs text-gray-400">{total} products in your store</p>
        </div>
        <button
          onClick={() => setModalProduct(null)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition cursor-pointer shadow-md shadow-red-200"
        >
          <Icon d={ICONS.plus} size={15} />
          Add Product
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          ["Total",     total,    "text-gray-900"   ],
          ["Active",    active,   "text-green-600"  ],
          ["Low Stock", lowStock, "text-orange-500" ],
          ["Out",       out,      "text-primary"    ],
        ].map(([l, v, c]) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
            <p className={`text-xl font-black ${c}`}>{v}</p>
            <p className="text-[10px] text-gray-400 font-semibold leading-tight mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Icon d={ICONS.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category or SKU…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
        />
      </div>

      {/* Products list */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <Icon d={ICONS.package} size={36} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-semibold">No products found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((product) => (
              <div key={product.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50/50 transition">

                {/* Placeholder image / initial */}
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 text-primary font-black text-sm">
                  {product.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                    <StatusBadge status={product.status} />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {product.category} · {product.sku} · {product.stock} in stock
                  </p>
                </div>

                {/* Price */}
                <p className="text-sm font-black text-gray-900 flex-shrink-0">{fmt(product.price)}</p>

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setModalProduct(product)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition cursor-pointer"
                    aria-label="Edit product"
                  >
                    <Icon d={ICONS.edit} size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(product)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition cursor-pointer"
                    aria-label="Delete product"
                  >
                    <Icon d={ICONS.trash} size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onSave={handleSave}
          onClose={() => setModalProduct(undefined)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
