import React, { useState } from "react";
//Image
import verifyImg from "../../assets/image/verify3.png";
//Component
import OTPBOX from "../../Component/OTPBox";
//Uis
import Button from "@mui/material/Button";

const Verify = () => {
    const [otp, setOtp] = useState("");

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        alert(`Verifying OTP: ${otp}`);
    }
    return (
        <section className="py-5! lg:py-10!">
            <div className="my-container">
                <div className="px-15! p-10! bg-white rounded-lg! w-full! max-w-md! mx-auto! shadow-md">
                    <div className="text-center flex items-center justify-center">
                        <img src={verifyImg} alt="" width={80} />
                    </div>
                    <h3 className="text-center text-[20px] font-semibold mt-4">
                        Verify OTP
                    </h3>
                    <p className="text-center mb-4">
                        OTP Sent to
                        <span>{"email"}</span>
                    </p>

                    <form onSubmit={verifyOtp}>
                        <div className="flex flex-col gap-8 justify-center items-center">
                            <div className="flex gap-1.25 justify-center mt-5 px-3">
                                <OTPBOX length={6} onChanges={handleOtpChange} />
                            </div>
                            <div className="flex items-center justify-center mt-5">
                                <Button type="submit" className="w-full btn-org btn-lg">Verify OTP</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Verify;
