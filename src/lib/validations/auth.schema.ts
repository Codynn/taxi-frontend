import { z } from "zod";

// ─────────────────────────────────────────────
// Login Schema
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  rememberMe: z.boolean(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

//register
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),

  confirmPassword: z
    .string()
    .min(1, "Please confirm your password")
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),

  rememberMe: z.boolean(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
