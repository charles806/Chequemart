import { FileX } from "lucide-react";
import React, { useState } from "react";

const OTPBOX = ({ length = 6, onChanges }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; 

    //Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChanges(newOtp.join(""));

    if (value && index < length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="otpBox flex gap-1.25 justify-center">
      {otp.map((data, index) => (
        <input
          type="text"
          id={`otp-${index}`}
          key={index}
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength="1"
          className="otp-input"
        />
      ))}
    </div>
  );
};

export default OTPBOX;
