import { z } from "zod";

export const messageTemplateCreateSchema = z.object({
  key: z.string(),
  channel: z.enum(["EMAIL", "SMS"]),
  subject: z.string().optional(),
  body: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export const messageTemplateUpdateSchema = messageTemplateCreateSchema.partial();

export const announcementSchema = z.object({
  subject: z.string(),
  body: z.string(),
  target: z.enum(["ALL_MEMBERS", "ACTIVE_ONLY", "TRIAL"]),
});
