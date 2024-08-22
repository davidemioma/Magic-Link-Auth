import { z } from "zod";
import { userRole } from "./server/db/schema";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." }),
});

export type LoginValidator = z.infer<typeof LoginSchema>;

export const VerifyTokenSchema = z.object({
  token: z
    .string()
    .refine(
      (val) =>
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          val
        ),
      {
        message: "Invalid token format",
      }
    ),
});

export const ResetSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." }),
});

export type ResetValidator = z.infer<typeof ResetSchema>;

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  role: z.enum([...userRole.enumValues]),
  email: z.optional(z.string().email()),
});

export type SettingsValidator = z.infer<typeof SettingsSchema>;
