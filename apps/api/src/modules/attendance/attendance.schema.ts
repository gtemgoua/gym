import { z } from "zod";

export const checkinSchema = z.object({
  memberId: z.string(),
  classEventId: z.string().optional(),
  method: z.enum(["KIOSK", "STAFF", "API"]).default("KIOSK"),
});

export const attendanceQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  classEventId: z.string().optional(),
  memberId: z.string().optional(),
});
