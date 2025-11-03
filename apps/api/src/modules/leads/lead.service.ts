import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listLeads = async (params: { stage?: string }) =>
  prisma.lead.findMany({
    where: {
      stage: params.stage as any,
    },
    include: { activities: true },
    orderBy: { createdAt: "desc" },
  });

export const createLead = async (payload: {
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  notes?: string;
  tags?: string[];
}) =>
  prisma.lead.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      source: payload.source,
      notes: payload.notes,
      tags: payload.tags ?? [],
    },
    include: { activities: true },
  });

export const updateLead = async (
  id: string,
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    source?: string;
    notes?: string;
    tags?: string[];
    stage?: string;
  },
) => {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }
  return prisma.lead.update({
    where: { id },
    data: payload,
    include: { activities: true },
  });
};

export const addLeadActivity = async (
  leadId: string,
  payload: {
    type: "NOTE" | "CALL" | "EMAIL" | "TAG_UPDATE" | "STATUS_CHANGE";
    details?: Record<string, unknown>;
  },
) => {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }
  return prisma.leadActivity.create({
    data: {
      leadId,
      type: payload.type,
      details: payload.details,
    },
  });
};
