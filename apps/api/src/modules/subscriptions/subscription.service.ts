import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listSubscriptions = async (params: { memberId?: string }) =>
  prisma.subscription.findMany({
    where: {
      memberId: params.memberId,
    },
    include: {
      plan: true,
      invoices: true,
    },
    orderBy: { createdAt: "desc" },
  });

export const createSubscription = async (payload: {
  memberId: string;
  planId: string;
  startDate?: string;
  status: string;
  paymentProvider: string;
  paymentProviderSubId?: string;
  nextBillingAt?: string;
  currentPeriodEnd?: string;
}) => {
  const member = await prisma.user.findUnique({ where: { id: payload.memberId } });
  if (!member || member.role !== "MEMBER") {
    throw new AppError("Member not found", 404);
  }

  const plan = await prisma.plan.findUnique({ where: { id: payload.planId } });
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  const subscription = await prisma.subscription.create({
    data: {
      memberId: payload.memberId,
      planId: payload.planId,
      status: payload.status as any,
      startDate: payload.startDate ? new Date(payload.startDate) : new Date(),
      paymentProvider: payload.paymentProvider as any,
      paymentProviderSubId: payload.paymentProviderSubId,
      nextBillingAt: payload.nextBillingAt ? new Date(payload.nextBillingAt) : undefined,
      currentPeriodEnd: payload.currentPeriodEnd ? new Date(payload.currentPeriodEnd) : undefined,
    },
    include: {
      plan: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "subscription.created",
      target: `subscription:${subscription.id}`,
      metadata: subscription,
      userId: member.id,
    },
  });

  return subscription;
};

export const updateSubscription = async (
  id: string,
  payload: {
    status?: string;
    nextBillingAt?: string;
    currentPeriodEnd?: string;
    paymentProviderSubId?: string;
    cancellationRequested?: boolean;
    cancelAt?: string;
  },
) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  return prisma.subscription.update({
    where: { id },
    data: {
      status: payload.status ? (payload.status as any) : undefined,
      nextBillingAt: payload.nextBillingAt ? new Date(payload.nextBillingAt) : undefined,
      currentPeriodEnd: payload.currentPeriodEnd ? new Date(payload.currentPeriodEnd) : undefined,
      paymentProviderSubId: payload.paymentProviderSubId,
      cancellationRequested: payload.cancellationRequested,
      canceledAt: payload.cancelAt ? new Date(payload.cancelAt) : undefined,
    },
  });
};

export const cancelSubscription = async (id: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  return prisma.subscription.update({
    where: { id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });
};
