import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp, IoBagCheckOutline } from "react-icons/io5";
import { Rating, Button, Select, MenuItem, InputLabel } from "@mui/material";
import { MyContext } from "../../MyContext";

const SIZES = ["S", "M", "L", "XL"];
const QTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Cart = () => {
  const { cart, removeFromCart, updateCartQty } = useContext(MyContext);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
    e.target.onerror = null;
  };

  return (
    <section className="py-10">
      <div className="my-container max-w-300 mx-auto flex flex-col md:flex-row gap-5 px-3">
        {/* Left: Cart items */}
        <div className="w-full md:w-[70%]">
          <div className="border border-neutral-100 shadow-sm rounded-xl p-5 bg-white">
            <div className="py-2 px-3 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">Your Cart</h2>
              <p className="text-sm text-neutral-400">
                There are <span className="font-bold text-primary-500">{cart.length}</span> products in your cart
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-300">
                <IoBagCheckOutline className="text-6xl mb-4 opacity-20" />
                <p className="text-lg">Your cart is empty</p>
                <Link to="/products" className="mt-4 text-primary-500 font-semibold hover:text-primary-600 hover:underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cartItem w-full p-3 flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-neutral-100 last:border-0">
                  <div className="w-full sm:w-[20%]">
                    <img src={item.image} alt={item.name} className="w-full h-auto rounded-lg" width={80} height={80} onError={handleImageError} />
                  </div>
                  <div className="w-full sm:w-[80%] relative">
                    <button
                      className="cursor-pointer absolute top-0 right-0 text-xl text-neutral-300 hover:text-primary-500 transition-colors"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <IoCloseSharp />
                    </button>
                    <span className="text-xs text-neutral-400 uppercase tracking-wide">{item.brand}</span>
                    <h3 className="text-base font-semibold text-neutral-800 mt-1">
                      <Link to={`/products/${item.id}`} className="hover:text-primary-500 transition-colors">{item.name}</Link>
                    </h3>
                    <Rating value={item.rating} size="small" readOnly />
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <InputLabel id={`size-${item.id}-label`} shrink className="!text-xs">Size</InputLabel>
                        <Select
                          value={item.size || "M"}
                          label="Size"
                          labelId={`size-${item.id}-label`}
                          className="bg-neutral-50 text-xs font-semibold py-1 px-2 rounded-lg cursor-pointer"
                          size="small"
                          onChange={() => {}}
                        >
                          {SIZES.map((size) => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <InputLabel id={`qty-${item.id}-label`} shrink className="!text-xs">Qty</InputLabel>
                        <Select
                          value={item.qty}
                          label="Quantity"
                          labelId={`qty-${item.id}-label`}
                          className="bg-neutral-50 text-xs font-semibold py-1 px-2 rounded-lg cursor-pointer"
                          size="small"
                          onChange={(e) => updateCartQty(item.id, parseInt(e.target.value))}
                        >
                          {QTY_OPTIONS.map((qty) => (
                            <MenuItem key={qty} value={qty}>{qty}</MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      {item.oldPrice > item.price && (
                        <span className="line-through text-neutral-300 text-sm">₦{item.oldPrice.toLocaleString()}</span>
                      )}
                      <span className="text-primary-500 font-semibold">₦{item.price.toLocaleString()}</span>
                      {item.oldPrice > item.price && (
                        <span className="text-primary-500 font-semibold text-xs">
                          {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-[30%]">
          <div className="border border-neutral-100 shadow-sm rounded-xl p-5 bg-white sticky top-24">
            <h3 className="pb-3 font-semibold text-neutral-900">Cart Total</h3>
            <hr className="border-neutral-100" />
            <div className="space-y-3 mt-3">
              <p className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-primary-500 font-bold">₦{subtotal.toLocaleString()}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-bold text-success-500">Free</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-neutral-500">Destination</span>
                <span className="font-bold text-neutral-700">Nigeria</span>
              </p>
              <hr className="border-neutral-100" />
              <p className="flex justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="text-primary-500 font-bold text-lg">₦{subtotal.toLocaleString()}</span>
              </p>
            </div>
            <Link to="/checkout">
              <Button className="btn-org flex! gap-2! w-full mt-4">
                <IoBagCheckOutline className="text-xl" /> Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
