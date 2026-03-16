/**
 * FILE: src/App.jsx
 *
 * Root application shell.
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
 *
 * React Router integration (when backend is ready):
 *   Replace the page state switch below with <Routes>.
 *   Use a PrivateRoute wrapper that checks the JWT.
 * ─────────────────────────────────────────────────────────────
 */

import { useState }       from "react";
import { SellerProvider } from "./context/SellerContext";
import DashboardLayout    from "./components/layout/DashboardLayout";
import Onboarding         from "./pages/Onboarding";
import DashboardPage      from "./pages/Dashboard";
import StorefrontPage     from "./pages/Storefront";
import ProductsPage       from "./pages/Products";
import InventoryPage      from "./pages/Inventory";
import OrdersPage         from "./pages/Orders";
import WalletPage         from "./pages/Wallet";
import EscrowPage         from "./pages/Escrow";
import AnalyticsPage      from "./pages/Analytics";

// ─────────────────────────────────────────────────────────────
// PAGE REGISTRY
// Maps sidebar nav key → page component
// ─────────────────────────────────────────────────────────────
const PAGES = {
  dashboard:  <DashboardPage  />,
  storefront: <StorefrontPage />,
  products:   <ProductsPage   />,
  inventory:  <InventoryPage  />,
  orders:     <OrdersPage     />,
  wallet:     <WalletPage     />,
  escrow:     <EscrowPage     />,
  analytics:  <AnalyticsPage  />,
};

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  // TODO (backend dev): replace this with real auth check
  // "onboarding" → new seller | "dashboard" → authenticated seller
  const [appState,    setAppState]    = useState("dashboard");
  const [activePage,  setActivePage]  = useState("dashboard");

  return (
    <SellerProvider>
      {appState === "onboarding" ? (
        <Onboarding onComplete={() => setAppState("dashboard")} />
      ) : (
        <DashboardLayout active={activePage} setActive={setActivePage}>
          {PAGES[activePage] ?? <DashboardPage />}
        </DashboardLayout>
      )}
    </SellerProvider>
  );
}
