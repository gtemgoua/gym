import { z } from "zod";

export const planCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  billingPeriod: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "ANNUAL", "DROP_IN"]),
  creditsPerPeriod: z.coerce.number().int().nonnegative().optional(),
  contractMonths: z.coerce.number().int().positive().optional(),
  cancellationPolicy: z.string().optional(),
  freezeRules: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(1).optional(),
  allowProration: z.boolean().optional(),
  allowDropIn: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const planUpdateSchema = planCreateSchema.partial().extend({
  active: z.boolean().optional(),
});
