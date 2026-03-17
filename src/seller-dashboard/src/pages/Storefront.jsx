/**
 * FILE: src/pages/Storefront.jsx
 *
 * Seller store profile editor.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount:
 *   → GET /api/seller/profile
 *   Returns full seller profile (see mock for shape)
 *
 * On save:
 *   → PUT /api/seller/profile
 *   Body: { storeName, description, location, category,
 *           logo, banner, socialLinks }
 *   Note: logo + banner are Cloudinary URLs, uploaded first via
 *         POST /api/cloudinary/upload before this PUT is called.
 *
 * MongoDB collection: sellers
 * Fields: _id, storeName, description, location, category,
 *         logo, banner, rating, totalOrders, totalProducts,
 *         isVerified, socialLinks: { instagram, twitter, whatsapp }
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef }  from "react";
import Icon                  from "../components/ui/Icon";
import Toast, { useToast }   from "../components/ui/Toast";
import { ICONS }             from "../components/ui/icons";
import { useSeller }         from "../context/SellerContext";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Electronics", "Fashion", "Bags & Accessories",
  "Sports & Fitness", "Home & Living", "Health & Beauty",
  "Books & Stationery", "Food & Grocery",
];

// ─────────────────────────────────────────────────────────────
// MOCK PROFILE DATA
// Replace with: GET /api/seller/profile
// ─────────────────────────────────────────────────────────────
const MOCK_PROFILE = {
  storeName:    "John's Store",
  description:  "We sell premium quality electronics, fashion and accessories at unbeatable prices. Fast delivery across Nigeria. Customer satisfaction is our priority.",
  location:     "Lagos, Nigeria",
  category:     "Electronics",
  logo:         null,
  banner:       null,
  rating:       4.8,
  totalOrders:  348,
  totalProducts: 5,
  isVerified:   true,
  socialLinks: {
    instagram: "@johnsstore",
    twitter:   "@johnsstore",
    whatsapp:  "08012345678",
  },
};

// ─────────────────────────────────────────────────────────────
// SHARED INPUT STYLES
// ─────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all";

const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>}
    {children}
    {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD BUTTON
// POST /api/cloudinary/upload — fires on file select
// ─────────────────────────────────────────────────────────────
const ImageUploadBtn = ({ label, preview, aspect, onUpload }) => {
  const ref = useRef();

  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: Replace URL.createObjectURL with actual Cloudinary upload call
    // const url = await uploadToCloudinary(file, "banner" | "logo");
    onUpload(URL.createObjectURL(file));
    e.target.value = "";
  };

  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
      <div
        onClick={() => ref.current.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30
          bg-red-50/40 hover:border-primary/60 hover:bg-red-50 transition cursor-pointer
          flex items-center justify-center group
          ${aspect === "banner" ? "h-28 w-full" : "h-24 w-24"}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Icon d={ICONS.camera} size={20} className="text-white" />
            </div>
          </>
        ) : (
          <div className="text-center">
            <Icon d={ICONS.upload} size={18} className="text-primary/40 mx-auto mb-1" />
            <p className="text-[10px] text-gray-400 font-medium">
              {aspect === "banner" ? "1200 × 300px" : "1:1 ratio"}
            </p>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LIVE STORE PREVIEW (buyer-facing card preview)
// ─────────────────────────────────────────────────────────────
const StorePreview = ({ form, stats }) => (
  <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
    {/* Banner */}
    <div className="h-20 bg-gradient-to-r from-dark to-primary/60 relative overflow-hidden">
      {form.bannerPreview && (
        <img src={form.bannerPreview} alt="" className="w-full h-full object-cover" />
      )}
      <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
        BUYER VIEW
      </span>
    </div>
    {/* Logo + info */}
    <div className="px-4 pb-4">
      <div className="flex items-end gap-3 -mt-6 mb-3">
        <div className="w-14 h-14 rounded-2xl border-2 border-white bg-gradient-to-br from-primary to-red-300 flex items-center justify-center text-white font-black text-lg shadow-md overflow-hidden flex-shrink-0">
          {form.logoPreview
            ? <img src={form.logoPreview} alt="" className="w-full h-full object-cover" />
            : form.storeName.charAt(0).toUpperCase()}
        </div>
        <div className="pb-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-black text-gray-900 leading-none">{form.storeName || "Your Store"}</p>
            {stats.isVerified && <Icon d={ICONS.shieldCheck} size={12} className="text-primary" />}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Icon d={ICONS.star} size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] text-gray-500 font-semibold">{stats.rating} · {stats.totalOrders} orders</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {form.description || "Your store description will appear here…"}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        <Icon d={ICONS.map} size={10} className="text-gray-400" />
        <span className="text-[10px] text-gray-400">{form.location || "Location"}</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// STOREFRONT PAGE
// ─────────────────────────────────────────────────────────────
export default function StorefrontPage() {
  const { setSeller }      = useSeller();
  const { toast, showToast } = useToast();

  const [form, setForm] = useState({
    storeName:     MOCK_PROFILE.storeName,
    description:   MOCK_PROFILE.description,
    location:      MOCK_PROFILE.location,
    category:      MOCK_PROFILE.category,
    instagram:     MOCK_PROFILE.socialLinks.instagram,
    twitter:       MOCK_PROFILE.socialLinks.twitter,
    whatsapp:      MOCK_PROFILE.socialLinks.whatsapp,
    logoPreview:   MOCK_PROFILE.logo,
    bannerPreview: MOCK_PROFILE.banner,
  });

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // PUT /api/seller/profile
  const handleSave = () => {
    setSaving(true);
    // TODO: replace setTimeout with real fetch call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      // Update global context so Topbar/Sidebar reflect new store name
      setSeller((prev) => ({ ...prev, storeName: form.storeName }));
      showToast("✅ Store profile updated successfully");
      setTimeout(() => setSaved(false), 2500);
    }, 800);
  };

  const stats = {
    rating:        MOCK_PROFILE.rating,
    totalOrders:   MOCK_PROFILE.totalOrders,
    isVerified:    MOCK_PROFILE.isVerified,
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Storefront</h1>
          <p className="text-xs text-gray-400">Customise how buyers see your store</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold
            transition cursor-pointer shadow-md disabled:opacity-60
            ${saved ? "bg-green-500 text-white shadow-green-200" : "bg-primary text-white hover:bg-primary-hover shadow-red-200"}`}
        >
          {saved
            ? <><Icon d={ICONS.check} size={14} className="stroke-[3]" /> Saved</>
            : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          [ICONS.star,    `${stats.rating} ★`, "Rating",       "text-yellow-500"],
          [ICONS.orders,  MOCK_PROFILE.totalOrders, "Orders",   "text-primary"   ],
          [ICONS.package, MOCK_PROFILE.totalProducts,"Products","text-blue-500"  ],
        ].map(([icon, val, lbl, c]) => (
          <div key={lbl} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 text-center">
            <Icon d={icon} size={16} className={`${c} mx-auto mb-1`} />
            <p className={`text-lg font-black ${c}`}>{val}</p>
            <p className="text-[10px] text-gray-400 font-semibold">{lbl}</p>
          </div>
        ))}
      </div>

      {/* Verified badge */}
      {stats.isVerified && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-2xl p-3.5">
          <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Icon d={ICONS.shieldCheck} size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-700">Verified Seller</p>
            <p className="text-xs text-gray-500">Your store displays a verified badge to buyers.</p>
          </div>
        </div>
      )}

      {/* Media uploads */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-black text-gray-900 text-sm">Store Media</h2>
        <ImageUploadBtn label="Store Banner" preview={form.bannerPreview} aspect="banner"
          onUpload={(url) => setForm((p) => ({ ...p, bannerPreview: url }))} />
        <ImageUploadBtn label="Store Logo" preview={form.logoPreview} aspect="logo"
          onUpload={(url) => setForm((p) => ({ ...p, logoPreview: url }))} />
      </div>

      {/* Store info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-black text-gray-900 text-sm">Store Information</h2>

        <Field label="Store Name" hint="This is the name buyers see on your store page">
          <input value={form.storeName} onChange={update("storeName")} placeholder="e.g. John's Electronics" className={inputCls} />
        </Field>

        <Field label="Category">
          <select value={form.category} onChange={update("category")} className={inputCls + " cursor-pointer"}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Location" hint="City, State  e.g. Lagos, Nigeria">
          <div className="relative">
            <Icon d={ICONS.map} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={form.location} onChange={update("location")} placeholder="Lagos, Nigeria" className={inputCls + " pl-9"} />
          </div>
        </Field>

        <Field label="Store Description" hint="Min 50 characters recommended for better visibility">
          <textarea value={form.description} onChange={update("description")} rows={4}
            placeholder="Describe your store, products and what sets you apart…"
            className={inputCls + " resize-none"} />
          <p className="text-[10px] text-gray-300 text-right">{form.description.length} chars</p>
        </Field>
      </div>

      {/* Social links */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="font-black text-gray-900 text-sm">Social Links</h2>
          <p className="text-xs text-gray-400 mt-0.5">Optional — shown on your public store page to build buyer trust</p>
        </div>
        {[
          ["Instagram",   "instagram", "@yourstore"  ],
          ["Twitter / X", "twitter",   "@yourstore"  ],
          ["WhatsApp",    "whatsapp",  "080XXXXXXXX" ],
        ].map(([label, key, ph]) => (
          <Field key={key} label={label}>
            <div className="relative">
              <Icon d={ICONS.link} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={form[key]} onChange={update(key)} placeholder={ph} className={inputCls + " pl-9"} />
            </div>
          </Field>
        ))}
      </div>

      {/* Live preview */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Icon d={ICONS.eye} size={15} className="text-gray-400" />
          <h2 className="font-black text-gray-900 text-sm">Live Preview</h2>
        </div>
        <p className="text-xs text-gray-400">How your store card appears to buyers</p>
        <StorePreview form={form} stats={stats} />
      </div>

      {/* Save — bottom */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-2xl text-white font-bold text-sm transition cursor-pointer
          flex items-center justify-center gap-2 shadow-md disabled:opacity-60
          ${saved ? "bg-green-500 shadow-green-200" : "bg-primary hover:bg-primary-hover shadow-red-200"}`}
      >
        {saved
          ? <><Icon d={ICONS.check} size={16} className="stroke-[3]" /> Changes Saved!</>
          : saving ? "Saving…" : "Save Store Profile"}
      </button>

      <Toast toast={toast} />
    </div>
  );
}
