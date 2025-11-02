"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Props {
  email: string
  onClose: () => void
  onVerify: (otp: string) => void
  otpError?: string | null
  purpose?: "register" | "reset" // 👈 makes it reusable
  onResend?: () => void // 👈 optional resend handler
}

const OtpVerificationModal: React.FC<Props> = ({
  email,
  onClose,
  onVerify,
  otpError,
  purpose = "register",
  onResend,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
  const [timer, setTimer] = useState(60)

  // countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // OTP input handler
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`)
        next?.focus()
      }
    }
  }

  // Verify button click
  const handleVerify = () => {
    const code = otp.join("")
    if (code.length === 6) onVerify(code)
  }

  // Resend handler
  const handleResend = () => {
    if (timer === 0 && onResend) {
      setOtp(new Array(6).fill(""))
      setTimer(60)
      onResend()
    }
  }

  // Heading and message text adjust based on purpose
  const headingText =
    purpose === "reset" ? "Verify OTP to Reset Password" : "Verify Your Email"
  const messageText =
    purpose === "reset"
      ? `We’ve sent a 6-digit verification code to your email ${email} to confirm your password reset.`
      : `We’ve sent a 6-digit verification code to your email ${email}.`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-8 relative border border-border/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {headingText}
          </h2>
          <p className="text-muted-foreground">{messageText}</p>
        </div>

        {otpError && <p className="text-red-500 text-center mb-3">{otpError}</p>}

        {/* OTP inputs */}
        <div className="flex gap-3 mb-6 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-12 h-12 text-center text-lg font-bold bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all duration-200 text-foreground"
            />
          ))}
        </div>

        {timer > 0 ? (
          <p className="text-muted-foreground text-sm text-center mb-6">
            Resend code in{" "}
            <span className="font-medium text-foreground">
              {timer.toString().padStart(2, "0")}s
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-muted-foreground mb-6">
            Didn’t receive the code?{" "}
            <button
              onClick={handleResend}
              className="text-primary hover:underline font-medium"
            >
              Resend
            </button>
          </p>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6}
          className={`w-full py-3 rounded-xl text-white text-lg font-medium transition-all duration-200 ${
            otp.join("").length === 6
              ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
              : "bg-muted-foreground/50 cursor-not-allowed"
          }`}
        >
          Verify & Continue
        </button>
      </div>
    </div>
  )
}

export default OtpVerificationModal
