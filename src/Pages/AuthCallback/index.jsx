import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Google OAuth failed. Please try again or use email login.");
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({}));
      navigate("/dashboard");
    } else {
      setError("Invalid callback. No token received.");
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/login" className="text-[#ff5252] hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <CircularProgress />
    </div>
  );
};

export default AuthCallback;