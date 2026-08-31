import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, MenuItem, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MyContext } from "../../MyContext";
import { registerBuyer, registerSeller } from "../../api";

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
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  React.useEffect(() => {
    setErrors({});
  }, [userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formFields.name.trim()) newErrors.name = "Name is required.";
    if (!formFields.email.trim() && !formFields.phone.trim()) {
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
      if (!formFields.storeName.trim()) newErrors.storeName = "Store name is required.";
      if (!formFields.businessCategory) newErrors.businessCategory = "Business category is required.";
      if (!formFields.businessAddress.trim()) newErrors.businessAddress = "Business address is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      context.openAlertBox?.("error", "Please fix the errors below.");
      return;
    }

    const payload = {
      name: formFields.name.trim(),
      email: formFields.email.trim() || undefined,
      phone: formFields.phone.trim() || undefined,
      password: formFields.password,
      role: userType,
      ...(userType === "seller" && {
        storeName: formFields.storeName.trim(),
        businessCategory: formFields.businessCategory,
        businessAddress: formFields.businessAddress.trim(),
      }),
    };

    setIsLoading(true);
    try {
      let data;
      if (userType === "seller") {
        data = await registerSeller(payload);
      } else {
        data = await registerBuyer(payload);
      }

      if (context.login) {
        context.login(data.user);
      }
      if (context.openAlertBox) {
        context.openAlertBox("success", data.message || "Account created successfully!");
      }

      if (userType === "buyer") {
        navigate("/");
      } else {
        navigate("/seller/onboarding");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      context.openAlertBox?.("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-neutral-50 min-h-[70vh] flex items-center">
      <div className="w-full px-4">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm w-full max-w-lg mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Create your account
            </h3>
            <p className="text-sm text-neutral-400">
              Join Chequemart as a buyer or seller
            </p>
          </div>

          {/* User type toggle */}
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setUserType("buyer")}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === "buyer"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setUserType("seller")}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === "seller"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Seller
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-5">
              <TextField
                fullWidth
                label="Full Name"
                variant="standard"
                name="name"
                value={formFields.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <TextField
                fullWidth
                label="Email Address"
                variant="standard"
                name="email"
                value={formFields.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>

            {/* Phone */}
            <div className="mb-5">
              <TextField
                fullWidth
                label="Phone Number"
                variant="standard"
                name="phone"
                value={formFields.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </div>

            {/* Seller fields */}
            {userType === "seller" && (
              <>
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                    Business Information
                  </p>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                <div className="mb-5">
                  <TextField
                    fullWidth
                    label="Store / Business Name"
                    variant="standard"
                    name="storeName"
                    value={formFields.storeName}
                    onChange={handleChange}
                    error={!!errors.storeName}
                    helperText={errors.storeName}
                  />
                </div>

                <div className="mb-5">
                  <TextField
                    select
                    fullWidth
                    label="Business Category"
                    variant="standard"
                    name="businessCategory"
                    value={formFields.businessCategory}
                    onChange={handleChange}
                    error={!!errors.businessCategory}
                    helperText={errors.businessCategory}
                  >
                    {businessCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="mb-5">
                  <TextField
                    fullWidth
                    label="Business Address"
                    variant="standard"
                    name="businessAddress"
                    value={formFields.businessAddress}
                    onChange={handleChange}
                    error={!!errors.businessAddress}
                    helperText={errors.businessAddress}
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="relative mb-5">
              <TextField
                fullWidth
                type={isShowPassword ? "text" : "password"}
                label="Password"
                variant="standard"
                name="password"
                value={formFields.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "Min 8 characters, with upper, lower, & number"}
              />
              <Button
                type="button"
                disableRipple
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute! top-2! right-0! w-10! h-10! min-w-[40px]! rounded-full! text-neutral-400! hover:text-neutral-600!"
              >
                {isShowPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
              </Button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-5">
              <TextField
                fullWidth
                type={isShowConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                variant="standard"
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Button
                type="button"
                disableRipple
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                className="absolute! top-2! right-0! w-10! h-10! min-w-[40px]! rounded-full! text-neutral-400! hover:text-neutral-600!"
              >
                {isShowConfirmPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
              </Button>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    sx={{
                      color: "#d4d4d4",
                      "&.Mui-checked": { color: "#ff5252" },
                    }}
                  />
                }
                label={
                  <span className="text-sm text-neutral-500">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary-500 font-medium hover:text-primary-600">Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary-500 font-medium hover:text-primary-600">Privacy Policy</Link>
                  </span>
                }
              />
              {errors.terms && (
                <p className="text-error-500 text-xs mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-org w-full! py-3!"
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Create Account"}
            </Button>

            {/* Login link */}
            <p className="text-center text-sm text-neutral-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
