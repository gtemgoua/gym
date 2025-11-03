import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listAccessGrants = async () =>
  prisma.accessGrant.findMany({
    include: { member: { select: { user: { select: { id: true, name: true, email: true } } } } },
  });

export const upsertAccessGrant = async (payload: {
  memberId: string;
  status: "ALLOWED" | "BLOCKED";
  externalRef?: string;
}) => {
  const member = await prisma.memberProfile.findUnique({ where: { userId: payload.memberId } });
  if (!member) {
    throw new AppError("Member not found", 404);
  }

  const grant = await prisma.accessGrant.upsert({
    where: { memberId: payload.memberId },
    create: {
      memberId: payload.memberId,
      status: payload.status,
      externalRef: payload.externalRef,
    },
    update: {
      status: payload.status,
      externalRef: payload.externalRef,
      lastSyncAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "access.updated",
      target: `member:${payload.memberId}`,
      metadata: { status: payload.status },
    },
  });

  return grant;
};

export const allowedMembersList = async () => {
  const grants = await prisma.accessGrant.findMany({
    where: { status: "ALLOWED" },
    include: { member: { select: { userId: true } } },
  });
  return grants.map((grant) => ({
    memberId: grant.member.userId,
    externalRef: grant.externalRef,
  }));
};
