const BASE = import.meta.env.VITE_API_BASE_URL;

export const API = {

  // ── Seller Auth & Profile ──────────────────────────────────
  SELLER: {
    /** POST  body: { store, personal, bank, logo, banner } */
    REGISTER:       `${BASE}/api/seller/register`,
    /** GET   returns seller profile object */
    PROFILE:        `${BASE}/api/seller/profile`,
    /** PUT   body: { storeName, description, location, category, logo, banner, socialLinks } */
    UPDATE_PROFILE: `${BASE}/api/seller/profile`,
  },

  // ── Products ───────────────────────────────────────────────
  PRODUCTS: {
    /** GET   query: ?page=1&limit=10&status=active&search= */
    LIST:   `${BASE}/api/seller/products`,
    /** POST  body: { name, price, stock, category, condition, sku, description, images[] } */
    ADD:    `${BASE}/api/seller/products/add`,
    /** PUT   body: partial product fields */
    UPDATE: (id) => `${BASE}/api/seller/products/${id}`,
    /** DELETE */
    DELETE: (id) => `${BASE}/api/seller/products/${id}`,
  },

  // ── Inventory ──────────────────────────────────────────────
  INVENTORY: {
    /** GET   returns products with stock levels */
    LIST:         `${BASE}/api/seller/inventory`,
    /** PUT   body: { stock: number } — auto-updates status */
    UPDATE_STOCK: (id) => `${BASE}/api/seller/inventory/${id}`,
  },

  // ── Orders ─────────────────────────────────────────────────
  ORDERS: {
    /** GET   query: ?status=all|pending|shipped|delivered&page=1&limit=10&search= */
    LIST:          `${BASE}/api/seller/orders`,
    /** GET   returns single order */
    GET:           (id) => `${BASE}/api/seller/orders/${id}`,
    /** PUT   body: { status: "Shipped" | "Delivered" | "Cancelled" } */
    UPDATE_STATUS: (id) => `${BASE}/api/seller/orders/${id}/status`,
  },

  // ── Wallet ─────────────────────────────────────────────────
  WALLET: {
    /** GET   returns { availableBalance, escrowBalance, totalEarned, totalWithdrawn } */
    GET:          `${BASE}/api/seller/wallet`,
    /** GET   query: ?page=1&limit=10 */
    TRANSACTIONS: `${BASE}/api/seller/wallet/transactions`,
    /** POST  body: { bankAccountId, amount, note? } */
    WITHDRAW:     `${BASE}/api/seller/wallet/withdraw`,
  },

  // ── Bank Accounts ──────────────────────────────────────────
  BANK_ACCOUNTS: {
    /** GET   returns { accounts: [...] } */
    LIST:   `${BASE}/api/seller/bank-accounts`,
    /** POST  body: { bankCode, bankName, accountNumber } */
    ADD:    `${BASE}/api/seller/bank-accounts`,
    /** GET   query: ?bankCode=058&accountNumber=0123456789 */
    VERIFY: `${BASE}/api/seller/bank-accounts/verify`,
  },

  // ── Escrow ─────────────────────────────────────────────────
  ESCROW: {
    /** GET   returns { totalHeld, pendingRelease, releasedToday, totalReleased } */
    SUMMARY:  `${BASE}/api/seller/escrow/summary`,
    /** GET   query: ?status=all|held|released|disputed&page=1&limit=10 */
    LIST:     `${BASE}/api/seller/escrow`,
    /** GET   returns single escrow record */
    GET:      (id) => `${BASE}/api/seller/escrow/${id}`,
    /** POST  triggers manual fund release — backend validates eligibility */
    RELEASE:  (id) => `${BASE}/api/seller/escrow/${id}/release`,
  },

  // ── Analytics ──────────────────────────────────────────────
  ANALYTICS: {
    /** GET   query: ?period=weekly|monthly|yearly */
    SUMMARY:     `${BASE}/api/seller/analytics/summary`,
    REVENUE:     `${BASE}/api/seller/analytics/revenue`,
    TOP_PRODUCTS:`${BASE}/api/seller/analytics/top-products`,
    BREAKDOWN:   `${BASE}/api/seller/analytics/orders-breakdown`,
    ACTIVITY:    `${BASE}/api/seller/analytics/activity`,
  },

  // ── Media ──────────────────────────────────────────────────
  MEDIA: {
    /** POST  body: FormData { file, type: "logo"|"banner"|"product" }
     *  Returns: { url: string } — Cloudinary URL */
    UPLOAD: `${BASE}/api/cloudinary/upload`,
  },

  // ── Support ────────────────────────────────────────────────
  SUPPORT: {
    /** POST  body: { orderId, escrowId, type, message } */
    TICKET: `${BASE}/api/support/ticket`,
  },
};
