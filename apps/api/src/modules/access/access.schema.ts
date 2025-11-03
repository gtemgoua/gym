import { z } from "zod";

export const accessUpdateSchema = z.object({
  memberId: z.string(),
  status: z.enum(["ALLOWED", "BLOCKED"]),
  externalRef: z.string().optional(),
});
