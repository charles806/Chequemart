/**
 * FILE: src/mock/analytics.js
 *
 * Mock analytics data used by Analytics.jsx.
 *
 * TO REPLACE:
 *   GET /api/seller/analytics/summary?period=      → mockKPIs
 *   GET /api/seller/analytics/revenue?period=      → mockRevenue
 *   GET /api/seller/analytics/top-products?period= → mockTopProducts
 *   GET /api/seller/analytics/orders-breakdown     → mockOrderBreakdown
 *   GET /api/seller/analytics/activity?limit=5     → mockActivity
 *
 * All analytics queries are read-only aggregations.
 * MongoDB: db.orders.aggregate([...])
 * Filter by seller_id + createdAt range based on period param.
 *
 * PERIOD VALUES: "weekly" | "monthly" | "yearly"
 */

export const mockKPIs = [
  { label: "Total Revenue",    value: "₦1,284,000", change: +12.5 },
  { label: "Total Orders",     value: "348",         change: +8.2  },
  { label: "Avg. Order Value", value: "₦3,689",      change: +3.7  },
  { label: "Customers",        value: "214",         change: +5.1  },
  { label: "Repeat Rate",      value: "34%",         change: -1.2  },
  { label: "Top Rating",       value: "4.8 ★",       change: +0.2  },
];

export const mockRevenue = {
  weekly: [
    { label: "Mon", revenue: 45000,  orders: 12 },
    { label: "Tue", revenue: 82000,  orders: 22 },
    { label: "Wed", revenue: 61000,  orders: 17 },
    { label: "Thu", revenue: 110000, orders: 30 },
    { label: "Fri", revenue: 95000,  orders: 26 },
    { label: "Sat", revenue: 140000, orders: 38 },
    { label: "Sun", revenue: 72000,  orders: 20 },
  ],
  monthly: [
    { label: "Jan", revenue: 380000,  orders: 102 },
    { label: "Feb", revenue: 420000,  orders: 115 },
    { label: "Mar", revenue: 510000,  orders: 138 },
    { label: "Apr", revenue: 390000,  orders: 105 },
    { label: "May", revenue: 475000,  orders: 128 },
    { label: "Jun", revenue: 620000,  orders: 167 },
    { label: "Jul", revenue: 580000,  orders: 156 },
    { label: "Aug", revenue: 710000,  orders: 192 },
    { label: "Sep", revenue: 490000,  orders: 132 },
    { label: "Oct", revenue: 655000,  orders: 177 },
    { label: "Nov", revenue: 820000,  orders: 221 },
    { label: "Dec", revenue: 960000,  orders: 259 },
  ],
  yearly: [
    { label: "2022", revenue: 2400000, orders: 648  },
    { label: "2023", revenue: 4100000, orders: 1107 },
    { label: "2024", revenue: 6800000, orders: 1836 },
    { label: "2025", revenue: 1284000, orders: 348  },
  ],
};

export const mockTopProducts = [
  { id: "P1", name: "Digital Camera",   sales: 18, revenue: 1620000, growth: +22, category: "Electronics" },
  { id: "P2", name: "Blue Headphones",  sales: 34, revenue: 1088000, growth: +8,  category: "Electronics" },
  { id: "P3", name: "Samsung Earbuds",  sales: 27, revenue: 594000,  growth: -3,  category: "Electronics" },
  { id: "P4", name: "Stylish Backpack", sales: 41, revenue: 410000,  growth: +15, category: "Bags"        },
  { id: "P5", name: "Nike Jersey",      sales: 26, revenue: 390000,  growth: +5,  category: "Fashion"     },
];

export const mockOrderBreakdown = [
  { status: "Delivered", count: 248, pct: 71, color: "#22c55e" },
  { status: "Shipped",   count: 62,  pct: 18, color: "#3b82f6" },
  { status: "Pending",   count: 28,  pct: 8,  color: "#f59e0b" },
  { status: "Cancelled", count: 10,  pct: 3,  color: "var(--primary-color)" },
];

export const mockActivity = [
  { type: "order",         message: "New order for Digital Camera",  time: "2 hrs ago",  amount: 90000 },
  { type: "payout",        message: "₦50,000 withdrawn to GTBank",   time: "5 hrs ago",  amount: null  },
  { type: "review",        message: "Ada Obi left a 5★ review",      time: "Yesterday",  amount: null  },
  { type: "order",         message: "New order for Nike Jersey x2",  time: "Yesterday",  amount: 30000 },
  { type: "restock_alert", message: "Samsung Earbuds stock is at 0", time: "2 days ago", amount: null  },
];
   
