import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

// Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AuthCallback from "./Pages/AuthCallback";
import ForgotPassword from "./Pages/ForgotPassword";
import BlogList from "./Pages/Blog";
import BlogPost from "./Pages/BlogPost";
import Compare from "./Pages/Compare";
import VerifyResetCode from "./Pages/VerifyResetCode";
import NewPassword from "./Pages/NewPassword";
import ResetPassword from "./Pages/ResetPassword";
import Verify from "./Pages/Verify";
import Cart from "./Pages/Cart/index"
import Checkout from "./Pages/Checkout";
import Account from "./Pages/Account/index";
import MyList from "./Pages/MyList"
import Orders from "./Pages/Orders"

// Seller Dashboard
import SellerApp from "./seller/SellerApp";
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Header from "./Component/Header";
import { Footer } from "./Component/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
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
      <main id="main-content" className="pt-18 pb-12 lg:pt-0 lg:pb-0" role="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MyContextProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </MyContextProvider>
    </BrowserRouter>
  );
};

const AppContent = () => {
  const { cart, removeFromCart, updateCartQty, openCartPanel, setOpenCartPanel } = React.useContext(MyContext);
  useHotkey("Escape", () => setOpenCartPanel(false));
  useHotkey("?", () => alert("Keyboard Shortcuts:\n\nEsc - Close panels\nCtrl+K - Search (when focused)"));
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
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/verify-email" element={<Verify />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/orders" element={<Orders />} />
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
          className: "w-[400px] bg-white flex flex-col",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-black/10">
          <h4 className="text-[18px] font-semibold text-black">
            Shopping Cart ({cart.length})
          </h4>
          <IoCloseSharp
            className="text-2xl cursor-pointer text-gray-500 hover:text-[#ff5252] transition"
            onClick={() => toggleCartPanel(false)}
            aria-label="Close cart"
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
              <IoBagCheckOutline className="text-5xl mb-4 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-6 border-b border-black/10 hover:bg-gray-50 transition"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-black/10 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <h4 className="text-sm font-medium text-gray-800">
                    {item.name}
                  </h4>

                  <p className="text-base font-semibold text-[#ff5252]">
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="w-11 h-11 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-[#ff5252] hover:text-[#ff5252] hover:bg-[#fff5f2] transition"
                      onClick={() => updateCartQty(item.id, Math.max(1, item.qty - 1))}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>

                    <span className="min-w-7.5 text-center text-sm font-medium text-gray-800">
                      {item.qty}
                    </span>

                    <button
                      className="w-11 h-11 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-[#ff5252] hover:text-[#ff5252] hover:bg-[#fff5f2] transition"
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="text-lg text-gray-400 cursor-pointer hover:text-red-500 transition"
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
        <div className="p-6 border-t border-black/10 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base text-gray-500 font-medium">
              Subtotal:
            </span>
            <span className="text-xl text-[#ff5252] font-bold">₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/checkout"
              onClick={() => toggleCartPanel(false)}
              className="w-full py-3 rounded-md font-semibold text-white bg-[#ff5252] hover:bg-accent hover:-translate-y-px hover:shadow-lg hover:shadow-orange-400/30 transition text-center"
            >
              Checkout
            </Link>

            <Link
              to="/cart"
              onClick={() => toggleCartPanel(false)}
              className="w-full py-3 rounded-md font-semibold text-[#ff5252] border-2 border-[#ff5252] hover:bg-[#fff5f2] transition text-center"
            >
              View Cart
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
};


export default App;