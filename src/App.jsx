import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

// Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import BlogList from "./Pages/Blog";
import BlogPost from "./Pages/BlogPost";
import VerifyResetCode from "./Pages/VerifyResetCode";
import NewPassword from "./Pages/NewPassword";
import ResetPassword from "./Pages/ResetPassword";
import Verify from "./Pages/Verify";
import Cart from "./Pages/Cart/index"
import Checkout from "./Pages/Checkout";
import Account from "./Pages/Account/index";
import MyList from "./Pages/MyList"
import Orders from "./Pages/Orders"
import HelpCenter from "./Pages/HelpCenter"
import PrivacyPolicy from "./Pages/PrivacyPolicy"
import TermsOfService from "./Pages/TermsOfService"

// Seller Dashboard
import SellerApp from "./seller/SellerApp";
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Header from "./Component/Header";
import MobileBottomNav from "./Component/MobileBottomNav";
import { Footer } from "./Component/Footer";
import { useHotkey } from "./hooks/useHotkey";

// Context
import MyContextProvider, { MyContext } from "./MyContext";

// UI & Icons
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp, IoBagCheckOutline } from "react-icons/io5";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MarketplaceLayout = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div role="banner"><Header /></div>
      <main id="main-content" className="pt-18 pb-20 lg:pt-0 lg:pb-0" role="main">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MyContextProvider>
        <AppContent />
      </MyContextProvider>
    </BrowserRouter>
  );
};

const AppContent = () => {
  const { cart, removeFromCart, updateCartQty, openCartPanel, setOpenCartPanel } = React.useContext(MyContext);
  useHotkey("Escape", () => setOpenCartPanel(false));
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const toggleCartPanel = (newOpen) => {
    setOpenCartPanel(newOpen);
  };

  return (
    <>
      <Routes>
        {/* Seller app — isolated, no marketplace layout */}
        <Route path="/seller/*" element={<ProtectedRoute><SellerApp /></ProtectedRoute>} />

        {/* Marketplace routes — wrapped in marketplace layout */}
        <Route element={<MarketplaceLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/verify-email" element={<Verify />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        richColors
        closeButton
        expand={false}
      />

      {/* Cart Drawer */}
      <Drawer
        open={openCartPanel}
        anchor="right"
        onClose={() => toggleCartPanel(false)}
        PaperProps={{
          className: "cartPanel w-full sm:w-[400px] bg-white flex flex-col",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h4 className="text-lg font-semibold text-neutral-900">
            Shopping Cart ({cart.length})
          </h4>
          <button
            onClick={() => toggleCartPanel(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
            aria-label="Close cart"
          >
            <IoCloseSharp className="text-xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 p-10 text-center">
              <IoBagCheckOutline className="text-5xl mb-4 opacity-20" />
              <p className="text-sm font-medium text-neutral-500">Your cart is empty</p>
              <button
                onClick={() => toggleCartPanel(false)}
                className="mt-4 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <h4 className="text-sm font-medium text-neutral-800 line-clamp-2">
                    {item.name}
                  </h4>

                  <p className="text-base font-bold text-primary-500">
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="w-8 h-8 border border-neutral-200 rounded-md flex items-center justify-center text-neutral-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 transition-colors text-sm"
                      onClick={() => updateCartQty(item.id, Math.max(1, item.qty - 1))}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>

                    <span className="min-w-7 text-center text-sm font-medium text-neutral-800">
                      {item.qty}
                    </span>

                    <button
                      className="w-8 h-8 border border-neutral-200 rounded-md flex items-center justify-center text-neutral-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 transition-colors text-sm"
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="text-neutral-400 cursor-pointer hover:text-error transition-colors self-start p-1"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <IoCloseSharp />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-neutral-500 font-medium">Subtotal:</span>
              <span className="text-xl font-bold text-primary-500">₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/checkout"
                onClick={() => toggleCartPanel(false)}
                className="w-full py-3 rounded-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-all text-center text-sm"
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={() => toggleCartPanel(false)}
                className="w-full py-3 rounded-lg font-semibold text-primary-500 border border-primary-500 hover:bg-primary-50 transition-all text-center text-sm"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default App;
