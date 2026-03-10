/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "../../MyContext";

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();
  const context = useContext(MyContext);

  const handleChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formFields.identifier || !formFields.password) {
      context.openAlertBox("error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends/receives HTTP-only cookies
        body: JSON.stringify({
          identifier: formFields.identifier,
          password: formFields.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        context.openAlertBox("error", data.message || "Login failed.");
        return;
      }

      context.login(data.user, data.accessToken);
      context.openAlertBox("success", "Login successful!");
      navigate("/");
    } catch (err) {
      context.openAlertBox("error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-10">
      <div className="w-full flex justify-center px-4">
        <div className="bg-white shadow-md rounded-md w-full sm:w-[90%] md:w-[60%] lg:w-100 px-6 py-8">
          <h3 className="text-center text-[22px] font-semibold text-black mb-8">
            Login to your account
          </h3>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* EMAIL OR PHONE */}
            <div className="w-full mb-6">
              <TextField
                type="text"
                id="identifier"
                label="Email or Phone Number"
                variant="standard"
                name="identifier"
                className="w-full"
                value={formFields.identifier}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
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
              />
              <Button
                type="button"
                disableRipple
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute! right-0! z-50! w-10! h-10! min-w-10! rounded-full! text-black/60! transition-all! duration-300! hover:bg-black/5! hover:text-black!"
              >
                {isShowPassword ? (
                  <IoEyeOff className="text-[20px]" />
                ) : (
                  <IoEye className="text-[20px]" />
                )}
              </Button>
            </div>

            {/* FORGOT */}
            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password"
                className="text-[14px] font-medium text-[#ff5252] hover:text-black hover:underline transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <div className="mt-6 mb-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-org w-full!"
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : "Login"}
              </Button>
            </div>

            {/* REGISTER */}
            <p className="text-center text-[14px] text-gray-500 mb-6">
              Don&apos;t have an account?
              <Link
                to="/register"
                className="ml-1 font-semibold text-[#ff5252] hover:text-black hover:underline"
              >
                Register
              </Link>
            </p>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <p className="text-[13px] font-medium text-gray-400 whitespace-nowrap">
                Or continue with social account
              </p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* GOOGLE — Phase 2 */}
            <Button
              type="button"
              disabled
              className="w-full! flex! items-center! justify-center! gap-3! bg-gray-50! text-black! border! border-gray-300! py-3! rounded-md! normal-case! text-[15px]! font-medium!"
            >
              <FcGoogle className="text-[20px]" />
              <span>Continue with Google</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;