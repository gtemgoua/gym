import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listTemplates = () => prisma.messageTemplate.findMany({ orderBy: { key: "asc" } });

export const createTemplate = (payload: {
  key: string;
  channel: "EMAIL" | "SMS";
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
}) =>
  prisma.messageTemplate.create({
    data: payload,
  });

export const updateTemplate = async (
  id: string,
  payload: { key?: string; channel?: "EMAIL" | "SMS"; subject?: string; body?: string; metadata?: Record<string, unknown> },
) => {
  const template = await prisma.messageTemplate.findUnique({ where: { id } });
  if (!template) {
    throw new AppError("Template not found", 404);
  }
  return prisma.messageTemplate.update({
    where: { id },
    data: payload,
  });
};

export const sendAnnouncement = async (payload: {
  subject: string;
  body: string;
  target: "ALL_MEMBERS" | "ACTIVE_ONLY" | "TRIAL";
}) => {
  const members = await prisma.memberProfile.findMany({
    where:
      payload.target === "ALL_MEMBERS"
        ? {}
        : payload.target === "ACTIVE_ONLY"
        ? { status: "ACTIVE" }
        : { status: "TRIAL" },
    include: { user: true },
  });

  const messages = members
    .filter((member) => member.user.email)
    .map((member) =>
      prisma.messageLog.create({
        data: {
          channel: "EMAIL",
          toAddress: member.user.email,
          status: "QUEUED",
          payload: {
            subject: payload.subject,
            body: payload.body,
            memberId: member.userId,
          },
        },
      }),
    );

  await Promise.all(messages);

  return { recipients: messages.length };
};
