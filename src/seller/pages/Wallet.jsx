/**
 * FILE: src/pages/Wallet.jsx
 *
 * Wallet page — balance, transactions, withdrawals, bank accounts.
 *
 * BACKEND DEVELOPER NOTES:
 * ─────────────────────────────────────────────────────────────
 * On mount (run in parallel):
 *   → GET /api/seller/wallet
 *   → GET /api/seller/wallet/transactions?page=1&limit=10
 *   → GET /api/seller/bank-accounts
 *
 * Withdraw:
 *   → POST /api/seller/wallet/withdraw
 *   Body: { bankAccountId, amount, note? }
 *   Backend:
 *     1. Check availableBalance >= amount (DB transaction, race-safe)
 *     2. Deduct from available_balance, insert pending wallet_transaction
 *     3. Call Paystack Transfer API: POST /transfer
 *        { source:"balance", recipient: paystackRecipientCode, amount: amount*100 }
 *     4. Store transfer_code
 *     5. Webhook: transfer.success → mark completed
 *                 transfer.failed  → refund + mark failed
 *
 * Add bank account:
 *   → POST /api/seller/bank-accounts
 *   Body: { bankCode, bankName, accountNumber }
 *   Backend:
 *     1. Paystack resolve: GET /bank/resolve?account_number=&bank_code=
 *     2. Paystack recipient: POST /transferrecipient
 *     3. Store in DB (account number encrypted AES-256)
 *
 * Verify account number:
 *   → GET /api/seller/bank-accounts/verify?bankCode=&accountNumber=
 *
 * PostgreSQL tables: wallets, wallet_transactions, seller_bank_accounts
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Icon from "../components/ui/Icon";
import StatusBadge from "../components/ui/StatusBadge";
import Toast, { useToast } from "../components/ui/Toast";
import { ICONS } from "../components/ui/icons";
import { useSeller } from "../context/SellerContext";
import CircularProgress from "@mui/material/CircularProgress";
import { BANKS_LIST } from "../constants/banks";

const fmt = (n) => "₦" + Number(n).toLocaleString();

const MIN_WITHDRAWAL = 1000;

// ─────────────────────────────────────────────────────────────
// SHARED FIELD COMPONENTS
// ─────────────────────────────────────────────────────────────
const inputCls = (err) => `
  w-full px-3 py-2.5 rounded-xl bg-gray-50 border text-sm text-gray-800
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
// ADD BANK MODAL
// POST /api/seller/bank-accounts
// ─────────────────────────────────────────────────────────────
const AddBankModal = ({ onSave, onClose }) => {
  const [form,      setForm]      = useState({ bankCode: "", accountNumber: "", accountName: "" });
  const [errors,    setErrors]    = useState({});
  const [verified,  setVerified]  = useState(false);
  const [verifying, setVerifying] = useState(false);

  const update = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setVerified(false); // reset if inputs change
  };

  // GET /api/seller/bank-accounts/verify?bankCode=&accountNumber=
  const handleVerify = () => {
    if (!form.bankCode)                    { setErrors({ bankCode: "Select a bank first" }); return; }
    if (form.accountNumber.length !== 10)  { setErrors({ accountNumber: "Enter a 10-digit account number" }); return; }
    setErrors({});
    setVerifying(true);
    // TODO: replace with real fetch call to verify endpoint
    setTimeout(() => {
      setForm((p) => ({ ...p, accountName: "JOHN DOE" }));
      setVerified(true);
      setVerifying(false);
    }, 1200);
  };

  // POST /api/seller/bank-accounts
  const handleSave = () => {
    if (!verified) { setErrors({ accountNumber: "Verify account number first" }); return; }
    const bank = BANKS_LIST.find((b) => b.code === form.bankCode);
    onSave({
      id:                    `BA-${Date.now()}`,
      bankName:              bank?.name || "",
      bankCode:              form.bankCode,
      accountNumber:         `•••• ${form.accountNumber.slice(-4)}`,
      accountName:           form.accountName,
      isDefault:             false,
      paystackRecipientCode: "RCP_pending", // backend will set the real code
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 animate-slide-up">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon d={ICONS.plus} size={15} className="text-primary" />
            </div>
            <h3 className="font-black text-gray-900 text-sm">Add Bank Account</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <Icon d={ICONS.close} size={13} className="text-gray-500" />
          </button>
        </div>

        {/* Bank select */}
        <Field label="Bank Name" error={errors.bankCode}>
          <select value={form.bankCode} onChange={update("bankCode")} className={inputCls(!!errors.bankCode) + " cursor-pointer"}>
            <option value="">Select bank…</option>
            {BANKS_LIST.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
          </select>
        </Field>

        {/* Account number + verify */}
        <Field label="Account Number" error={errors.accountNumber}>
          <div className="flex gap-2">
            <input
              maxLength={10}
              placeholder="0123456789"
              value={form.accountNumber}
              onChange={update("accountNumber")}
              className={inputCls(!!errors.accountNumber) + " flex-1"}
            />
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {verifying ? "Checking…" : "Verify"}
            </button>
          </div>
        </Field>

        {/* Verified name */}
        {verified && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
            <Icon d={ICONS.check} size={15} className="text-green-500 stroke-[3] flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Account verified</p>
              <p className="text-sm font-black text-gray-800">{form.accountName}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <Icon d={ICONS.info} size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Account details are encrypted at rest. A Paystack transfer recipient is created on save to enable fast payouts.
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition shadow-md shadow-red-200 cursor-pointer">
            Save Account
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// WITHDRAW MODAL (2-step)
// POST /api/seller/wallet/withdraw
// ─────────────────────────────────────────────────────────────
const WithdrawModal = ({ wallet, bankAccounts, onSuccess, onClose, onAddBank }) => {
  const [selectedBank, setSelectedBank] = useState(bankAccounts.find((b) => b.isDefault)?.id || "");
  const [amount,   setAmount]   = useState("");
  const [note,     setNote]     = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [step,     setStep]     = useState(1); // 1=form, 2=confirm

  const numAmount   = Number(amount);
  const selectedAcc = bankAccounts.find((b) => b.id === selectedBank);
  const afterBal    = wallet.availableBalance - numAmount;

  const quickAmounts = [5000, 10000, 50000, 100000].filter((a) => a <= wallet.availableBalance);

  const validate = () => {
    const e = {};
    if (!selectedBank)                              e.bank   = "Select a bank account";
    if (!amount || isNaN(numAmount))               e.amount = "Enter a valid amount";
    else if (numAmount < MIN_WITHDRAWAL)           e.amount = `Minimum is ${fmt(MIN_WITHDRAWAL)}`;
    else if (numAmount > wallet.availableBalance)  e.amount = "Amount exceeds available balance";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => { if (validate()) setStep(2); };

  // POST /api/seller/wallet/withdraw
  const handleSubmit = () => {
    setLoading(true);
    // TODO: replace with real fetch call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSuccess(numAmount);
    }, 1600);
  };

  if (success) return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 text-center space-y-4 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-pop-in">
          <Icon d={ICONS.check} size={34} className="text-green-500 stroke-[3]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">Withdrawal Requested!</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            <strong>{fmt(numAmount)}</strong> is being transferred to{" "}
            <strong>{selectedAcc?.bankName}</strong> · {selectedAcc?.accountNumber}.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-left space-y-2">
          {[
            ["Amount",     fmt(numAmount)],
            ["Bank",       `${selectedAcc?.bankName} · ${selectedAcc?.accountNumber}`],
            ["Status",     "Pending"],
            ["Est. Time",  "1–3 business days"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-gray-400">{k}</span>
              <span className="text-gray-800 font-bold">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
          <Icon d={ICONS.clock} size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Paystack webhook will confirm the transfer status automatically.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition cursor-pointer">
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon d={ICONS.send} size={14} className="text-primary" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base leading-none">
                {step === 1 ? "Withdraw Funds" : "Confirm Withdrawal"}
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {step === 1 ? "Transfer funds to your bank account" : "Review before confirming"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <Icon d={ICONS.close} size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {step === 1 ? (
            <>
              {/* Balance card */}
              <div className="bg-primary/8 border border-primary/15 rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Available Balance</p>
                <p className="text-3xl font-black text-gray-900">{fmt(wallet.availableBalance)}</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <Icon d={ICONS.shield} size={10} />
                  Escrow: {fmt(wallet.escrowBalance)} (held)
                </p>
              </div>

              {/* Bank selector */}
              <Field label="Withdraw To" error={errors.bank}>
                <div className="space-y-2">
                  {bankAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedBank(acc.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 transition-all cursor-pointer text-left
                        ${selectedBank === acc.id ? "border-primary bg-red-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedBank === acc.id ? "bg-primary" : "bg-gray-200"}`}>
                        <Icon d={ICONS.bank} size={16} className={selectedBank === acc.id ? "text-white" : "text-gray-500"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{acc.bankName}</p>
                        <p className="text-xs text-gray-500">{acc.accountNumber} · {acc.accountName}</p>
                      </div>
                      {acc.isDefault && <span className="text-[9px] font-bold text-primary bg-red-100 px-2 py-0.5 rounded-full">DEFAULT</span>}
                      {selectedBank === acc.id && <Icon d={ICONS.check} size={15} className="text-primary stroke-[3] flex-shrink-0" />}
                    </button>
                  ))}
                  <button
                    onClick={onAddBank}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary/40 hover:text-primary hover:bg-red-50 transition cursor-pointer text-sm font-semibold"
                  >
                    <Icon d={ICONS.plus} size={15} /> Add New Bank Account
                  </button>
                </div>
              </Field>

              {/* Amount */}
              <Field label="Amount (₦)" error={errors.amount} hint={`Min: ${fmt(MIN_WITHDRAWAL)} · Max: ${fmt(wallet.availableBalance)}`}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₦</span>
                  <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls(!!errors.amount) + " pl-7"} />
                </div>
              </Field>

              {/* Quick amounts */}
              {quickAmounts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((a) => (
                    <button key={a} onClick={() => setAmount(String(a))}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 hover:bg-primary/10 hover:text-primary transition cursor-pointer">
                      {fmt(a)}
                    </button>
                  ))}
                  <button onClick={() => setAmount(String(wallet.availableBalance))}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 hover:bg-primary/10 hover:text-primary transition cursor-pointer">
                    All
                  </button>
                </div>
              )}

              {/* After balance preview */}
              {amount && !isNaN(numAmount) && numAmount > 0 && numAmount <= wallet.availableBalance && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">Balance after withdrawal</span>
                  <span className="text-sm font-black text-gray-800">{fmt(afterBal)}</span>
                </div>
              )}

              {/* Optional note */}
              <Field label="Note (Optional)" hint="Internal reference only">
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Monthly earnings withdrawal"
                  rows={2} className={inputCls(false) + " resize-none"} />
              </Field>
            </>
          ) : (
            <>
              <div className="bg-primary/8 border border-primary/15 rounded-2xl p-5 text-center space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">You are withdrawing</p>
                <p className="text-4xl font-black text-primary">{fmt(numAmount)}</p>
                <p className="text-xs text-gray-500">to {selectedAcc?.bankName} · {selectedAcc?.accountNumber}</p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                {[
                  ["From Wallet",       fmt(wallet.availableBalance)],
                  ["Withdrawal Amount", fmt(numAmount)],
                  ["Destination",       `${selectedAcc?.bankName} · ${selectedAcc?.accountNumber}`],
                  ["Account Name",      selectedAcc?.accountName || "—"],
                  ["Balance After",     fmt(afterBal)],
                  ...(note ? [["Note", note]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">{k}</span>
                    <span className="text-gray-800 font-bold text-right max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                <Icon d={ICONS.warning} size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Withdrawals <strong>cannot be cancelled</strong> once submitted. Ensure your bank details are correct.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer">
              ← Back
            </button>
          )}
          <button
            onClick={step === 1 ? handleContinue : handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition shadow-md shadow-red-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading
              ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing…</>
              : step === 1 ? "Review →" : "Confirm & Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// WALLET PAGE
// ─────────────────────────────────────────────────────────────
export default function WalletPage() {
    const { wallet, setWallet } = useSeller();
    const [transactions, setTxns] = useState([]);
    const [bankAccounts, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWithdraw, setWithdraw] = useState(false);
    const [showAddBank, setAddBank] = useState(false);
    const [txFilter, setTxFilter] = useState("all");
    const { toast, showToast } = useToast();

    const fetchWalletData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("accessToken");
            const headers = { Authorization: `Bearer ${token}` };

            const [txRes, bankRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/seller/wallet/transactions`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/seller/bank-accounts`, { headers })
            ]);

            const txData = await txRes.json();
            const bankData = await bankRes.json();

            if (txData.success) setTxns(txData.transactions);
            if (bankData.success) setBanks(bankData.accounts);
        } catch (error) {
            console.error("Wallet data fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleWithdrawSuccess = (amount) => {
        showToast("✅ Withdrawal request submitted");
        fetchWalletData(); // Refresh to show new transaction
    };

    const handleAddBank = async (account) => {
        try {
            const token = Cookies.get("accessToken");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/bank-accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(account)
            });

            if (res.ok) {
                showToast("✅ Bank account added");
                fetchWalletData();
            }
        } catch (error) {
            showToast("❌ Failed to add bank account");
        }
    };

    const filteredTx = transactions.filter((t) =>
        txFilter === "all" ? true : t.type.toLowerCase() === txFilter
    );

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <CircularProgress size={40} className="text-[#ff5252]" />
            </div>
        );
    }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Wallet</h1>
        <p className="text-xs text-gray-400">Manage your earnings & withdrawals</p>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-dark to-dark-2 rounded-3xl p-5 shadow-xl shadow-black/20">
        <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">Available Balance</p>
        <p className="text-4xl font-black text-white mb-4">{fmt(wallet.availableBalance)}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            ["Escrow",    fmt(wallet.escrowBalance),   "text-yellow-400"],
            ["Earned",    fmt(wallet.totalEarned),     "text-green-400" ],
            ["Withdrawn", fmt(wallet.totalWithdrawn),  "text-red-400"   ],
          ].map(([l, v, c]) => (
            <div key={l} className="bg-white/5 rounded-2xl p-3">
              <p className={`text-base font-black ${c}`}>{v}</p>
              <p className="text-[9px] text-white/40 font-semibold mt-0.5">{l}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWithdraw(true)}
            disabled={wallet.availableBalance < MIN_WITHDRAWAL}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition shadow-lg shadow-red-900/40 cursor-pointer disabled:opacity-40"
          >
            <Icon d={ICONS.send} size={14} /> Withdraw
          </button>
          <button
            onClick={() => setAddBank(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition cursor-pointer"
          >
            <Icon d={ICONS.plus} size={14} /> Add Bank
          </button>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-black text-gray-900 text-sm">Transaction History</h2>
            <p className="text-[10px] text-gray-400">Credits & debits on your wallet</p>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {[["all","All"],["credit","In"],["debit","Out"]].map(([v, l]) => (
              <button key={v} onClick={() => setTxFilter(v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer
                  ${txFilter === v ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredTx.map((tx) => (
            <div key={tx.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                <Icon d={tx.type === "credit" ? ICONS.arrowDown : ICONS.send} size={15}
                  className={tx.type === "credit" ? "text-green-600 rotate-180" : "text-primary"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{tx.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-gray-400">{tx.date}</p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
              <p className={`text-sm font-black flex-shrink-0 ${tx.type === "credit" ? "text-green-600" : "text-primary"}`}>
                {tx.type === "credit" ? "+" : "-"}{fmt(tx.amount)}
              </p>
            </div>
          ))}
          {filteredTx.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Icon d={ICONS.wallet} size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved accounts */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="font-black text-gray-900 text-sm">Saved Accounts</h2>
            <p className="text-[10px] text-gray-400">Your registered payout accounts</p>
          </div>
          <button onClick={() => setAddBank(true)} className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1">
            <Icon d={ICONS.plus} size={12} /> Add
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {bankAccounts.map((acc) => (
            <div key={acc.id} className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon d={ICONS.bank} size={16} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{acc.bankName}</p>
                <p className="text-xs text-gray-400">{acc.accountNumber} · {acc.accountName}</p>
              </div>
              {acc.isDefault && (
                <span className="text-[9px] font-bold text-primary bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  DEFAULT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {showWithdraw && (
        <WithdrawModal
          wallet={wallet}
          bankAccounts={bankAccounts}
          onSuccess={handleWithdrawSuccess}
          onClose={() => setWithdraw(false)}
          onAddBank={() => { setWithdraw(false); setAddBank(true); }}
        />
      )}
      {showAddBank && (
        <AddBankModal
          onSave={handleAddBank}
          onClose={() => setAddBank(false)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
