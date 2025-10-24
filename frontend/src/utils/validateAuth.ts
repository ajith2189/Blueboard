import { z } from "zod";

// ------------- Register Schema -------------
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ------------- Login Schema -------------
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ------------- Generic Validator -------------
export const validateForm = async <T>(schema: z.ZodType<T>, data: object) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
};
