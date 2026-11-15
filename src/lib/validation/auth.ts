import { z } from "zod";

// Error messages are translation keys (messages/*.json → "Errors").
export const passwordSchema = z
  .string()
  .min(8, "passwordTooShort")
  .max(72, "passwordTooLong")
  .regex(/[A-Za-z]/, "passwordNeedsLetter")
  .regex(/[0-9]/, "passwordNeedsDigit");

export const signUpSchema = z.object({
  role: z.enum(["animator", "hotel_staff"], { error: "roleRequired" }),
  displayName: z.string().trim().min(2, "nameTooShort").max(80, "nameTooLong"),
  email: z.email("invalidEmail").trim().toLowerCase(),
  password: passwordSchema,
  acceptTerms: z.literal("on", { error: "termsRequired" }),
});

export const logInSchema = z.object({
  email: z.email("invalidEmail").trim().toLowerCase(),
  password: z.string().min(1, "passwordRequired"),
});

export type FormState = {
  status: "idle" | "error" | "success";
  // Translation key under "Errors" for a form-level message
  message?: string;
  // Field name → translation key under "Errors"
  fieldErrors?: Record<string, string>;
  // Echo of submitted values so the form keeps them after an error
  values?: Record<string, string>;
};

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
