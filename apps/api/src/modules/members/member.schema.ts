import { z } from "zod";

export const memberFilterSchema = z.object({
  status: z.array(z.enum(["ACTIVE", "TRIAL", "FROZEN", "DELINQUENT", "CANCELED"])).optional(),
  q: z.string().optional(),
  take: z.coerce.number().max(100).default(50),
  skip: z.coerce.number().default(0),
});

export const memberCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  birthdate: z.string().optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
  waiverSignedAt: z.string().optional(),
  status: z.enum(["ACTIVE", "TRIAL", "FROZEN", "DELINQUENT", "CANCELED"]).default("ACTIVE"),
});

export const memberUpdateSchema = memberCreateSchema.partial();

export const statusUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "TRIAL", "FROZEN", "DELINQUENT", "CANCELED"]),
  reason: z.string().optional(),
});
