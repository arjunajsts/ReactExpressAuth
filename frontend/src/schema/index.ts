import { z } from "zod";

export const emailSchema = z.string().email();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, { message: "Password is required" }),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(6, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must 6 character" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword)
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Password don't match",
        code: z.ZodIssueCode.custom,
      });
  });

export const passwordForgotSchema = z.object({
  email: emailSchema,
});

export const passwordResetSchema = z.object({
  verificationCode: z.string().min(1).max(24).optional(),
  password: z.string().min(6).max(24),
});
