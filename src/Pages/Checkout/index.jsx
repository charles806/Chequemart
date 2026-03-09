import React, { useState } from "react";
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import cartImg from "../../assets/image/product1.jpg";
import { nigeriaStates } from "../../data/nigeriaStates.js";

const Checkout = () => {
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const [cartItems] = useState([
        {
            id: 1,
            name: "Barca Home Kit 2024/2025",
            price: 10000,
            qty: 1,
            image: cartImg,
        },
    ]);

    const handleStateChange = (event) => {
        setState(event.target.value);
        setCity("");
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );

    return (
        <section className="py-10">
            <div className="my-container max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-3">
                {/* LEFT */}
                <div className="w-full lg:w-[70%]">
                    <div className="bg-white shadow-md p-4 sm:p-5 rounded-md w-full">
                        <h1 className="text-lg font-semibold">Billing Details</h1>

                        <form className="w-full mt-5">
                            {/* Name & Email */}
                            <div className="flex flex-col sm:flex-row gap-4 pb-5">
                                <TextField fullWidth label="Full Name" size="small" />
                                <TextField fullWidth label="Email" type="email" size="small" />
                            </div>

                            {/* Address */}
                            <h4 className="text-sm font-medium mb-2">Street Address</h4>
                            <div className="pb-4">
                                <TextField fullWidth label="Home Address" size="small" />
                            </div>

                            <div className="pb-4">
                                <TextField
                                    fullWidth
                                    label="Apartment, suite, unit (optional)"
                                    size="small"
                                />
                            </div>

                            {/* State */}
                            <h4 className="text-sm font-medium mb-2">State</h4>
                            <div className="pb-4">
                                <FormControl fullWidth size="small">
                                    <InputLabel>State</InputLabel>
                                    <Select value={state} label="State" onChange={handleStateChange}>
                                        {Object.keys(nigeriaStates).map((stateName) => (
                                            <MenuItem key={stateName} value={stateName}>
                                                {stateName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            {/* City */}
                            <h4 className="text-sm font-medium mb-2">City / Town</h4>
                            <div className="pb-4">
                                <FormControl fullWidth disabled={!state} size="small">
                                    <InputLabel>City / LGA</InputLabel>
                                    <Select value={city} label="City / LGA" onChange={handleCityChange}>
                                        {state &&
                                            nigeriaStates[state].map((cityName) => (
                                                <MenuItem key={cityName} value={cityName}>
                                                    {cityName}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Phone & Zip */}
                            <div className="flex flex-col sm:flex-row gap-4 pb-5">
                                <TextField fullWidth label="Phone Number" size="small" />
                                <TextField fullWidth label="Zip Code" size="small" />
                            </div>

                            {/* Extra Info */}
                            <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                            <TextField
                                fullWidth
                                label="Additional Information (Optional)"
                                size="small"
                                multiline
                                rows={4}
                            />

                            <div className="flex justify-center mt-6">
                                <Button className="btn-org">Add Billing Details</Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[30%]">
                    <div className="bg-white shadow-md p-4 sm:p-5 rounded-md">
                        <h2 className="mb-4 font-semibold">Your Order</h2>

                        <div className="max-h-64 overflow-y-auto pr-2">
                            <div className="flex justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)] text-sm font-semibold">
                                <span>Products</span>
                                <span>Subtotal</span>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between py-3 text-sm"
                                >
                                    <div className="flex gap-3">
                                        <div className="w-14 h-14 rounded-md overflow-hidden">
                                            <img
                                                src={item.image}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h4>{item.name}</h4>
                                            <span>Qty: {item.qty}</span>
                                        </div>
                                    </div>

                                    <span className="font-medium">
                                        ₦{(item.price * item.qty).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* TOTAL */}
                        <div className="flex justify-between mt-4 font-semibold">
                            <span>Total</span>
                            <span>₦{subtotal.toLocaleString()}</span>
                        </div>

                        <Button className="btn-org w-full flex items-center justify-center gap-2 mt-4">
                            <IoBagCheckOutline className="text-xl" />
                            Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;