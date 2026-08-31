import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { SellerProvider } from "./context/SellerContext";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
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
