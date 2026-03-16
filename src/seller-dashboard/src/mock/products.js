/**
 * FILE: src/mock/products.js
 *
 * Mock product data used by Products.jsx and Inventory.jsx.
 *
 * TO REPLACE:
 *   GET /api/seller/products?page=1&limit=10
 *   Response shape: { products: Product[], total, page, hasMore }
 *
 * MongoDB collection: products
 * Fields: _id, seller_id, name, price, stock, category,
 *         condition, sku, description, images[], status,
 *         lowStockThreshold, createdAt, updatedAt
 */

export const mockProducts = [
  {
    id:          1,
    name:        "Blue Headphones",
    price:       32000,
    stock:       14,
    category:    "Electronics",
    condition:   "Brand New",
    status:      "Active",
    sku:         "SKU-001",
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
    images:      [],
    lowStockThreshold: 3,
  },
  {
    id:          2,
    name:        "Digital Camera",
    price:       90000,
    stock:       5,
    category:    "Electronics",
    condition:   "Brand New",
    status:      "Active",
    sku:         "SKU-002",
    description: "360° digital camera with 4K video recording and 48MP sensor.",
    images:      [],
    lowStockThreshold: 3,
  },
  {
    id:          3,
    name:        "Stylish Backpack",
    price:       10000,
    stock:       30,
    category:    "Bags & Accessories",
    condition:   "Brand New",
    status:      "Active",
    sku:         "SKU-003",
    description: "Durable everyday backpack with padded laptop compartment and water-resistant finish.",
    images:      [],
    lowStockThreshold: 5,
  },
  {
    id:          4,
    name:        "Nike Jersey",
    price:       15000,
    stock:       2,
    category:    "Fashion",
    condition:   "Brand New",
    status:      "Low Stock",
    sku:         "SKU-004",
    description: "Official Nike football jersey. Available in sizes S, M, L, XL.",
    images:      [],
    lowStockThreshold: 3,
  },
  {
    id:          5,
    name:        "Samsung Earbuds",
    price:       22000,
    stock:       0,
    category:    "Electronics",
    condition:   "Like New",
    status:      "Out",
    sku:         "SKU-005",
    description: "True wireless earbuds with active noise cancellation and IPX5 water resistance.",
    images:      [],
    lowStockThreshold: 3,
  },
];
