import { z } from "zod";

export const templateCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  defaultCoachId: z.string().optional(),
  defaultCapacity: z.coerce.number().int().positive().optional(),
  defaultDuration: z.coerce.number().int().positive().optional(),
  creditCost: z.coerce.number().int().positive().default(1),
  category: z.string().optional(),
  color: z.string().optional(),
  location: z.string().optional(),
  room: z.string().optional(),
  recurrenceRule: z.string().optional(),
});

export const templateUpdateSchema = templateCreateSchema.partial();

export const eventCreateSchema = z.object({
  templateId: z.string().optional(),
  name: z.string().optional(),
  startAt: z.string(),
  endAt: z.string().optional(),
  coachId: z.string().optional(),
  capacity: z.coerce.number().int().positive(),
  waitlistSize: z.coerce.number().int().nonnegative().default(0),
  location: z.string(),
  room: z.string().optional(),
  status: z.enum(["SCHEDULED", "CANCELED", "COMPLETED"]).default("SCHEDULED"),
  notes: z.string().optional(),
});

export const eventQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  location: z.string().optional(),
  coachId: z.string().optional(),
  templateId: z.string().optional(),
});
