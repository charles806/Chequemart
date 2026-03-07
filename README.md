# Chequemart

**Chequemart** is a multi-vendor e-commerce marketplace built for the Nigerian market, designed to solve the biggest problem in local online commerce: **trust**.

The platform protects both buyers and sellers using an **escrow payment system** where payments are only released to sellers after buyers confirm delivery.

---

# 🚀 Vision

To become **Nigeria's most trusted online marketplace** — where every transaction is protected, every seller can thrive, and every buyer shops with confidence.

---

# 🧩 Problem

Online commerce in Nigeria faces major trust issues:

- Buyers fear paying and not receiving goods
- Sellers fear shipping before receiving payment
- Lack of reliable dispute protection
- Small vendors struggle to build credibility online

---

# 💡 Solution

Chequemart introduces a **trust-first marketplace model**:

- Secure **escrow payments**
- Transparent **platform commissions**
- Built-in **dispute resolution**
- **Seller storefronts** for credibility
- **Buyer order protection**

---

# 🛍️ Core Features

## Buyer Features

- Account registration and login
- Browse products by category
- Product search and filtering
- Shopping cart and checkout
- Secure Paystack payments
- Real-time order tracking
- Delivery confirmation
- Escrow-protected purchases
- Dispute resolution system
- Order history

---

## Seller Features

- Seller onboarding
- Public storefront profile
- Product listing management
- Inventory management
- Order fulfillment dashboard
- Seller wallet
- Escrow tracking
- Withdraw funds to bank account
- Basic sales analytics

---

## Admin Features

- Seller management
- Order monitoring
- Dispute resolution
- Commission tracking
- Platform notifications
- User management

---

# 💳 Escrow Payment System

Chequemart's core innovation is its **escrow architecture**.

Payment flow:

1. Buyer places an order
2. Payment is held in escrow
3. Seller ships the product
4. Buyer confirms delivery
5. Funds are released to the seller

If the buyer does not confirm delivery, funds are **automatically released after 5 days**.

If there is a dispute, funds remain frozen until the issue is resolved.

---

# 💰 Revenue Model

Chequemart earns revenue through **transaction commissions**.

| Order Value | Commission |
|-------------|------------|
| Below ₦50,000 | 5% |
| ₦50,000 and above | 10% |

No listing fees.  
No subscriptions for MVP.

---

# 🏗 Tech Stack

Frontend  
- React
- Tailwind CSS

Backend  
- Node.js
- Express.js

Databases  
- MongoDB (application data)
- PostgreSQL (financial ledger)

Payments  
- Paystack API

Other Services
- Cloudinary (image storage)
- Nodemailer (email notifications)
- node-cron (background jobs)

---

# 📦 Architecture Overview

```
Frontend (React + Tailwind)
        │
        ▼
Backend API (Node.js + Express)
        │
        ├── MongoDB (users, products, orders)
        ├── PostgreSQL (escrow + wallets)
        ├── Paystack (payments)
        ├── Cloudinary (images)
        └── Email Notifications
```

---

# 🗂 Project Structure

```
/frontend
/backend
/docs
README.md
```

---

# 👨‍💻 Development Workflow

We follow a **protected main branch workflow**.

Rules:

- No direct pushes to `main`
- All work must be done in **feature branches**
- All changes must go through **Pull Requests**

Example:

```bash
git checkout -b feature/login-page
git push origin feature/login-page
```

Open a **Pull Request** and wait for approval before merging.

---

# 🌍 Target Market

Primary users:

Buyers
- Nigerian online shoppers
- Ages 18–45
- Urban areas (Lagos, Abuja, Port Harcourt, Kano)

Sellers
- Instagram vendors
- WhatsApp sellers
- Small businesses
- Market traders
- Online resellers

---

# 📅 MVP Launch Plan

Target launch: **August 2025**

MVP includes:

- Buyer accounts
- Seller onboarding
- Product listings
- Cart & checkout
- Escrow payments
- Order tracking
- Seller wallets
- Dispute system
- Admin dashboard

---

# 📊 MVP Success Metrics

First 90 days:

- 50+ active sellers
- 500+ buyers
- 200+ orders
- ₦3,000,000+ GMV
- 99% escrow success rate

---

# 🤝 Contributing

Contributors must follow the repository workflow:

1. Create a feature branch
2. Push changes to that branch
3. Open a Pull Request
4. Wait for approval before merging

Direct pushes to `main` are not allowed.

---

# 📄 License

Private repository — internal development only.

---

**Chequemart — Building Trust Into Every Transaction**
