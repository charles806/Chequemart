import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import verifyImg from "../../assets/image/verify3.png";
import Button from "@mui/material/Button";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying");
    const token = searchParams.get("token");
    const hasFetched = useRef(false);
    const context = React.useContext(MyContext);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        const verifyEmail = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`
                );
                const data = await response.json();

                if (data.success) {
                    setStatus("success");
                    context.openAlertBox?.("success", "Email verified successfully!");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setStatus("error");
                    context.openAlertBox?.("error", data.message || "Verification failed");
                }
            } catch (error) {
                setStatus("error");
                context.openAlertBox?.("error", "Something went wrong. Please try again.");
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <section className="py-5! lg:py-10!">
            <div className="my-container">
                <div className="px-15! p-10! bg-white rounded-lg! w-full! max-w-md! mx-auto! shadow-md">
                    <div className="text-center flex items-center justify-center">
                        <img src={verifyImg} alt="" width={80} />
                    </div>

                    {status === "verifying" && (
                        <>
                            <h3 className="text-center text-[20px] font-semibold mt-4">
                                Verifying your email...
                            </h3>
                            <div className="flex justify-center mt-5">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#ff5252]"></div>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <h3 className="text-center text-[20px] font-semibold mt-4 text-green-600">
                                Email Verified!
                            </h3>
                            <p className="text-center mb-4 text-gray-600">
                                Your email has been verified successfully.
                            </p>
                            <p className="text-center text-sm text-gray-500">
                                Redirecting to login...
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <h3 className="text-center text-[20px] font-semibold mt-4 text-red-600">
                                Verification Failed
                            </h3>
                            <p className="text-center mb-4 text-gray-600">
                                {token
                                    ? "The verification link is invalid or has expired."
                                    : "No verification token provided."}
                            </p>
                            <div className="flex items-center justify-center mt-5">
                                <Button
                                    onClick={() => navigate("/register")}
                                    className="w-full btn-org btn-lg"
                                >
                                    Go to Register
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Verify;
