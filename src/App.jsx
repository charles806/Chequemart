import React, { useState } from "react";
import Header from "./Component/Header";
import { Footer } from "./Component/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ProductDetail from "./Pages/ProductDetail";
import Verify from "./Pages/Verify";
import { MyContext } from "./MyContext";

const App = () => {
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);

  const values = {
    setOpenCartPanel,
    openCartPanel,
    isOpenCatPanel,
    setIsOpenCatPanel,
  };

  return (
    <>
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
              <Route path="/account" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
