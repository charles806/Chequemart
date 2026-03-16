/**
 * FILE: src/mock/orders.js
 *
 * Mock order data used by Orders.jsx and Dashboard.jsx.
 *
 * TO REPLACE:
 *   GET /api/seller/orders?status=all&page=1&limit=10
 *   Response shape: { orders: Order[], total, page, hasMore }
 *
 * MongoDB collection: orders
 * Fields: _id, seller_id, buyer_id, product_id, product_name,
 *         customer, amount, quantity, status, shippingAddress,
 *         trackingNumber, createdAt, updatedAt
 *
 * STATUS TRANSITIONS (seller-controlled):
 *   Pending → Shipped → Delivered
 *   Pending → Cancelled
 */

export const mockOrders = [
  {
    id:              "#ORD-001",
    product:         "Blue Headphones",
    customer:        "Ada Obi",
    amount:          32000,
    quantity:        1,
    status:          "Pending",
    date:            "Mar 10, 2025",
    shippingAddress: "12 Adeola St, Lagos",
    trackingNumber:  null,
  },
  {
    id:              "#ORD-002",
    product:         "Digital Camera",
    customer:        "Chidi Eze",
    amount:          90000,
    quantity:        1,
    status:          "Shipped",
    date:            "Mar 08, 2025",
    shippingAddress: "5 Broad St, Abuja",
    trackingNumber:  "GIG-882211",
  },
  {
    id:              "#ORD-003",
    product:         "Stylish Backpack",
    customer:        "Ngozi Ude",
    amount:          10000,
    quantity:        1,
    status:          "Delivered",
    date:            "Mar 06, 2025",
    shippingAddress: "33 Aminu Kano Cr, PHC",
    trackingNumber:  "GIG-771100",
  },
  {
    id:              "#ORD-004",
    product:         "Nike Jersey",
    customer:        "Emeka Nna",
    amount:          30000,
    quantity:        2,
    status:          "Pending",
    date:            "Mar 09, 2025",
    shippingAddress: "7 Aba Rd, Port Harcourt",
    trackingNumber:  null,
  },
  {
    id:              "#ORD-005",
    product:         "Samsung Earbuds",
    customer:        "Fatima Isa",
    amount:          22000,
    quantity:        1,
    status:          "Shipped",
    date:            "Mar 07, 2025",
    shippingAddress: "18 Zaria Rd, Kano",
    trackingNumber:  "GIG-993344",
  },
  {
    id:              "#ORD-006",
    product:         "Stylish Backpack",
    customer:        "Bola Akin",
    amount:          10000,
    quantity:        1,
    status:          "Delivered",
    date:            "Mar 04, 2025",
    shippingAddress: "9 Lekki Phase 1, Lagos",
    trackingNumber:  "GIG-664422",
  },
  {
    id:              "#ORD-007",
    product:         "Wireless Charger",
    customer:        "Yemi Sule",
    amount:          8500,
    quantity:        1,
    status:          "Pending",
    date:            "Mar 11, 2025",
    shippingAddress: "22 Ikeja GRA, Lagos",
    trackingNumber:  null,
  },
];
