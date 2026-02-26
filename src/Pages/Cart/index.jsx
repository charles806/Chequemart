import React, { useState } from "react";
import { Link } from "react-router-dom";
import cartImg from "../../assets/image/product1.jpg";
import { IoCloseSharp, IoBagCheckOutline } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { Rating, Button, Menu, MenuItem } from "@mui/material";

const SIZES = ["S", "M", "L", "XL"];
const QTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Cart = () => {
    // Later this will come from backend
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Barca Home Kit 2024/2025",
            brand: "Barca",
            price: 10000,
            oldPrice: 20000,
            rating: 4,
            size: "M",
            qty: 1,
            image: cartImg,
        },
    ]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuType, setMenuType] = useState(null); // "size" or "qty"
    const [activeItemId, setActiveItemId] = useState(null);

    const open = Boolean(anchorEl);

    const openMenu = (event, type, id) => {
        setAnchorEl(event.currentTarget);
        setMenuType(type);
        setActiveItemId(id);
    };

    const closeMenu = () => {
        setAnchorEl(null);
        setMenuType(null);
        setActiveItemId(null);
    };

    const updateSize = (size) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === activeItemId ? { ...item, size } : item
            )
        );
        closeMenu();
    };

    const updateQty = (qty) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === activeItemId ? { ...item, qty } : item
            )
        );
        closeMenu();
    };

    const removeItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <section className="py-10">
            <div className="my-container max-w-300 mx-auto flex flex-col md:flex-row gap-5 px-3">

                {/* LEFT */}
                <div className="w-full md:w-[70%]">
                    <div className="shadow-md rounded-md p-5 bg-white">
                        <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
                            <h2>Your Cart</h2>
                            <p>
                                There are{" "}
                                <span className="font-bold text-[#ff5252]">
                                    {cartItems.length}
                                </span>{" "}
                                products in your cart
                            </p>
                        </div>

                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="cartItem w-full p-3 flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]"
                            >
                                <div className="w-full sm:w-[20%]">
                                    <img src={item.image} alt={item.name} className="w-full" />
                                </div>

                                <div className="w-full sm:w-[80%] relative">
                                    <IoCloseSharp
                                        className="cursor-pointer absolute top-0 right-0 text-[22px]"
                                        onClick={() => removeItem(item.id)}
                                    />

                                    <span className="text-[13px]">{item.brand}</span>

                                    <h3 className="text-[16px]">
                                        <Link to={`/products/${item.id}`}>{item.name}</Link>
                                    </h3>

                                    <Rating value={item.rating} size="small" readOnly />

                                    <div className="flex items-center gap-4 mt-2">

                                        {/* SIZE */}
                                        <span
                                            onClick={(e) => openMenu(e, "size", item.id)}
                                            className="flex items-center bg-[#f1f1f1] text-[12px] font-semibold py-1 px-2 rounded-md cursor-pointer"
                                        >
                                            Size: {item.size} <GoTriangleDown />
                                        </span>

                                        {/* QTY */}
                                        <span
                                            onClick={(e) => openMenu(e, "qty", item.id)}
                                            className="flex items-center bg-[#f1f1f1] text-[12px] font-semibold py-1 px-2 rounded-md cursor-pointer"
                                        >
                                            Qty: {item.qty} <GoTriangleDown />
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="line-through text-gray-500 text-[15px]">
                                            ₦{item.oldPrice.toLocaleString()}
                                        </span>
                                        <span className="text-[#ff5252] font-semibold">
                                            ₦{item.price.toLocaleString()}
                                        </span>
                                        <span className="text-[#ff5252] font-semibold">
                                            {Math.round(
                                                ((item.oldPrice - item.price) / item.oldPrice) * 100
                                            )}% OFF
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-full md:w-[30%]">
                    <div className="shadow-md rounded-md p-5 bg-white">
                        <h3 className="pb-3">Cart Total</h3>
                        <hr />

                        <p className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-[#ff5252] font-bold">
                                ₦{subtotal.toLocaleString()}
                            </span>
                        </p>

                        <p className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-bold">Free</span>
                        </p>

                        <p className="flex justify-between">
                            <span>Destination</span>
                            <span className="font-bold">Nigeria</span>
                        </p>

                        <p className="flex justify-between">
                            <span>Total</span>
                            <span className="text-[#ff5252] font-bold">
                                ₦{subtotal.toLocaleString()}
                            </span>
                        </p>

                        <Link to="/checkout">
                            <Button className="btn-org flex! gap-2! w-full">
                                <IoBagCheckOutline className="text-[22px]" />
                                Checkout
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* MENU */}
            <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
                {menuType === "size" &&
                    SIZES.map((size) => (
                        <MenuItem key={size} onClick={() => updateSize(size)}>
                            {size}
                        </MenuItem>
                    ))}

                {menuType === "qty" &&
                    QTY_OPTIONS.map((qty) => (
                        <MenuItem key={qty} onClick={() => updateQty(qty)}>
                            {qty}
                        </MenuItem>
                    ))}
            </Menu>
        </section >
    );
};

export default Cart;