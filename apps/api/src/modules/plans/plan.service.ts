import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listPlans = async () =>
  prisma.plan.findMany({
    orderBy: { createdAt: "desc" },
  });

export const getPlan = async (id: string) => {
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  return plan;
};

export const createPlan = async (payload: {
  name: string;
  description?: string;
  price: number;
  billingPeriod: string;
  creditsPerPeriod?: number;
  contractMonths?: number;
  cancellationPolicy?: string;
  freezeRules?: string;
  taxRate?: number;
  allowProration?: boolean;
  allowDropIn?: boolean;
  tags?: string[];
}) =>
  prisma.plan.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: new Prisma.Decimal(payload.price),
      billingPeriod: payload.billingPeriod as any,
      creditsPerPeriod: payload.creditsPerPeriod,
      contractMonths: payload.contractMonths,
      cancellationPolicy: payload.cancellationPolicy,
      freezeRules: payload.freezeRules,
      taxRate: payload.taxRate ? new Prisma.Decimal(payload.taxRate) : undefined,
      allowProration: payload.allowProration,
      allowDropIn: payload.allowDropIn,
      tags: payload.tags,
    },
  });

export const updatePlan = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
    price?: number;
    billingPeriod?: string;
    creditsPerPeriod?: number;
    contractMonths?: number;
    cancellationPolicy?: string;
    freezeRules?: string;
    taxRate?: number;
    allowProration?: boolean;
    allowDropIn?: boolean;
    tags?: string[];
    active?: boolean;
  },
) => {
  await getPlan(id);
  return prisma.plan.update({
    where: { id },
    data: {
      ...payload,
      price: payload.price !== undefined ? new Prisma.Decimal(payload.price) : undefined,
      taxRate: payload.taxRate !== undefined ? new Prisma.Decimal(payload.taxRate) : undefined,
    },
  });
};
