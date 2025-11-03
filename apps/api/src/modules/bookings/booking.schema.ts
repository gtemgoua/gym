import { z } from "zod";

export const bookingCreateSchema = z.object({
  memberId: z.string(),
  classEventId: z.string(),
  source: z.string().optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(["BOOKED", "WAITLISTED", "CANCELED", "NO_SHOW"]),
  consumedCredit: z.boolean().optional(),
});
