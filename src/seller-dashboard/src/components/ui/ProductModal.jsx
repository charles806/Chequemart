/**
 * FILE: src/components/ui/ProductModal.jsx
 *
 * Add / Edit Product modal.
 * Used by src/pages/Products.jsx
 *
 * PROPS:
 *   product  — null → Add mode | product object → Edit mode
 *   onSave(product)  — called with the saved product object
 *   onClose()        — called to close the modal
 *
 * API (wired via onSave callback in Products.jsx):
 *   Add:    POST /api/seller/products/add
 *   Edit:   PUT  /api/seller/products/:id
 *   Images: POST /api/cloudinary/upload  (per image, before saving)
 */

import { useState, useRef } from "react";
import Icon                 from "./Icon";
import { ICONS }            from "./icons";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Electronics", "Fashion", "Bags & Accessories",
  "Sports & Fitness", "Home & Living", "Health & Beauty",
  "Books & Stationery", "Food & Grocery",
];

const CONDITIONS = ["Brand New", "Like New", "Fairly Used", "Refurbished"];

const EMPTY_FORM = {
  name: "", price: "", stock: "", category: "",
  condition: "Brand New", sku: "", description: "",
  images: [], status: "Active",
};

// ─────────────────────────────────────────────────────────────
// SHARED FIELD COMPONENTS (scoped to this file)
// ─────────────────────────────────────────────────────────────
const inputCls = (hasError) => `
  w-full px-3 py-2.5 rounded-xl bg-gray-50 border text-sm text-gray-800
  placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
  ${hasError
    ? "border-red-400 bg-red-50 focus:ring-red-200"
    : "border-gray-200 focus:ring-primary/25 focus:border-primary/50"}
`;

const Field = ({ label, error, hint, children }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
    )}
    {children}
    {hint  && !error && <p className="text-[10px] text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const FInput = ({ label, error, hint, prefix, ...props }) => (
  <Field label={label} error={error} hint={hint}>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
          {prefix}
        </span>
      )}
      <input className={inputCls(!!error) + (prefix ? " pl-7" : "")} {...props} />
    </div>
  </Field>
);

const FSelect = ({ label, error, options, ...props }) => (
  <Field label={label} error={error}>
    <select className={inputCls(!!error) + " cursor-pointer"} {...props}>
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </Field>
);

const FTextarea = ({ label, error, hint, ...props }) => (
  <Field label={label} error={error} hint={hint}>
    <textarea className={inputCls(!!error) + " resize-none"} rows={3} {...props} />
  </Field>
);

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD STRIP
// POST /api/cloudinary/upload — called per image on file select
// ─────────────────────────────────────────────────────────────
const ImageUpload = ({ images, onChange }) => {
  const inputRef = useRef();

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onChange([...images, ...newFiles].slice(0, 5));
    // Reset input so the same file can be re-selected if removed
    e.target.value = "";
  };

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(images[index].preview);
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <Field label="Product Images" hint="Up to 5 images. First image is used as the cover.">
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 group flex-shrink-0"
          >
            <img src={img.preview} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-0 inset-x-0 bg-primary text-white text-[8px] font-bold text-center py-0.5">
                COVER
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white
                opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
              aria-label="Remove image"
            >
              <Icon d={ICONS.close} size={8} />
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-primary/30
              bg-red-50/50 hover:border-primary/60 hover:bg-red-50 transition
              flex flex-col items-center justify-center gap-0.5 flex-shrink-0 cursor-pointer"
            aria-label="Add image"
          >
            <Icon d={ICONS.upload} size={16} className="text-primary/50" />
            <span className="text-[9px] text-gray-400 font-medium">Add</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />
    </Field>
  );
};

// ─────────────────────────────────────────────────────────────
// PRODUCT MODAL
// ─────────────────────────────────────────────────────────────
const ProductModal = ({ product, onSave, onClose }) => {
  const isEdit = !!product?.id;

  const [form, setForm] = useState(
    product
      ? { ...product, price: String(product.price), stock: String(product.stock) }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});
  const [saved,  setSaved]  = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())                                       e.name        = "Product name is required";
    if (!form.price || isNaN(form.price) || +form.price <= 0)   e.price       = "Enter a valid price";
    if (form.stock === "" || isNaN(form.stock) || +form.stock < 0) e.stock    = "Enter a valid stock quantity";
    if (!form.category)                                          e.category    = "Select a category";
    if (!form.description.trim())                                e.description = "Add a product description";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Auto-compute status from stock ──────────────────────
  const computeStatus = (stock) => {
    const n = Number(stock);
    if (n === 0)  return "Out";
    if (n <= 3)   return "Low Stock";
    return "Active";
  };

  // ── Save handler (called by parent's fetch) ──────────────
  // POST /api/seller/products/add  OR  PUT /api/seller/products/:id
  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      ...form,
      price:  Number(form.price),
      stock:  Number(form.stock),
      status: computeStatus(form.stock),
      id:     product?.id ?? Date.now(),
    };

    onSave(payload);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  const liveStatus  = computeStatus(form.stock || 0);
  const statusColor = {
    "Out":       "bg-red-50 border-red-100 text-red-600",
    "Low Stock": "bg-orange-50 border-orange-100 text-orange-600",
    "Active":    "bg-green-50 border-green-100 text-green-600",
  }[liveStatus];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon d={isEdit ? ICONS.edit : ICONS.plus} size={15} className="text-primary" />
            </div>
            <h2 className="font-black text-gray-900 text-base">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
            aria-label="Close"
          >
            <Icon d={ICONS.close} size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <ImageUpload
            images={form.images}
            onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
          />

          <FInput
            label="Product Name"
            placeholder="e.g. Sony WH-1000XM5 Headphones"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-3">
            <FInput
              label="Price (₦)"
              prefix="₦"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={update("price")}
              error={errors.price}
            />
            <FInput
              label="Stock Qty"
              type="number"
              placeholder="0"
              value={form.stock}
              onChange={update("stock")}
              error={errors.stock}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FSelect
              label="Category"
              options={CATEGORIES}
              value={form.category}
              onChange={update("category")}
              error={errors.category}
            />
            <FSelect
              label="Condition"
              options={CONDITIONS}
              value={form.condition}
              onChange={update("condition")}
            />
          </div>

          <FInput
            label="SKU / Product Code"
            placeholder="Leave blank to auto-generate"
            hint="A unique identifier for this product"
            value={form.sku}
            onChange={update("sku")}
          />

          <FTextarea
            label="Description"
            placeholder="Describe your product — features, specs, what's included…"
            hint="Min 20 characters recommended for better search visibility"
            value={form.description}
            onChange={update("description")}
            error={errors.description}
          />

          <FSelect
            label="Listing Status"
            options={["Active", "Draft"]}
            value={["Active", "Draft"].includes(form.status) ? form.status : "Active"}
            onChange={update("status")}
          />

          {/* Live stock status preview */}
          {form.stock !== "" && !isNaN(form.stock) && (
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border ${statusColor}`}>
              <Icon d={ICONS.tag} size={13} />
              Status will be set to: <strong>{liveStatus}</strong>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all cursor-pointer
              flex items-center justify-center gap-2 shadow-md
              ${saved
                ? "bg-green-500 shadow-green-200"
                : "bg-primary hover:bg-primary-hover shadow-red-200"}`}
          >
            {saved ? (
              <><Icon d={ICONS.check} size={15} className="stroke-[3]" /> Saved!</>
            ) : (
              isEdit ? "Save Changes" : "Add Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
