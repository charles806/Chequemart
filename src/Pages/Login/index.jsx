import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MyContext } from "../../MyContext";
import { login } from "../../api";

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validErrors, setValidErrors] = useState({});
  const [formFields, setFormFields] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();
  const context = useContext(MyContext);

  const handleChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "identifier") {
      if (!value.trim()) {
        error = "Email or phone number is required";
      } else if (value.includes("@")) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Enter a valid email address";
        }
      } else {
        if (!/^(\+234|0)[789][01]\d{8}$/.test(value.replace(/\s/g, ""))) {
          error = "Enter a valid phone number";
        }
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters";
      }
    }
    setValidErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formFields.identifier || !formFields.password) {
      context.openAlertBox?.("error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(formFields.identifier, formFields.password);

      if (context.login) {
        context.login(data.user);
      }
      if (context.openAlertBox) {
        context.openAlertBox("success", "Login successful!");
      }
      if (data.user.role === "buyer") {
        navigate("/");
      } else if (data.user.role === "seller") {
        if (data.user.sellerInfo?.onboardingComplete) {
          navigate("/seller/dashboard");
        } else {
          navigate("/seller/onboarding");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed. Please try again.";
      context.openAlertBox?.("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-neutral-50 min-h-[70vh] flex items-center">
      <div className="w-full px-4">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm w-full max-w-md mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Welcome back
            </h3>
            <p className="text-sm text-neutral-400">
              Sign in to your Chequemart account
            </p>
          </div>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* Email or Phone */}
            <div className="w-full mb-5">
              <TextField
                type="text"
                id="identifier"
                label="Email or Phone Number"
                variant="standard"
                name="identifier"
                className="w-full"
                value={formFields.identifier}
                onChange={handleChange}
                onBlur={() => validateField("identifier", formFields.identifier)}
                error={!!validErrors.identifier}
                helperText={validErrors.identifier}
              />
            </div>

            {/* Password */}
            <div className="w-full mb-2 relative">
              <TextField
                type={isShowPassword ? "text" : "password"}
                id="password"
                label="Password"
                variant="standard"
                name="password"
                className="w-full pr-10"
                value={formFields.password}
                onChange={handleChange}
                onBlur={() => validateField("password", formFields.password)}
                error={!!validErrors.password}
                helperText={validErrors.password}
              />
              <Button
                type="button"
                disableRipple
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute! right-0! z-50! w-10! h-10! min-w-10! rounded-full! text-neutral-400! transition-all! duration-300! hover:bg-neutral-50! hover:text-neutral-700!"
              >
                {isShowPassword ? (
                  <IoEyeOff className="text-lg" />
                ) : (
                  <IoEye className="text-lg" />
                )}
              </Button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-org w-full!"
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
            </Button>

            {/* Register link */}
            <p className="text-center text-sm text-neutral-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primary-500 font-semibold hover:text-primary-600 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
