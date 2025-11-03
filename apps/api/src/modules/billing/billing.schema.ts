import { z } from "zod";

export const invoiceCreateSchema = z.object({
  memberId: z.string(),
  subscriptionId: z.string().optional(),
  amount: z.coerce.number().positive(),
  taxAmount: z.coerce.number().nonnegative().optional(),
  description: z.string().optional(),
  dueAt: z.string().optional(),
  currency: z.string().default("USD"),
  metadata: z.record(z.any()).optional(),
});

export const invoicePaymentSchema = z.object({
  paymentMethodId: z.string().optional(),
  amount: z.coerce.number().positive().optional(),
  paidAt: z.string().optional(),
  providerInvoiceId: z.string().optional(),
});
