import { z } from "zod";

export const subscriptionCreateSchema = z.object({
  memberId: z.string(),
  planId: z.string(),
  startDate: z.string().optional(),
  status: z.enum(["ACTIVE", "TRIALING", "PAST_DUE", "PAUSED"]).default("ACTIVE"),
  paymentProvider: z.enum(["STRIPE", "SQUARE", "AUTHORIZE_NET"]).default("STRIPE"),
  paymentProviderSubId: z.string().optional(),
  nextBillingAt: z.string().optional(),
  currentPeriodEnd: z.string().optional(),
});

export const subscriptionUpdateSchema = subscriptionCreateSchema
  .partial()
  .extend({
    cancelAt: z.string().optional(),
    cancellationRequested: z.boolean().optional(),
  });
