import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
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

  // Check if user has completed onboarding
  const userStr = Cookies.get('user');
  let onboardingComplete = false;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      onboardingComplete = user.sellerInfo?.onboardingComplete || false;
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
