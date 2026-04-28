import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, MenuItem, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MyContext } from "../../MyContext";

const businessCategories = [
    "Fashion & Clothing",
    "Electronics",
    "Home & Kitchen",
    "Bag",
    "Footwear",
    "Beauty",
    "Jewelry",
];

const Register = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState("buyer");
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState({});

    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        storeName: "",
        businessCategory: "",
        businessAddress: "",
    });

    const navigate = useNavigate();
    const context = useContext(MyContext);

    const handleChange = (e) => {
        setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // ── Validation ───────────────────────────────────────
        if (!formFields.name) newErrors.name = "Name is required.";
        if (!formFields.email && !formFields.phone) {
            newErrors.email = "Please provide an email or phone number.";
            newErrors.phone = "Please provide an email or phone number.";
        }
        if (formFields.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formFields.password)) {
            newErrors.password = "Password must contain uppercase, lowercase, and number.";
        }
        if (formFields.password !== formFields.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!agreeToTerms) {
            newErrors.terms = "Please agree to the Terms & Conditions.";
        }
        if (userType === "seller") {
            if (!formFields.storeName) newErrors.storeName = "Store name is required.";
            if (!formFields.businessCategory) newErrors.businessCategory = "Business category is required.";
            if (!formFields.businessAddress) newErrors.businessAddress = "Business address is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            context.openAlertBox?.("error", "Please fix the errors below.");
            return;
        }

        // ── Build payload ────────────────────────────────────
        const payload = {
            name: formFields.name,
            email: formFields.email || undefined,
            phone: formFields.phone || undefined,
            password: formFields.password,
            role: userType,
            ...(userType === "seller" && {
                storeName: formFields.storeName,
                businessCategory: formFields.businessCategory,
                businessAddress: formFields.businessAddress,
            }),
        };

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle backend validation errors
                if (data.errors) {
                    const backendErrors = {};
                    data.errors.forEach(err => {
                        backendErrors[err.field] = err.message;
                    });
                    setErrors(backendErrors);
                }
                context.openAlertBox?.("error", data.message || "Registration failed.");
                return;
            }

            // Store token and user in Cookies (via context.login)
            if (context.login) {
                context.login(data.user, data.accessToken);
            }
            if (context.openAlertBox) {
                context.openAlertBox("success", data.message || "Account created successfully!");
            }

            // Redirect based on role
            if (userType === 'buyer') {
                navigate('/');
            } else {
                navigate('/seller/onboarding');
            }
        } catch (err) {
            context.openAlertBox?.("error", "Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-10 flex justify-center">
            <div className="bg-white shadow-md rounded-md w-full sm:w-[90%] md:w-[70%] lg:w-125 p-6 sm:p-8 pt-10 pb-10">
                <h3 className="text-center text-[22px] font-semibold mb-6">
                    Create your account
                </h3>

                {/* USER TYPE TOGGLE */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-md mb-8">
                    <Button

                        onClick={() => setUserType("buyer")}
                        className={`flex-1! py-2! rounded! text-sm! font-medium! transition! ${userType === "buyer"
                                ? "bg-[#FF5252]! text-white! shadow!"
                                : "text-gray-600! hover:bg-black/5!"
                            }`}
                    >
                        Buyer
                    </Button>
                    <Button
                        disableRipple
                        onClick={() => setUserType("seller")}
                        className={`flex-1! py-2! rounded! text-sm! font-medium! transition! ${userType === "seller"
                                ? "bg-[#FF5252]! text-white! shadow!"
                                : "text-gray-600! hover:bg-black/5!"
                            }`}
                    >
                        Seller
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <TextField fullWidth label="Full Name" variant="standard"
                            name="name" value={formFields.name} onChange={handleChange}
                            error={!!errors.name} helperText={errors.name} />
                    </div>

                    <div className="mb-6">
                        <TextField fullWidth label="Email Address" variant="standard"
                            name="email" value={formFields.email} onChange={handleChange}
                            error={!!errors.email} helperText={errors.email} />
                    </div>

                    <div className="mb-6">
                        <TextField fullWidth label="Phone Number" variant="standard"
                            name="phone" value={formFields.phone} onChange={handleChange}
                            error={!!errors.phone} helperText={errors.phone} />
                    </div>

                    {/* SELLER FIELDS */}
                    {userType === "seller" && (
                        <>
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gray-200" />
                                <p className="text-[13px] font-semibold text-[#FF5252]">
                                    Business Information
                                </p>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <div className="mb-6">
                                <TextField fullWidth label="Store/Business Name" variant="standard"
                                    name="storeName" value={formFields.storeName} onChange={handleChange}
                                    error={!!errors.storeName} helperText={errors.storeName} />
                            </div>

                            <div className="mb-6">
                                <TextField select fullWidth label="Business Category" variant="standard"
                                    name="businessCategory" value={formFields.businessCategory} onChange={handleChange}
                                    error={!!errors.businessCategory} helperText={errors.businessCategory}>
                                    {businessCategories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="mb-6">
                                <TextField fullWidth label="Business Address" variant="standard"
                                    name="businessAddress" value={formFields.businessAddress} onChange={handleChange}
                                    error={!!errors.businessAddress} helperText={errors.businessAddress} />
                            </div>
                        </>
                    )}

                    {/* PASSWORD */}
                    <div className="relative mb-6">
                        <TextField fullWidth type={isShowPassword ? "text" : "password"}
                            label="Password" variant="standard"
                            name="password" value={formFields.password} onChange={handleChange}
                            error={!!errors.password} helperText={errors.password || "Min 8 characters, with upper, lower, & number"} />
                        <Button type="button" disableRipple
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            className="!absolute !top-2 !right-0 !w-10 !h-10 !min-w-[40px] !rounded-full !text-black/60 hover:bg-black/5!">
                            {isShowPassword ? <IoEyeOff className="text-[20px]" /> : <IoEye className="text-[20px]" />}
                        </Button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative mb-6">
                        <TextField fullWidth type={isShowConfirmPassword ? "text" : "password"}
                            label="Confirm Password" variant="standard"
                            name="confirmPassword" value={formFields.confirmPassword} onChange={handleChange}
                            error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
                        <Button type="button" disableRipple
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            className="!absolute !top-2 !right-0 !w-10 !h-10 !min-w-[40px] !rounded-full !text-black/60 hover:!bg-black/5">
                            {isShowConfirmPassword ? <IoEyeOff className="text-[20px]" /> : <IoEye className="text-[20px]" />}
                        </Button>
                    </div>

                    {/* TERMS */}
                    <div className="mb-6">
                        <FormControlLabel
                            control={
                                <Checkbox checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    sx={{ color: "#FF5252", "&.Mui-checked": { color: "#FF5252" } }} />
                            }
                            label={
                                <span className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-[#FF5252] font-medium hover:underline">Terms & Conditions</Link>
                                    {" "}and{" "}
                                    <Link to="/privacy" className="text-[#FF5252] font-medium hover:underline">Privacy Policy</Link>
                                </span>
                            }
                        />
                        {errors.terms && (
                            <p className="text-[#d32f2f] text-xs mt-1">{errors.terms}</p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <div className="mt-8 mb-6">
                        <Button type="submit" disabled={isLoading}
                            className="!w-full !bg-[#FF5252] !text-white !py-3 !rounded-md !text-[16px] !font-semibold hover:!bg-black !transition">
                            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mb-6">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#FF5252] hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Register;
