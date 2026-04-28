import React, { useState, useContext, useEffect } from "react";
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import { nigeriaStates } from "../../data/nigeriaStates.js";

import { MyContext } from "../../MyContext";

const Checkout = () => {
    const { cart, user } = React.useContext(MyContext);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [billingDetails, setBillingDetails] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        address: "",
        apartment: "",
        phone: user?.phone || "",
        zipCode: "",
        additionalInfo: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setBillingDetails(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone
            }));
        }
    }, [user]);

    const handleStateChange = (event) => {
        setState(event.target.value);
        setCity("");
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleBillingChange = (field) => (event) => {
        setBillingDetails(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        setLoading(true);
        try {
            const token = Cookies.get("accessToken");
            const items = cart.map(item => ({
                productId: item.id,
                quantity: item.qty
            }));

            const orderResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders`,
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    credentials: "include",
                    body: JSON.stringify({ items, shippingAddress: { ...billingDetails, state, city } })
                }
            );
            const orderData = await orderResponse.json();
            
            if (!orderData.success) {
                throw new Error(orderData.message);
            }

            const orderIds = orderData.orders.map(o => o._id);

            const paymentResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders/initialize-payment`,
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    credentials: "include",
                    body: JSON.stringify({ orderIds })
                }
            );
            const paymentData = await paymentResponse.json();

            if (paymentData.success && paymentData.data?.authorization_url) {
                window.location.href = paymentData.data.authorization_url;
            } else {
                alert("Payment initialization failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert(error.message || "Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const subtotal = cart.reduce(
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
                                <TextField 
                                    fullWidth 
                                    label="Full Name" 
                                    size="small" 
                                    value={billingDetails.fullName}
                                    onChange={handleBillingChange('fullName')}
                                />
                                <TextField 
                                    fullWidth 
                                    label="Email" 
                                    type="email" 
                                    size="small" 
                                    value={billingDetails.email}
                                    onChange={handleBillingChange('email')}
                                />
                            </div>

                            {/* Address */}
                            <h4 className="text-sm font-medium mb-2">Street Address</h4>
                            <div className="pb-4">
                                <TextField 
                                    fullWidth 
                                    label="Home Address" 
                                    size="small"
                                    value={billingDetails.address}
                                    onChange={handleBillingChange('address')}
                                />
                            </div>

                            <div className="pb-4">
                                <TextField
                                    fullWidth
                                    label="Apartment, suite, unit (optional)"
                                    size="small"
                                    value={billingDetails.apartment}
                                    onChange={handleBillingChange('apartment')}
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
                                <TextField 
                                    fullWidth 
                                    label="Phone Number" 
                                    size="small" 
                                    value={billingDetails.phone}
                                    onChange={handleBillingChange('phone')}
                                />
                                <TextField 
                                    fullWidth 
                                    label="Zip Code" 
                                    size="small"
                                    value={billingDetails.zipCode}
                                    onChange={handleBillingChange('zipCode')}
                                />
                            </div>

                            {/* Extra Info */}
                            <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                            <TextField
                                fullWidth
                                label="Additional Information (Optional)"
                                size="small"
                                multiline
                                rows={4}
                                value={billingDetails.additionalInfo}
                                onChange={handleBillingChange('additionalInfo')}
                            />
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

                            {cart.length === 0 ? (
                                <p className="text-center py-5 text-gray-400">Cart is empty</p>
                            ) : (
                                cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between py-3 text-sm"
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-14 h-14 rounded-md overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
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
                                ))
                            )}
                        </div>

                        {/* TOTAL */}
                        <div className="flex justify-between mt-4 font-semibold">
                            <span>Total</span>
                            <span>₦{subtotal.toLocaleString()}</span>
                        </div>

                        <Button 
                            className="btn-org w-full flex items-center justify-center gap-2 mt-4"
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                        >
                            <IoBagCheckOutline className="text-xl" />
                            {loading ? "Processing..." : "Checkout"}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;