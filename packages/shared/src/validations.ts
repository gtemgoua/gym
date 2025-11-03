import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email");
export const phoneSchema = z
  .string()
  .regex(/^[0-9+\-\s()]{7,}$/, "Enter a valid phone")
  .optional();

export const memberFormSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  phone: phoneSchema,
  notes: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
