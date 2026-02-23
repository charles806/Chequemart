import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Register = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState("buyer");
    const [businessCategory, setBusinessCategory] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const businessCategories = [
        "Fashion & Clothing",
        "Electronics",
        "Home & Kitchen",
        "Bag",
        "Footwear",
        "Beauty",
        "Jewelry",
    ];

    return (
        <section className="py-10 flex justify-center">
            <div
                className="
          bg-white shadow-md rounded-md
          w-full sm:w-[90%] md:w-[70%] lg:w-125
          p-6 sm:p-8 pt-10 pb-10
        "
            >
                <h3 className="text-center text-[22px] font-semibold mb-6">
                    Create your account
                </h3>

                {/* USER TYPE TOGGLE */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-md mb-8">
                    <Button
                        disableRipple
                        onClick={() => setUserType("buyer")}
                        className={`flex-1! py-2! rounded! text-sm! font-medium! !transition ${userType === "buyer"
                                ? "!bg-[#FF5252] !text-white !shadow"
                                : "!text-gray-600 hover:!bg-black/5"
                            }`}
                    >
                        Buyer
                    </Button>

                    <Button
                        disableRipple
                        onClick={() => setUserType("seller")}
                        className={`!flex-1 !py-2 !rounded !text-sm !font-medium !transition ${userType === "seller"
                                ? "!bg-[#FF5252] !text-white !shadow"
                                : "!text-gray-600 hover:!bg-black/5"
                            }`}
                    >
                        Seller
                    </Button>
                </div>

                <form>
                    {/* BASIC INFO */}
                    <div className="mb-6">
                        <TextField fullWidth label="Full Name" variant="standard" />
                    </div>

                    <div className="mb-6">
                        <TextField fullWidth label="Email Address" variant="standard" />
                    </div>

                    <div className="mb-6">
                        <TextField fullWidth label="Phone Number" variant="standard" />
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
                                <TextField fullWidth label="Store/Business Name" variant="standard" />
                            </div>

                            <div className="mb-6">
                                <TextField
                                    select
                                    fullWidth
                                    label="Business Category"
                                    variant="standard"
                                    value={businessCategory}
                                    onChange={(e) => setBusinessCategory(e.target.value)}
                                >
                                    {businessCategories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <div className="mb-6">
                                <TextField fullWidth label="Business Address" variant="standard" />
                            </div>
                        </>
                    )}

                    {/* PASSWORD */}
                    <div className="relative mb-6">
                        <TextField
                            fullWidth
                            type={isShowPassword ? "text" : "password"}
                            label="Password"
                            variant="standard"
                        />
                        <Button
                            type="button"
                            disableRipple
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            className="
                !absolute !top-2 !right-0
                !w-10 !h-10 !min-w-[40px]
                !rounded-full
                !text-black/60
                hover:!bg-black/5 hover:!text-black
              "
                        >
                            {isShowPassword ? (
                                <IoEyeOff className="text-[20px]" />
                            ) : (
                                <IoEye className="text-[20px]" />
                            )}
                        </Button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative mb-6">
                        <TextField
                            fullWidth
                            type={isShowConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            variant="standard"
                        />
                        <Button
                            type="button"
                            disableRipple
                            onClick={() =>
                                setIsShowConfirmPassword(!isShowConfirmPassword)
                            }
                            className="
                !absolute !top-2 !right-0
                !w-10 !h-10 !min-w-[40px]
                !rounded-full
                !text-black/60
                hover:!bg-black/5 hover:!text-black
              "
                        >
                            {isShowConfirmPassword ? (
                                <IoEyeOff className="text-[20px]" />
                            ) : (
                                <IoEye className="text-[20px]" />
                            )}
                        </Button>
                    </div>

                    {/* TERMS */}
                    <div className="mb-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    sx={{
                                        color: "#FF5252",
                                        "&.Mui-checked": { color: "#FF5252" },
                                    }}
                                />
                            }
                            label={
                                <span className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-[#FF5252] font-medium hover:underline">
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-[#FF5252] font-medium hover:underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            }
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="mt-8 mb-6">
                        <Button
                            type="submit"
                            className="
                !w-full !bg-[#FF5252] !text-white
                !py-3 !rounded-md !text-[16px] !font-semibold
                hover:!bg-black !transition
              "
                        >
                            Create Account
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mb-6">
                        Already have an account?
                        <Link
                            to="/login"
                            className="ml-1 font-semibold text-[#FF5252] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Register;