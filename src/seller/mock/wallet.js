/**
 * FILE: src/mock/wallet.js
 *
 * Mock wallet data used by Wallet.jsx.
 *
 * TO REPLACE:
 *   GET /api/seller/wallet              → mockWalletSummary
 *   GET /api/seller/wallet/transactions → mockTransactions
 *   GET /api/seller/bank-accounts       → mockBankAccounts
 *
 * PostgreSQL tables:
 *   wallets             — balance fields
 *   wallet_transactions — transaction history
 *   seller_bank_accounts — saved payout accounts
 *
 * NOTE: Full account numbers must be stored encrypted at rest (AES-256).
 * The API should return masked numbers (e.g. "•••• 4521") to the frontend.
 */

export const mockWalletSummary = {
  availableBalance: 320500,
  escrowBalance:    122000,
  totalEarned:     1284000,
  totalWithdrawn:   963500,
  currency:         "NGN",
};

export const mockTransactions = [
  {
    id:          "TXN-001",
    type:        "credit",
    description: "Order #ORD-003 Released from Escrow",
    amount:      10000,
    status:      "completed",
    date:        "Mar 10, 2025",
    reference:   "ESC-003",
  },
  {
    id:          "TXN-002",
    type:        "debit",
    description: "Withdrawal to GTBank · •••• 4521",
    amount:      50000,
    status:      "completed",
    date:        "Mar 08, 2025",
    reference:   "WTH-021",
  },
  {
    id:          "TXN-003",
    type:        "credit",
    description: "Order #ORD-002 Released from Escrow",
    amount:      90000,
    status:      "completed",
    date:        "Mar 06, 2025",
    reference:   "ESC-002",
  },
  {
    id:          "TXN-004",
    type:        "credit",
    description: "Order #ORD-001 Released from Escrow",
    amount:      32000,
    status:      "completed",
    date:        "Mar 04, 2025",
    reference:   "ESC-001",
  },
  {
    id:          "TXN-005",
    type:        "debit",
    description: "Withdrawal to GTBank · •••• 4521",
    amount:      80000,
    status:      "pending",
    date:        "Mar 02, 2025",
    reference:   "WTH-019",
  },
  {
    id:          "TXN-006",
    type:        "credit",
    description: "Order #ORD-007 Released from Escrow",
    amount:      22000,
    status:      "completed",
    date:        "Feb 28, 2025",
    reference:   "ESC-007",
  },
];

export const mockBankAccounts = [
  {
    id:                    "BA-001",
    bankName:              "GTBank",
    accountNumber:         "•••• 4521",
    accountName:           "John Doe",
    bankCode:              "058",
    isDefault:             true,
    paystackRecipientCode: "RCP_xxxx1",
  },
  {
    id:                    "BA-002",
    bankName:              "Access Bank",
    accountNumber:         "•••• 7890",
    accountName:           "John Doe",
    bankCode:              "044",
    isDefault:             false,
    paystackRecipientCode: "RCP_xxxx2",
  },
];

/** Nigerian bank list with Paystack bank codes */
export const BANKS_LIST = [
  { name: "Access Bank",   code: "044"    },
  { name: "GTBank",        code: "058"    },
  { name: "First Bank",    code: "011"    },
  { name: "Zenith Bank",   code: "057"    },
  { name: "UBA",           code: "033"    },
  { name: "Kuda Bank",     code: "50211"  },
  { name: "Opay",          code: "100004" },
  { name: "Sterling Bank", code: "232"    },
];
