/**
 * FILE: src/pages/Onboarding.jsx
 *
 * 6-step seller registration & onboarding flow.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * Final submit (Step 6):
 *   → POST /api/seller/register
 *   Body: {
 *     personal:  { firstName, lastName, email, phone, password },
 *     store:     { storeName, category, location, description },
 *     bank:      { bankCode, bankName, accountNumber, accountName },
 *     media:     { logo: cloudinaryUrl | null, banner: cloudinaryUrl | null }
 *   }
 *
 * Images:
 *   → POST /api/cloudinary/upload (called before final submit)
 *   Returns Cloudinary URL; attach to submit body.
 *
 * Bank verification:
 *   → GET /api/seller/bank-accounts/verify?bankCode=&accountNumber=
 *   Calls Paystack resolve endpoint, returns accountName.
 *
 * On success:
 *   - Backend creates seller record + wallet + returns JWT
 *   - Store JWT in localStorage: "seller_token"
 *   - Call props.onComplete() to enter dashboard
 *
 * PROPS:
 *   onComplete() — called when onboarding is done, switches App to dashboard
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef } from "react";
import Icon                 from "../components/ui/Icon";
import { ICONS }            from "../components/ui/icons";
import { BANKS_LIST }       from "../mock/wallet";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Electronics", "Fashion", "Bags & Accessories",
  "Sports & Fitness", "Home & Living", "Health & Beauty",
  "Books & Stationery", "Food & Grocery",
];

const TOTAL_STEPS = 6;

const STEP_META = [
  { title: "Welcome",        subtitle: "Let's get your store ready"           },
  { title: "Personal Info",  subtitle: "Tell us about yourself"               },
  { title: "Store Setup",    subtitle: "Set up your store profile"            },
  { title: "Bank Account",   subtitle: "Where should we send your earnings?"  },
  { title: "Store Media",    subtitle: "Add a logo and banner (optional)"     },
  { title: "Review",         subtitle: "Everything looks good?"               },
];

// ─────────────────────────────────────────────────────────────
// SHARED FIELD COMPONENTS
// ─────────────────────────────────────────────────────────────
const inputCls = (err) => `
  w-full px-3 py-3 rounded-xl bg-gray-50 border text-sm text-gray-800
  placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
  ${err
    ? "border-red-400 bg-red-50 focus:ring-red-200"
    : "border-gray-200 focus:ring-primary/25 focus:border-primary/50"}
`;

const Field = ({ label, error, hint, children }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>}
    {children}
    {hint  && !error && <p className="text-[10px] text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────
const ProgressBar = ({ step }) => (
  <div className="flex gap-1.5 mb-6">
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <div
        key={i}
        className="flex-1 h-1.5 rounded-full transition-all duration-300"
        style={{
          background: i < step
            ? "linear-gradient(to right, #ff5252, #ff8a80)"
            : "#e5e7eb",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD BUTTON
// POST /api/cloudinary/upload — fires on file select
// ─────────────────────────────────────────────────────────────
const ImageUpload = ({ label, preview, aspect, onUpload }) => {
  const ref = useRef();
  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: upload to Cloudinary, use returned URL
    onUpload(URL.createObjectURL(file));
    e.target.value = "";
  };
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
      <div
        onClick={() => ref.current.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30
          bg-red-50/30 hover:border-primary/60 hover:bg-red-50 transition cursor-pointer
          flex items-center justify-center group
          ${aspect === "banner" ? "h-24 w-full" : "h-20 w-20"}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Icon d={ICONS.camera} size={18} className="text-white" />
            </div>
          </>
        ) : (
          <div className="text-center px-2">
            <Icon d={ICONS.upload} size={16} className="text-primary/40 mx-auto mb-1" />
            <p className="text-[10px] text-gray-400 font-medium leading-tight">
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
// INDIVIDUAL STEPS
// ─────────────────────────────────────────────────────────────

// STEP 1 — Welcome screen
const StepWelcome = ({ onNext }) => (
  <div className="text-center py-4 space-y-6">
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-red-300 flex items-center justify-center mx-auto shadow-xl shadow-red-200">
      <Icon d={ICONS.store} size={36} className="text-white" />
    </div>
    <div>
      <h2 className="text-2xl font-black text-gray-900">Welcome to ChequeMart</h2>
      <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
        Set up your seller account in a few steps and start selling to thousands of buyers across Nigeria.
      </p>
    </div>
    <div className="space-y-2 text-left bg-gray-50 border border-gray-100 rounded-2xl p-4">
      {[
        [ICONS.user,       "Personal details & account"],
        [ICONS.store,      "Store name, category & bio"],
        [ICONS.bank,       "Bank account for payouts"],
        [ICONS.camera,     "Logo & banner (optional)"],
      ].map(([icon, label]) => (
        <div key={label} className="flex items-center gap-3 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon d={icon} size={13} className="text-primary" />
          </div>
          <p className="text-sm text-gray-700 font-medium">{label}</p>
        </div>
      ))}
    </div>
    <button
      onClick={onNext}
      className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary-hover transition cursor-pointer shadow-lg shadow-red-200"
    >
      Get Started →
    </button>
  </div>
);

// STEP 2 — Personal info
const StepPersonal = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <Field label="First Name" error={errors.firstName}>
        <input value={data.firstName} onChange={(e) => onChange("firstName", e.target.value)}
          placeholder="John" className={inputCls(!!errors.firstName)} />
      </Field>
      <Field label="Last Name" error={errors.lastName}>
        <input value={data.lastName} onChange={(e) => onChange("lastName", e.target.value)}
          placeholder="Doe" className={inputCls(!!errors.lastName)} />
      </Field>
    </div>
    <Field label="Email Address" error={errors.email}>
      <input type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)}
        placeholder="you@example.com" className={inputCls(!!errors.email)} />
    </Field>
    <Field label="Phone Number" error={errors.phone} hint="Used for order notifications">
      <input type="tel" value={data.phone} onChange={(e) => onChange("phone", e.target.value)}
        placeholder="080XXXXXXXX" className={inputCls(!!errors.phone)} />
    </Field>
    <Field label="Password" error={errors.password} hint="Minimum 8 characters">
      <input type="password" value={data.password} onChange={(e) => onChange("password", e.target.value)}
        placeholder="••••••••" className={inputCls(!!errors.password)} />
    </Field>
  </div>
);

// STEP 3 — Store setup
const StepStore = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <Field label="Store Name" error={errors.storeName} hint="This is what buyers will see">
      <input value={data.storeName} onChange={(e) => onChange("storeName", e.target.value)}
        placeholder="e.g. John's Electronics" className={inputCls(!!errors.storeName)} />
    </Field>
    <Field label="Category" error={errors.category}>
      <select value={data.category} onChange={(e) => onChange("category", e.target.value)}
        className={inputCls(!!errors.category) + " cursor-pointer"}>
        <option value="">Select a category…</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </Field>
    <Field label="Location" error={errors.location} hint="City, State  e.g. Lagos, Nigeria">
      <div className="relative">
        <Icon d={ICONS.map} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={data.location} onChange={(e) => onChange("location", e.target.value)}
          placeholder="Lagos, Nigeria" className={inputCls(!!errors.location) + " pl-9"} />
      </div>
    </Field>
    <Field label="Store Description" error={errors.description} hint="Min 30 characters">
      <textarea value={data.description} onChange={(e) => onChange("description", e.target.value)}
        rows={3} placeholder="Tell buyers what your store is about…"
        className={inputCls(!!errors.description) + " resize-none"} />
    </Field>
  </div>
);

// STEP 4 — Bank account
const StepBank = ({ data, onChange, errors, onVerify, verified, verifying }) => (
  <div className="space-y-4">
    <Field label="Bank" error={errors.bankCode}>
      <select value={data.bankCode} onChange={(e) => {
        const bank = BANKS_LIST.find((b) => b.code === e.target.value);
        onChange("bankCode",  e.target.value);
        onChange("bankName",  bank?.name || "");
      }} className={inputCls(!!errors.bankCode) + " cursor-pointer"}>
        <option value="">Select bank…</option>
        {BANKS_LIST.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
      </select>
    </Field>

    <Field label="Account Number" error={errors.accountNumber}>
      <div className="flex gap-2">
        <input maxLength={10} value={data.accountNumber}
          onChange={(e) => onChange("accountNumber", e.target.value)}
          placeholder="10-digit account number"
          className={inputCls(!!errors.accountNumber) + " flex-1"} />
        <button type="button" onClick={onVerify} disabled={verifying}
          className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer disabled:opacity-50 whitespace-nowrap">
          {verifying ? "Checking…" : "Verify"}
        </button>
      </div>
    </Field>

    {verified && data.accountName && (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
        <Icon d={ICONS.check} size={15} className="text-green-500 stroke-[3] flex-shrink-0" />
        <div>
          <p className="text-[10px] text-gray-400">Account verified</p>
          <p className="text-sm font-black text-gray-800">{data.accountName}</p>
        </div>
      </div>
    )}

    <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
      <Icon d={ICONS.info} size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] text-gray-500 leading-relaxed">
        Your account details are encrypted at rest. We create a Paystack transfer recipient for fast, secure payouts.
      </p>
    </div>
  </div>
);

// STEP 5 — Media upload
const StepMedia = ({ data, onChange }) => (
  <div className="space-y-5">
    <div className="flex gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
      <Icon d={ICONS.info} size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] text-gray-500 leading-relaxed">
        You can skip this step and add media later from the Storefront settings.
      </p>
    </div>
    <ImageUpload label="Store Banner" preview={data.bannerPreview} aspect="banner"
      onUpload={(url) => onChange("bannerPreview", url)} />
    <ImageUpload label="Store Logo" preview={data.logoPreview} aspect="logo"
      onUpload={(url) => onChange("logoPreview", url)} />
  </div>
);

// STEP 6 — Review
const StepReview = ({ personal, store, bank }) => {
  const Section = ({ title, rows }) => (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-4 py-2.5 border-b border-gray-100 bg-white">
        {title}
      </p>
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-gray-100 last:border-0">
          <span className="text-gray-400 font-medium">{k}</span>
          <span className="text-gray-800 font-semibold text-right max-w-[55%] truncate">{v}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      <Section title="Personal"
        rows={[
          ["Name",  `${personal.firstName} ${personal.lastName}`],
          ["Email", personal.email],
          ["Phone", personal.phone],
        ]}
      />
      <Section title="Store"
        rows={[
          ["Store Name",  store.storeName],
          ["Category",    store.category],
          ["Location",    store.location],
          ["Description", store.description?.slice(0, 40) + (store.description?.length > 40 ? "…" : "")],
        ]}
      />
      <Section title="Bank Account"
        rows={[
          ["Bank",    bank.bankName],
          ["Account", bank.accountNumber ? `•••• ${bank.accountNumber.slice(-4)}` : "—"],
          ["Name",    bank.accountName],
        ]}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN ONBOARDING COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [bankVerified,  setBankVerified]  = useState(false);
  const [bankVerifying, setBankVerifying] = useState(false);

  // Form state (all steps combined — avoids re-mount state loss)
  const [personal, setPersonal] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"" });
  const [store,    setStore]    = useState({ storeName:"", category:"", location:"", description:"" });
  const [bank,     setBank]     = useState({ bankCode:"", bankName:"", accountNumber:"", accountName:"" });
  const [media,    setMedia]    = useState({ logoPreview: null, bannerPreview: null });

  const updatePersonal = (k, v) => { setPersonal((p) => ({ ...p, [k]: v })); setErrors({}); };
  const updateStore    = (k, v) => { setStore((p)    => ({ ...p, [k]: v })); setErrors({}); };
  const updateBank     = (k, v) => { setBank((p)     => ({ ...p, [k]: v })); setErrors({}); setBankVerified(false); };
  const updateMedia    = (k, v) => { setMedia((p)    => ({ ...p, [k]: v })); };

  // ── Validation per step ─────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 2) {
      if (!personal.firstName.trim()) e.firstName = "Required";
      if (!personal.lastName.trim())  e.lastName  = "Required";
      if (!personal.email.includes("@")) e.email  = "Enter a valid email";
      if (personal.phone.length < 10) e.phone     = "Enter a valid phone number";
      if (personal.password.length < 8) e.password = "Minimum 8 characters";
    }
    if (step === 3) {
      if (!store.storeName.trim())      e.storeName   = "Store name is required";
      if (!store.category)              e.category    = "Select a category";
      if (!store.location.trim())       e.location    = "Enter your location";
      if (store.description.length < 30) e.description = "Min 30 characters";
    }
    if (step === 4) {
      if (!bank.bankCode)               e.bankCode    = "Select a bank";
      if (bank.accountNumber.length !== 10) e.accountNumber = "Enter a 10-digit account number";
      if (!bankVerified)                e.accountNumber = "Verify account number first";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // GET /api/seller/bank-accounts/verify
  const handleVerifyBank = () => {
    if (!bank.bankCode)                  { setErrors({ bankCode: "Select a bank first" }); return; }
    if (bank.accountNumber.length !== 10){ setErrors({ accountNumber: "Enter a 10-digit account number" }); return; }
    setErrors({});
    setBankVerifying(true);
    // TODO: replace with real fetch call
    setTimeout(() => {
      updateBank("accountName", "JOHN DOE");
      setBankVerified(true);
      setBankVerifying(false);
    }, 1200);
  };

  const handleNext = () => {
    if (step === 1 || step === 5) { setStep((s) => s + 1); return; }
    if (!validate()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  // POST /api/seller/register
  const handleSubmit = () => {
    setSubmitting(true);
    // TODO: replace with real fetch call
    // 1. Upload logo/banner to Cloudinary if set
    // 2. POST /api/seller/register with full payload
    // 3. Store JWT in localStorage
    // 4. Call onComplete()
    setTimeout(() => {
      setSubmitting(false);
      onComplete();
    }, 1800);
  };

  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">

        {/* Fixed header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-50">
          {step > 1 && (
            <ProgressBar step={step - 1} />
          )}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer flex-shrink-0"
              >
                <Icon d={ICONS.chevronR} size={16} className="text-gray-500 rotate-180" />
              </button>
            )}
            <div>
              <h2 className="font-black text-gray-900 text-lg leading-none">
                {STEP_META[step - 1].title}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{STEP_META[step - 1].subtitle}</p>
            </div>
            {step > 1 && (
              <span className="ml-auto text-xs text-gray-400 font-semibold flex-shrink-0">
                {step - 1} / {TOTAL_STEPS - 1}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable step content */}
        <div className="overflow-y-auto max-h-[60vh] px-6 py-5">
          {step === 1 && <StepWelcome onNext={handleNext} />}
          {step === 2 && <StepPersonal data={personal} onChange={updatePersonal} errors={errors} />}
          {step === 3 && <StepStore    data={store}    onChange={updateStore}    errors={errors} />}
          {step === 4 && (
            <StepBank
              data={bank}
              onChange={updateBank}
              errors={errors}
              onVerify={handleVerifyBank}
              verified={bankVerified}
              verifying={bankVerifying}
            />
          )}
          {step === 5 && <StepMedia  data={media}   onChange={updateMedia} />}
          {step === 6 && <StepReview personal={personal} store={store} bank={bank} />}
        </div>

        {/* Fixed footer — only shown after step 1 */}
        {step > 1 && (
          <div className="px-6 py-4 border-t border-gray-50">
            <button
              onClick={isLastStep ? handleSubmit : handleNext}
              disabled={submitting}
              className={`w-full py-3 rounded-2xl text-white font-bold text-sm
                transition cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-60
                ${isLastStep
                  ? "bg-green-500 hover:bg-green-600 shadow-green-200"
                  : "bg-primary hover:bg-primary-hover shadow-red-200"}`}
            >
              {submitting ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Setting up your store…</>
              ) : isLastStep ? (
                <><Icon d={ICONS.check} size={16} className="stroke-[3]" /> Launch My Store</>
              ) : (
                "Continue →"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
