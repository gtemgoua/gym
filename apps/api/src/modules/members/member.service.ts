import type { Prisma, MemberStatus } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";
import { hashPassword } from "../../lib/password.js";
import { randomString } from "../../lib/random.js";

export const listMembers = async (params: {
  status?: MemberStatus[];
  q?: string;
  take: number;
  skip: number;
}) => {
  const where: Prisma.UserWhereInput = {
    role: "MEMBER",
  };

  if (params.status?.length) {
    where.memberProfile = {
      status: { in: params.status },
    };
  }

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { memberProfile: true, subscriptions: true },
      orderBy: { createdAt: "desc" },
      take: params.take,
      skip: params.skip,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
};

export const createMember = async (payload: {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  birthdate?: string;
  waiverSignedAt?: string;
  emergencyContact?: Record<string, unknown>;
  status: MemberStatus;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const tempPassword = randomString(16);
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      passwordHash,
      role: "MEMBER",
      memberProfile: {
        create: {
          notes: payload.notes,
          birthdate: payload.birthdate ? new Date(payload.birthdate) : undefined,
          waiverSignedAt: payload.waiverSignedAt ? new Date(payload.waiverSignedAt) : undefined,
          emergencyContact: payload.emergencyContact,
          status: payload.status,
        },
      },
    },
    include: { memberProfile: true },
  });

  return { user, tempPassword };
};

export const getMember = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      memberProfile: true,
      subscriptions: { include: { plan: true } },
      bookings: { include: { classEvent: true } },
    },
  });
  if (!user || user.role !== "MEMBER") {
    throw new AppError("Member not found", 404);
  }
  return user;
};

export const updateMember = async (
  id: string,
  payload: {
    name?: string;
    phone?: string;
    notes?: string;
    birthdate?: string;
    waiverSignedAt?: string;
    emergencyContact?: Record<string, unknown>;
    status?: MemberStatus;
  },
) => {
  const member = await prisma.user.findUnique({ where: { id } });
  if (!member || member.role !== "MEMBER") {
    throw new AppError("Member not found", 404);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: payload.name ?? undefined,
      phone: payload.phone ?? undefined,
      memberProfile: {
        update: {
          notes: payload.notes ?? undefined,
          birthdate: payload.birthdate ? new Date(payload.birthdate) : undefined,
          waiverSignedAt: payload.waiverSignedAt ? new Date(payload.waiverSignedAt) : undefined,
          emergencyContact: payload.emergencyContact,
          status: payload.status,
        },
      },
    },
    include: { memberProfile: true },
  });

  return updated;
};

export const updateMemberStatus = async (id: string, status: MemberStatus) => {
  const member = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  });
  if (!member || member.role !== "MEMBER") {
    throw new AppError("Member not found", 404);
  }

  return prisma.memberProfile.update({
    where: { userId: id },
    data: { status },
  });
};
