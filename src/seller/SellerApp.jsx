/**
 * FILE: src/SellerApp.jsx
 *
 * Root application shell for seller dashboard.
 *
 * AUTH NOTE:
 * ─────────────────────────────────────────────────────────────
 * Authentication is fully handled by the backend developer.
 * The frontend references API routes only — no auth logic here.
 *
 * When backend auth is ready, the flow will be:
 *   1. Backend returns a JWT on login
 *   2. Frontend stores it and attaches to every API request header:
 *      Authorization: Bearer <token>
 *   3. On mount, call GET /api/seller/profile to verify token
 *      → valid:   render dashboard
 *      → invalid: redirect to login (backend's responsibility)
 *
 * ONBOARDING REDIRECT (backend responsibility):
 *   GET /api/seller/profile should return { onboardingComplete: boolean }
 *   Frontend will check this field and render Onboarding or Dashboard.
 * ─────────────────────────────────────────────────────────────
 */

import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { SellerProvider } from "./context/SellerContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Onboarding from "./pages/Onboarding.jsx"
import DashboardPage from "./pages/Dashboard";
import StorefrontPage from "./pages/Storefront";
import ProductsPage from "./pages/Products";
import InventoryPage from "./pages/Inventory";
import OrdersPage from "./pages/Orders";
import WalletPage from "./pages/Wallet";
import EscrowPage from "./pages/Escrow";
import AnalyticsPage from "./pages/Analytics";

export default function SellerApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user has completed onboarding
  const userStr = localStorage.getItem('user');
  let onboardingComplete = false;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      onboardingComplete = user.sellerInfo?.onboardingComplete || false;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // ignore
    }
  }

  return (
    <SellerProvider>
      {location.pathname.includes('/onboarding') ? (
        <Onboarding onComplete={() => navigate('/seller/dashboard')} />
      ) : (
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="storefront" element={<StorefrontPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="escrow" element={<EscrowPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Routes>
        </DashboardLayout>
      )}
    </SellerProvider>
  );
}
