
import type React from "react"

// src/components/common/InputField.tsx
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface InputFieldProps {
  label: string  
  placeholder?: string
  type?: string
  register: UseFormRegisterReturn
  error?: FieldError
  showToggle?: boolean // enable password show/hide
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  register,
  error,
  showToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = showToggle ? (showPassword ? "text" : "password") : type

  return (
    <div className="w-full">
      <label className="block mb-2 text-foreground font-medium text-sm">{label}</label>
      <div className="relative">
        <input
          {...register}
          type={inputType}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-input border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${
            error ? "border-destructive focus:ring-destructive" : "border-border hover:border-border/80"
          }`}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-destructive text-sm mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-destructive rounded-full"></span>
          {error.message}
        </p>
      )}
    </div>
  )
}

export default InputField
