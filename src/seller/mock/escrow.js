/**
 * FILE: src/mock/escrow.js
 *
 * Mock escrow data used by Escrow.jsx.
 *
 * TO REPLACE:
 *   GET /api/seller/escrow/summary  → mockEscrowSummary
 *   GET /api/seller/escrow          → mockEscrows
 *
 * PostgreSQL table: escrow_transactions
 * Fields: id, order_id, seller_id, buyer_id, amount, status,
 *         held_since, release_date, auto_release_date,
 *         delivery_status, note, created_at
 *
 * STATUS VALUES:
 *   "held"     — funds being held, awaiting buyer confirmation
 *   "released" — funds moved to seller wallet
 *   "disputed" — buyer opened a dispute, funds frozen
 *   "refunded" — funds returned to buyer (dispute resolved for buyer)
 *
 * AUTO-RELEASE RULE:
 *   If delivery_status = "delivered" and buyer has not confirmed
 *   within 7 days, backend cron job sets status = "released"
 *   and credits seller wallet.
 */

export const mockEscrowSummary = {
  totalHeld:       122000,
  pendingRelease:   47000,
  releasedToday:    10000,
  totalReleased:   840000,
};

export const mockEscrows = [
  {
    id:              "ESC-001",
    orderId:         "#ORD-001",
    product:         "Blue Headphones",
    customer:        "Ada Obi",
    amount:          32000,
    status:          "held",
    heldSince:       "Mar 04, 2025",
    releaseDate:     null,
    autoReleaseDate: "Mar 11, 2025",
    daysHeld:        7,
    deliveryStatus:  "delivered",
    note:            "Awaiting buyer confirmation",
  },
  {
    id:              "ESC-002",
    orderId:         "#ORD-002",
    product:         "Digital Camera",
    customer:        "Chidi Eze",
    amount:          90000,
    status:          "released",
    heldSince:       "Feb 28, 2025",
    releaseDate:     "Mar 06, 2025",
    autoReleaseDate: "Mar 07, 2025",
    daysHeld:        6,
    deliveryStatus:  "delivered",
    note:            "Buyer confirmed delivery",
  },
  {
    id:              "ESC-003",
    orderId:         "#ORD-004",
    product:         "Nike Jersey",
    customer:        "Emeka Nna",
    amount:          15000,
    status:          "held",
    heldSince:       "Mar 08, 2025",
    releaseDate:     null,
    autoReleaseDate: "Mar 15, 2025",
    daysHeld:        2,
    deliveryStatus:  "shipped",
    note:            null,
  },
  {
    id:              "ESC-004",
    orderId:         "#ORD-005",
    product:         "Samsung Earbuds",
    customer:        "Fatima Isa",
    amount:          22000,
    status:          "disputed",
    heldSince:       "Mar 01, 2025",
    releaseDate:     null,
    autoReleaseDate: "Mar 08, 2025",
    daysHeld:        9,
    deliveryStatus:  "delivered",
    note:            "Buyer raised a dispute — under review",
  },
  {
    id:              "ESC-005",
    orderId:         "#ORD-006",
    product:         "Stylish Backpack",
    customer:        "Ngozi Ude",
    amount:          10000,
    status:          "released",
    heldSince:       "Mar 03, 2025",
    releaseDate:     "Mar 10, 2025",
    autoReleaseDate: "Mar 10, 2025",
    daysHeld:        7,
    deliveryStatus:  "delivered",
    note:            "Auto-released after 7 days",
  },
  {
    id:              "ESC-006",
    orderId:         "#ORD-007",
    product:         "Wireless Charger",
    customer:        "Bola Akin",
    amount:          8500,
    status:          "held",
    heldSince:       "Mar 09, 2025",
    releaseDate:     null,
    autoReleaseDate: "Mar 16, 2025",
    daysHeld:        1,
    deliveryStatus:  "pending",
    note:            null,
  },
];
