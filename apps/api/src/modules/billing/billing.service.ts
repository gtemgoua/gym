import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listInvoices = async (params: { status?: string; memberId?: string }) =>
  prisma.invoice.findMany({
    where: {
      status: params.status as any,
      memberId: params.memberId,
    },
    include: {
      member: true,
      subscription: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

export const createInvoice = async (payload: {
  memberId: string;
  subscriptionId?: string;
  amount: number;
  taxAmount?: number;
  description?: string;
  dueAt?: string;
  currency: string;
  metadata?: Record<string, unknown>;
}) => {
  const member = await prisma.user.findUnique({ where: { id: payload.memberId } });
  if (!member) {
    throw new AppError("Member not found", 404);
  }

  const invoice = await prisma.invoice.create({
    data: {
      memberId: payload.memberId,
      subscriptionId: payload.subscriptionId,
      amount: new Prisma.Decimal(payload.amount),
      taxAmount: payload.taxAmount !== undefined ? new Prisma.Decimal(payload.taxAmount) : undefined,
      currency: payload.currency,
      status: "OPEN",
      dueAt: payload.dueAt ? new Date(payload.dueAt) : new Date(),
      lineItems: [{ description: payload.description ?? "Manual charge", amount: payload.amount }],
      metadata: payload.metadata,
    },
    include: { member: true },
  });

  return invoice;
};

export const markInvoicePaid = async (
  id: string,
  payload: { amount?: number; paidAt?: string; providerInvoiceId?: string },
) => {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  const paidAmount = payload.amount ?? Number(invoice.amount);

  const result = await prisma.invoice.update({
    where: { id },
    data: {
      status: "PAID",
      paidAt: payload.paidAt ? new Date(payload.paidAt) : new Date(),
      providerInvoiceId: payload.providerInvoiceId ?? invoice.providerInvoiceId,
    },
  });

  await prisma.paymentLog.create({
    data: {
      invoiceId: id,
      amount: new Prisma.Decimal(paidAmount),
      status: "SUCCEEDED",
      providerRef: payload.providerInvoiceId,
    },
  });

  return result;
};

export const exportInvoicesCsv = async (params: { from?: string; to?: string }) => {
  const where: any = {};
  if (params.from || params.to) {
    where.createdAt = {};
    if (params.from) where.createdAt.gte = new Date(params.from);
    if (params.to) where.createdAt.lte = new Date(params.to);
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: { member: true },
    orderBy: { createdAt: "asc" },
  });

  const header = ["invoice_id", "member_email", "amount", "tax_amount", "status", "due_at", "paid_at"].join(",");
  const rows = invoices.map((invoice) =>
    [
      invoice.id,
      invoice.member.email,
      invoice.amount.toString(),
      invoice.taxAmount?.toString() ?? "0",
      invoice.status,
      invoice.dueAt.toISOString(),
      invoice.paidAt?.toISOString() ?? "",
    ].join(","),
  );

  return [header, ...rows].join("\n");
};
