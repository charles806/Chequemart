import React, { useState, useEffect, useContext } from "react";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import { nigeriaStates } from "../../data/nigeriaStates.js";
import { MyContext } from "../../MyContext";
import { authFetch } from "../../api";
import { toast } from "sonner";

const Checkout = () => {
  const { cart, user, emptyCart } = useContext(MyContext);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    apartment: "",
    phone: user?.phone || "",
    zipCode: "",
    additionalInfo: ""
  });

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

  const handleBillingChange = (field) => (event) => {
    setBillingDetails(prev => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    if (!billingDetails.fullName.trim()) return "Full name is required";
    if (!billingDetails.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email)) return "Enter a valid email";
    if (!billingDetails.address.trim()) return "Home address is required";
    if (!state) return "State is required";
    if (!city) return "City is required";
    if (!billingDetails.phone.trim()) return "Phone number is required";
    return null;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const validationError = validateForm();
    if (validationError) { setError(validationError); toast.error(validationError); return; }

    setLoading(true);
    setError(null);
    try {
      const items = cart.map(item => ({ productId: item.id, quantity: item.qty }));
      const orderResponse = await authFetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        body: JSON.stringify({ items, shippingAddress: { ...billingDetails, state, city } })
      });
      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.message);

      const orderIds = orderData.orders.map(o => o._id);
      const paymentResponse = await authFetch(`${import.meta.env.VITE_API_URL}/api/orders/initialize-payment`, {
        method: "POST",
        body: JSON.stringify({ orderIds })
      });
      const paymentData = await paymentResponse.json();

      if (paymentData.success && paymentData.data?.authorization_url) {
        await emptyCart();
        window.location.href = paymentData.data.authorization_url;
      } else {
        throw new Error("Payment initialization failed");
      }
    } catch (err) {
      const msg = err.message || "Checkout failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <section className="py-10">
      <div className="my-container max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-3">
        {/* Left: Billing form */}
        <div className="w-full lg:w-[70%]">
          <div className="bg-white border border-neutral-100 shadow-sm p-5 rounded-xl w-full">
            <h1 className="text-lg font-semibold text-neutral-900">Billing Details</h1>
            <form className="w-full mt-5">
              {/* Name & Email */}
              <div className="flex flex-col sm:flex-row gap-4 pb-5">
                <TextField fullWidth label="Full Name" size="small" value={billingDetails.fullName} onChange={handleBillingChange('fullName')} error={!!error && error.includes("Full name")} helperText={error && error.includes("Full name") ? error : undefined} />
                <TextField fullWidth label="Email" type="email" size="small" value={billingDetails.email} onChange={handleBillingChange('email')} error={!!error && error.includes("Email")} helperText={error && error.includes("Email") ? error : undefined} />
              </div>

              {/* Address */}
              <h4 className="text-sm font-medium mb-2 text-neutral-700">Street Address</h4>
              <div className="pb-4">
                <TextField fullWidth label="Home Address" size="small" value={billingDetails.address} onChange={handleBillingChange('address')} error={!!error && error.includes("address")} helperText={error && error.includes("address") ? error : undefined} />
              </div>
              <div className="pb-4">
                <TextField fullWidth label="Apartment, suite, unit (optional)" size="small" value={billingDetails.apartment} onChange={handleBillingChange('apartment')} />
              </div>

              {/* State */}
              <h4 className="text-sm font-medium mb-2 text-neutral-700">State</h4>
              <div className="pb-4">
                <FormControl fullWidth size="small">
                  <InputLabel>State</InputLabel>
                  <Select value={state} label="State" onChange={(e) => { setState(e.target.value); setCity("") }}>
                    {Object.keys(nigeriaStates).map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error && error.includes("State") && <p className="text-sm text-error-500 mt-1">{error}</p>}
              </div>

              {/* City */}
              <h4 className="text-sm font-medium mb-2 text-neutral-700">City / Town</h4>
              <div className="pb-4">
                <FormControl fullWidth disabled={!state} size="small">
                  <InputLabel>City / LGA</InputLabel>
                  <Select value={city} label="City / LGA" onChange={(e) => setCity(e.target.value)}>
                    {state && nigeriaStates[state].map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error && error.includes("City") && <p className="text-sm text-error-500 mt-1">{error}</p>}
              </div>

              {/* Phone & Zip */}
              <div className="flex flex-col sm:flex-row gap-4 pb-5">
                <TextField fullWidth label="Phone Number" size="small" value={billingDetails.phone} onChange={handleBillingChange('phone')} error={!!error && error.includes("Phone")} helperText={error && error.includes("Phone") ? error : undefined} />
                <TextField fullWidth label="Zip Code" size="small" value={billingDetails.zipCode} onChange={handleBillingChange('zipCode')} />
              </div>

              {/* Extra info */}
              <h4 className="text-sm font-medium mb-2 text-neutral-700">Additional Information</h4>
              <TextField fullWidth label="Additional Information (Optional)" size="small" multiline rows={4} value={billingDetails.additionalInfo} onChange={handleBillingChange('additionalInfo')} />
            </form>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="w-full lg:w-[30%]">
          <div className="border border-neutral-100 shadow-sm rounded-xl p-5 bg-white sticky top-24">
            <h2 className="mb-4 font-semibold text-neutral-900">Your Order</h2>
            <div className="max-h-64 overflow-y-auto pr-2">
              <div className="flex justify-between py-3 border-t border-b border-neutral-100 text-sm font-semibold text-neutral-500">
                <span>Products</span>
                <span>Subtotal</span>
              </div>
              {cart.length === 0 ? (
                <p className="text-center py-5 text-neutral-300">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-3 text-sm border-b border-neutral-50">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-50">
                        <img src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div>
                        <h4 className="text-neutral-800 font-medium">{item.name}</h4>
                        <span className="text-neutral-400 text-xs">Qty: {item.qty}</span>
                      </div>
                    </div>
                    <span className="font-medium text-neutral-700">₦{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between mt-4 font-semibold text-neutral-900">
              <span>Total</span>
              <span className="text-primary-500">₦{subtotal.toLocaleString()}</span>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-500">
                {error}
              </div>
            )}
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
