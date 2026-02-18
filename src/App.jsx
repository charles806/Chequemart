import React, { useState } from "react";
import Header from "./Component/Header";
import { Footer } from "./Component/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
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
          <main className="pt-[90px] pb-[70px] lg:pt-0 lg:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/my-list" element={<Home />} />
              <Route path="/cart" element={<Home />} />
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
