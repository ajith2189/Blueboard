// src/components/OtpVerificationModal.tsx
import React, { useState, useEffect } from "react";

interface Props {
  email: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
}

const OtpVerificationModal: React.FC<Props> = ({ email, onClose, onVerify }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`);
        next?.focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-2">Email OTP Verification</h2>
        <p className="text-gray-600 mb-6">
          Enter the verification code we just sent to <b>{email}</b>
        </p>

        {/* OTP inputs */}
        <div className="flex space-x-3 mb-6 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-12 h-12 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>

        {timer > 0 && (
          <p className="text-gray-500 text-sm text-center mb-4">
            00:{timer.toString().padStart(2, "0")}s
          </p>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6}
          className={`w-full py-3 rounded-lg text-white text-lg font-medium ${
            otp.join("").length === 6
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
