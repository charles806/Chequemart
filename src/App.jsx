import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Verify from "./Pages/Verify";
import Cart from "./Pages/Cart/index"

// Components
import Header from "./Component/Header";
import { Footer } from "./Component/Footer";

// Context
import { MyContext } from "./MyContext";

// UI & Icons
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import cartImg from "../src/assets/image/product1.jpg";

const App = () => {
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [count, setCount] = useState(1);

  const values = {
    openCartPanel,
    setOpenCartPanel,
  };

  // Correct toggle function for cart
  const toggleCartPanel = (newOpen) => {
    setOpenCartPanel(newOpen);
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Header />
        <main className="pt-22.5 pb-17.5 lg:pt-0 lg:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <Footer />

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
              Shopping Cart (3)
            </h4>
            <IoCloseSharp
              className="text-2xl cursor-pointer text-gray-500 hover:text-[#ff5252] transition"
              onClick={() => toggleCartPanel(false)}
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {[1].map((item) => (
              <div
                key={item}
                className="flex gap-4 p-6 border-b border-black/10 hover:bg-gray-50 transition"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-black/10 shrink-0">
                  <img
                    src={cartImg}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <h4 className="text-sm font-medium text-gray-800">
                    Green Satin Dress
                  </h4>

                  <p className="text-base font-semibold text-[#ff5252]">
                    ₦9000
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-[#ff5252] hover:text-[#ff6b26] hover:bg-[#fff5f2] transition"
                      onClick={() => setCount((prev) => Math.max(0, prev - 1))}
                    >
                      -
                    </button>

                    <span className="min-w-7.5 text-center text-sm font-medium text-gray-800">
                      {count}
                    </span>

                    <button
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-[#ff6b26] hover:text-[#ff6b26] hover:bg-[#fff5f2] transition"
                      onClick={() => setCount((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <IoCloseSharp className="text-lg text-gray-400 cursor-pointer hover:text-red-500 transition" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-black/10 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base text-gray-500 font-medium">
                Subtotal:
              </span>
              <span className="text-xl text-[#ff5252] font-bold">₦9000</span>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/checkout">
                <button className="w-full py-3 rounded-md font-semibold text-white bg-[#ff5252] hover:bg-[#e55a1a] hover:-translate-y-px hover:shadow-lg hover:shadow-orange-400/30 transition cursor-pointer">
                  Checkout
                </button>
              </Link>

              <Link to="/cart">
                <button className="w-full py-3 rounded-md font-semibold text-[#ff5252] border-2 border-[#ff5252] hover:bg-[#fff5f2] transition cursor-pointer">
                  View Cart
                </button>
              </Link>
            </div>
          </div>
        </Drawer>
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;