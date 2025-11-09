// src/components/auth/RegisterForm.tsx
import { useForm } from "react-hook-form"
import InputField from "@/components/ui/InputField"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface RegisterFormProps {
  variant: "user" | "tutor" | "admin"
}

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm({ variant }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const onSubmit = (data: RegisterFormData) => {
    console.log(`${variant} register:`, data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card/70 backdrop-blur-md p-8 rounded-2xl shadow-lg space-y-6 border border-border/30"
    >
      <h2 className="text-2xl font-bold text-foreground text-center">
        {variant.charAt(0).toUpperCase() + variant.slice(1)} Registration
      </h2>

      <InputField
        label="Full Name"
        placeholder="Enter your name"
        register={register("name", { required: "Name is required" })}
        error={errors.name}
      />

      <InputField
        label="Email"
        placeholder="Enter your email"
        register={register("email", { required: "Email is required" })}
        error={errors.email}
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        type="password"
        showToggle
        register={register("password", { required: "Password is required" })}
        error={errors.password}
      />

      <InputField
        label="Confirm Password"
        placeholder="Confirm your password"
        type="password"
        showToggle
        register={register("confirmPassword", {
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
        })}
        error={errors.confirmPassword}
      />

      <Button
        type="submit"
        icon={<UserPlus />}
        variant={
          variant === "user"
            ? "default"
            : variant === "tutor"
            ? "view"
            : "admin"
        }
        className="w-full mt-4"
      >
        Register
      </Button>
    </form>
  )
}
