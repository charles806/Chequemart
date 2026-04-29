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
 *     bank:      { bankCode, bankName, accountNumber, accountName, accountType },
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
 *   - Store JWT in Cookies: "accessToken"
 *   - Call props.onComplete() to enter dashboard
 *
 * PROPS:
 *   onComplete() — called when onboarding is done, switches App to dashboard
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Icon from "../components/ui/Icon";
import { ICONS } from "../components/ui/icons";
import { BANKS_LIST } from "../constants/banks";
import img from "../../assets/image/logo1.png";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Bags & Accessories",
  "Sports & Fitness",
  "Home & Living",
  "Health & Beauty",
  "Books & Stationery",
  "Food & Grocery",
];

const TOTAL_STEPS = 6;

const STEP_META = [
  { title: "Welcome", subtitle: "Let's get your store ready" },
  { title: "Personal Info", subtitle: "Tell us about yourself" },
  { title: "Store Setup", subtitle: "Set up your store profile" },
  { title: "Bank Account", subtitle: "Where should we send your earnings?" },
  { title: "Store Media", subtitle: "Add a logo and banner (optional)" },
  { title: "Review", subtitle: "Everything looks good?" },
];

// ─────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+234|0)[789][01]\d{8}$/;

const validators = {
  personal: ({ firstName, lastName, email, phone }) => {
    const e = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address";
    if (!PHONE_RE.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Nigerian phone number";
    return e;
  },
  store: ({ storeName, category, location, description }) => {
    const e = {};
    if (!storeName.trim()) e.storeName = "Store name is required";
    if (storeName.trim().length > 50)
      e.storeName = "Store name must be 50 characters or less";
    if (!category) e.category = "Select a category";
    if (!location.trim()) e.location = "Enter your location";
    if (description.trim().length < 30)
      e.description = "Description must be at least 30 characters";
    return e;
  },
  bank: ({ bankCode, accountNumber }, bankVerified) => {
    const e = {};
    if (!bankCode) e.bankCode = "Select a bank";
    if (!/^\d{10}$/.test(accountNumber))
      e.accountNumber = "Enter a valid 10-digit account number";
    else if (!bankVerified)
      e.accountNumber = "Please verify your account number";
    return e;
  },
};

// ─────────────────────────────────────────────────────────────
// SHARED FIELD COMPONENTS
// ─────────────────────────────────────────────────────────────
const inputCls = (err) => `
  w-full px-3 py-3 rounded-xl bg-gray-50 border text-sm text-gray-800
  placeholder-gray-400 focus:outline-none focus:ring-2 transition-all
  ${err
    ? "border-red-400 bg-red-50 focus:ring-red-200"
    : "border-gray-200 focus:ring-[#ff5252]/25 focus:border-[#ff5252]/50"
  }
`;

const Field = ({ label, error, hint, children, htmlFor }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label
        htmlFor={htmlFor}
        className="text-xs font-bold text-gray-500 uppercase tracking-wide"
      >
        {label}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-[10px] text-gray-400">{hint}</p>}
    {error && (
      <p role="alert" className="text-xs text-red-500 font-medium">
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────
const ProgressBar = ({ step }) => (
  <div className="flex gap-1.5 mb-6" role="progressbar" aria-valuenow={step} aria-valuemax={TOTAL_STEPS - 1}>
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <div
        key={i}
        className="flex-1 h-1.5 rounded-full transition-all duration-300"
        style={{
          background:
            i < step
              ? "linear-gradient(to right, #ff5252, #ff867f)"
              : "#e5e7eb",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD BUTTON
// ─────────────────────────────────────────────────────────────
const MAX_IMAGE_SIZE_MB = 5;

const ImageUpload = ({ label, preview, aspect, onUpload }) => {
  const ref = useRef();
  const [uploadError, setUploadError] = useState("");

  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setUploadError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    onUpload(URL.createObjectURL(file));
    e.target.value = "";
  };

  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onClick={() => ref.current.click()}
        onKeyDown={(e) => e.key === "Enter" && ref.current.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-[#ff5252]/30
          bg-red-50/30 hover:border-[#ff5252]/60 hover:bg-red-50 transition cursor-pointer
          flex items-center justify-center group
          ${aspect === "banner" ? "h-24 w-full" : "h-20 w-20"}`}
      >
        {preview ? (
          <>
            <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Icon d={ICONS.camera} size={18} className="text-white" />
            </div>
          </>
        ) : (
          <div className="text-center px-2">
            <Icon
              d={ICONS.upload}
              size={16}
              className="text-[#ff5252]/40 mx-auto mb-1"
            />
            <p className="text-[10px] text-gray-400 font-medium leading-tight">
              {aspect === "banner" ? "1200 × 300px" : "1:1 ratio"}
            </p>
          </div>
        )}
      </div>
      {uploadError && (
        <p role="alert" className="text-xs text-red-500 mt-1 font-medium">
          {uploadError}
        </p>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handle}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────────────────────

// STEP 1 — Welcome
const StepWelcome = ({ onNext }) => (
  <div className="text-center py-4 space-y-6">
    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto">
      <img src={img} alt="ChequeMart logo" className="w-full h-full object-cover" />
    </div>
    <div>
      <h2 className="text-2xl font-black text-gray-900">Welcome to ChequeMart</h2>
      <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
        Set up your seller account in a few steps and start selling to thousands
        of buyers across Nigeria.
      </p>
    </div>
    <div className="space-y-2 text-left bg-gray-50 border border-gray-100 rounded-2xl p-4">
      {[
        [ICONS.user, "Personal details & account"],
        [ICONS.store, "Store name, category & bio"],
        [ICONS.bank, "Bank account for payouts"],
        [ICONS.camera, "Logo & banner (optional)"],
      ].map(([icon, label]) => (
        <div key={label} className="flex items-center gap-3 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#ff5252]/10 flex items-center justify-center shrink-0">
            <Icon d={icon} size={13} className="text-[#ff5252]" />
          </div>
          <p className="text-sm text-gray-700 font-medium">{label}</p>
        </div>
      ))}
    </div>
    <button
      onClick={onNext}
      className="w-full py-3.5 rounded-2xl bg-[#ff5252] text-white font-bold text-base hover:bg-red-500 transition cursor-pointer shadow-lg shadow-red-200"
    >
      Get Started →
    </button>
  </div>
);

// STEP 2 — Personal info
const StepPersonal = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <Field label="First Name" error={errors.firstName} htmlFor="firstName">
        <input
          id="firstName"
          value={data.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          placeholder="John"
          autoComplete="given-name"
          className={inputCls(!!errors.firstName)}
        />
      </Field>
      <Field label="Last Name" error={errors.lastName} htmlFor="lastName">
        <input
          id="lastName"
          value={data.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          placeholder="Doe"
          autoComplete="family-name"
          className={inputCls(!!errors.lastName)}
        />
      </Field>
    </div>
    <Field label="Email Address" error={errors.email} htmlFor="email">
      <input
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        className={inputCls(!!errors.email)}
      />
    </Field>
    <Field
      label="Phone Number"
      error={errors.phone}
      hint="Used for order notifications"
      htmlFor="phone"
    >
      <input
        id="phone"
        type="tel"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="080XXXXXXXX"
        autoComplete="tel"
        inputMode="tel"
        maxLength={14}
        className={inputCls(!!errors.phone)}
      />
    </Field>
  </div>
);

// STEP 3 — Store setup
const StepStore = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <Field
      label="Store Name"
      error={errors.storeName}
      hint={`${data.storeName.length}/50 — this is what buyers will see`}
      htmlFor="storeName"
    >
      <input
        id="storeName"
        value={data.storeName}
        onChange={(e) => onChange("storeName", e.target.value)}
        placeholder="e.g. John's Electronics"
        maxLength={50}
        className={inputCls(!!errors.storeName)}
      />
    </Field>
    <Field label="Category" error={errors.category} htmlFor="category">
      <select
        id="category"
        value={data.category}
        onChange={(e) => onChange("category", e.target.value)}
        className={inputCls(!!errors.category) + " cursor-pointer"}
      >
        <option value="">Select a category…</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </Field>
    <Field
      label="Location"
      error={errors.location}
      hint="City, State e.g. Lagos, Nigeria"
      htmlFor="location"
    >
      <div className="relative">
        <Icon
          d={ICONS.map}
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          id="location"
          value={data.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="Lagos, Nigeria"
          className={inputCls(!!errors.location) + " pl-9"}
        />
      </div>
    </Field>
    <Field
      label="Store Description"
      error={errors.description}
      hint={`${data.description.length} / 30 min characters`}
      htmlFor="description"
    >
      <textarea
        id="description"
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={3}
        placeholder="Tell buyers what your store is about…"
        className={inputCls(!!errors.description) + " resize-none"}
      />
    </Field>
  </div>
);

// STEP 4 — Bank account
const StepBank = ({ data, onChange, errors, onVerify, verified, verifying }) => {
  // Only show verify button when both bank + 10-digit account are filled
  const canVerify =
    data.bankCode && /^\d{10}$/.test(data.accountNumber) && !verified;

  return (
    <div className="space-y-4">
      <Field label="Bank" error={errors.bankCode} htmlFor="bankCode">
        <select
          id="bankCode"
          value={data.bankCode}
          onChange={(e) => {
            const bank = BANKS_LIST.find((b) => b.code === e.target.value);
            onChange("bankCode", e.target.value);
            onChange("bankName", bank?.name || "");
            onChange("accountType", bank?.accountType || "");
          }}
          className={inputCls(!!errors.bankCode) + " cursor-pointer"}
        >
          <option value="">Select bank…</option>
          {BANKS_LIST.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Account Number" error={errors.accountNumber} htmlFor="accountNumber">
        <div className="flex gap-2">
          <input
            id="accountNumber"
            maxLength={10}
            value={data.accountNumber}
            onChange={(e) => {
              // Only allow digits
              const val = e.target.value.replace(/\D/g, "");
              onChange("accountNumber", val);
            }}
            placeholder="10-digit account number"
            inputMode="numeric"
            className={inputCls(!!errors.accountNumber) + " flex-1"}
          />
          <button
            type="button"
            onClick={onVerify}
            disabled={verifying || !canVerify}
            className="px-3 py-2 rounded-xl bg-[#ff5252]/10 text-[#ff5252] text-xs font-bold hover:bg-[#ff5252]/20 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {verifying ? "Checking…" : verified ? "✓ Done" : "Verify"}
          </button>
        </div>
      </Field>

      {verified && data.accountName && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
          <Icon
            d={ICONS.check}
            size={15}
            className="text-green-500 stroke-3 shrink-0"
          />
          <div>
            <p className="text-[10px] text-gray-400">Account verified</p>
            <p className="text-sm font-black text-gray-800">{data.accountName}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
        <Icon d={ICONS.info} size={14} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Your account details are encrypted at rest. We create a Paystack
          transfer recipient for fast, secure payouts.
        </p>
      </div>
    </div>
  );
};

// STEP 5 — Media upload
const StepMedia = ({ data, onChange }) => (
  <div className="space-y-5">
    <div className="flex gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
      <Icon d={ICONS.info} size={14} className="text-gray-400 shrink-0 mt-0.5" />
      <p className="text-[11px] text-gray-500 leading-relaxed">
        You can skip this step and add media later from the Storefront settings.
      </p>
    </div>
    <ImageUpload
      label="Store Banner"
      preview={data.bannerPreview}
      aspect="banner"
      onUpload={(url) => onChange("bannerPreview", url)}
    />
    <ImageUpload
      label="Store Logo"
      preview={data.logoPreview}
      aspect="logo"
      onUpload={(url) => onChange("logoPreview", url)}
    />
  </div>
);

// STEP 6 — Review
const Section = ({ title, rows }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-4 py-2.5 border-b border-gray-100 bg-white">
      {title}
    </p>
    {rows
      .filter(([, v]) => v)
      .map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-gray-100 last:border-0"
        >
          <span className="text-gray-400 font-medium">{k}</span>
          <span className="text-gray-800 font-semibold text-right max-w-[55%] truncate">
            {v}
          </span>
        </div>
      ))}
  </div>
);

const StepReview = ({ personal, store, bank }) => (
  <div className="space-y-3">
    <Section
      title="Personal"
      rows={[
        ["Name", `${personal.firstName} ${personal.lastName}`.trim()],
        ["Email", personal.email],
        ["Phone", personal.phone],
      ]}
    />
    <Section
      title="Store"
      rows={[
        ["Store Name", store.storeName],
        ["Category", store.category],
        ["Location", store.location],
        [
          "Description",
          store.description?.slice(0, 40) +
          (store.description?.length > 40 ? "…" : ""),
        ],
      ]}
    />
    <Section
      title="Bank Account"
      rows={[
        ["Bank", bank.bankName],
        [
          "Account",
          bank.accountNumber
            ? `•••• ${bank.accountNumber.slice(-4)}`
            : "—",
        ],
        ["Name", bank.accountName],
      ]}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN ONBOARDING COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [bankVerified, setBankVerified] = useState(false);
  const [bankVerifying, setBankVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [store, setStore] = useState({
    storeName: "",
    category: "",
    location: "",
    description: "",
  });
  const [bank, setBank] = useState({
    bankCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    accountType: "",
  });
  const [media, setMedia] = useState({
    logoPreview: null,
    bannerPreview: null,
  });

  // Cleared errors on each field change
  const updatePersonal = useCallback((k, v) => {
    setPersonal((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }, []);

  const updateStore = useCallback((k, v) => {
    setStore((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }, []);

  const updateBank = useCallback((k, v) => {
    setBank((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    // Reset verification whenever bank details change
    if (k === "bankCode" || k === "accountNumber") {
      setBankVerified(false);
    }
  }, []);

  const updateMedia = useCallback((k, v) => {
    setMedia((p) => ({ ...p, [k]: v }));
  }, []);

  // ── Fetch pre-filled user data ────────────────────────────
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) return;

        const { user } = await response.json();

        let fetchedPersonal = { firstName: "", lastName: "", email: "", phone: "" };
        if (user?.name) {
          const [firstName = "", ...rest] = user.name.split(" ");
          fetchedPersonal = {
            firstName,
            lastName: rest.join(" "),
            email: user.email || "",
            phone: user.phone || "",
          };
          setPersonal(fetchedPersonal);
        }

        let fetchedStore = { storeName: "", category: "", location: "", description: "" };
        if (user?.sellerInfo) {
          fetchedStore = {
            storeName: user.sellerInfo.storeName || "",
            category: user.sellerInfo.businessCategory || "",
            location: user.sellerInfo.businessAddress || "",
            description: user.sellerInfo.description || "",
          };
          setStore(fetchedStore);
        }

        // Determine initial step: skip completed pieces of data
        const pErrors = validators.personal(fetchedPersonal);
        const sErrors = validators.store(fetchedStore);

        if (Object.keys(pErrors).length > 0) {
          setStep(2); // Missing personal info
        } else if (Object.keys(sErrors).length > 0) {
          setStep(3); // Missing store info
        } else {
          setStep(4); // Start at Bank info
        }
      } catch (err) {
        // Non-fatal — user can fill in manually
        console.warn("Could not pre-fill user data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ── Validation ────────────────────────────────────────────
  const validate = useCallback(() => {
    let e = {};
    if (step === 2) e = validators.personal(personal);
    if (step === 3) e = validators.store(store);
    if (step === 4) e = validators.bank(bank, bankVerified);
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, personal, store, bank, bankVerified]);

  // ── Bank verification ─────────────────────────────────────
  const handleVerifyBank = useCallback(async () => {
    if (!bank.bankCode) {
      setErrors({ bankCode: "Select a bank first" });
      return;
    }
    if (!/^\d{10}$/.test(bank.accountNumber)) {
      setErrors({ accountNumber: "Enter a valid 10-digit account number" });
      return;
    }

    setErrors({});
    setBankVerifying(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resolve-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bankCode: bank.bankCode,
            accountNumber: bank.accountNumber,
            accountType: bank.accountType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      updateBank("accountName", data.accountName);
      setBankVerified(true);
    } catch (err) {
      setErrors({ accountNumber: err.message || "Verification failed. Please try again." });
    } finally {
      setBankVerifying(false);
    }
  }, [bank.bankCode, bank.accountNumber, updateBank]);

  // ── Navigation ────────────────────────────────────────────
  const handleNext = () => {
    // Step 1 (Welcome) and Step 5 (Media) have no validation
    if (step === 1 || step === 5) {
      setStep((s) => s + 1);
      return;
    }
    if (!validate()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setSubmitError("");
    setStep((s) => s - 1);
  };

  // ── Final submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Session expired. Please log in again.");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/complete-onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ personal, store, bank }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      if (data.user) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
      }

      onComplete();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading screen ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5252] mx-auto mb-4" />
          <p className="text-gray-500">Loading your information…</p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <div className="h-screen bg-surface flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md flex flex-col overflow-hidden"
        style={{ height: "min(680px, calc(100vh - 32px))" }}
      >
        {/* Fixed header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-50 shrink-0">
          {step > 1 && <ProgressBar step={step - 1} />}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer shrink-0"
              >
                <Icon
                  d={ICONS.chevronR}
                  size={16}
                  className="text-gray-500 rotate-180"
                />
              </button>
            )}
            <div>
              <h2 className="font-black text-gray-900 text-lg leading-none">
                {STEP_META[step - 1].title}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {STEP_META[step - 1].subtitle}
              </p>
            </div>
            {step > 1 && (
              <span className="ml-auto text-xs text-gray-400 font-semibold shrink-0">
                {step - 1} / {TOTAL_STEPS - 1}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {step === 1 && <StepWelcome onNext={handleNext} />}
          {step === 2 && (
            <StepPersonal
              data={personal}
              onChange={updatePersonal}
              errors={errors}
            />
          )}
          {step === 3 && (
            <StepStore data={store} onChange={updateStore} errors={errors} />
          )}
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
          {step === 5 && <StepMedia data={media} onChange={updateMedia} />}
          {step === 6 && (
            <StepReview personal={personal} store={store} bank={bank} />
          )}
        </div>

        {/* Footer — hidden on Step 1 (Welcome has its own CTA) */}
        {step > 1 && (
          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-2 shrink-0">
            {submitError && (
              <p role="alert" className="text-xs text-red-500 font-medium text-center">
                {submitError}
              </p>
            )}
            <div className="flex items-center justify-end gap-3">
              {step < TOTAL_STEPS ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-[#ff5252] text-white font-semibold text-sm hover:bg-red-500 transition cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#ff5252] text-white font-semibold text-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Store"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}