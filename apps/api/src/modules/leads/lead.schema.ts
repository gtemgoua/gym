import { z } from "zod";

export const leadCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const leadUpdateSchema = leadCreateSchema.partial().extend({
  stage: z.enum(["LEAD", "TRIAL", "MEMBER", "LOST"]).optional(),
});

export const leadActivitySchema = z.object({
  type: z.enum(["NOTE", "CALL", "EMAIL", "TAG_UPDATE", "STATUS_CHANGE"]),
  details: z.record(z.any()).optional(),
});
