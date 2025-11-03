import { DateTime } from "luxon";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export const evaluateEligibility = async (memberId: string): Promise<EligibilityResult> => {
  const member = await prisma.user.findUnique({
    where: { id: memberId },
    include: {
      memberProfile: true,
      subscriptions: true,
    },
  });

  if (!member || member.role !== "MEMBER") {
    return { eligible: false, reasons: ["Member not found"] };
  }

  const reasons: string[] = [];

  switch (member.memberProfile?.status) {
    case "ACTIVE":
    case "TRIAL":
      break;
    case "FROZEN":
      reasons.push("Membership frozen");
      break;
    case "DELINQUENT":
      reasons.push("Account delinquent");
      break;
    case "CANCELED":
      reasons.push("Membership canceled");
      break;
    default:
      reasons.push("Membership status unknown");
  }

  const hasActiveSub = member.subscriptions.some((sub) => {
    if (sub.status !== "ACTIVE" && sub.status !== "TRIALING") {
      return false;
    }
    if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) {
      return false;
    }
    return true;
  });

  if (!hasActiveSub) {
    reasons.push("No active subscription");
  }

  return { eligible: reasons.length === 0, reasons };
};

export const checkInMember = async (payload: {
  memberId: string;
  classEventId?: string;
  method: "KIOSK" | "STAFF" | "API";
  staffId?: string;
}) => {
  const eligibility = await evaluateEligibility(payload.memberId);
  if (!eligibility.eligible) {
    throw new AppError("Member not eligible", 400, { details: eligibility.reasons });
  }

  const existing = await prisma.attendance.findFirst({
    where: {
      memberId: payload.memberId,
      classEventId: payload.classEventId,
      checkinAt: {
        gte: DateTime.now().minus({ hours: 4 }).toJSDate(),
      },
    },
  });

  if (existing) {
    return existing;
  }

  const attendance = await prisma.attendance.create({
    data: {
      memberId: payload.memberId,
      classEventId: payload.classEventId ?? undefined,
      method: payload.method,
      staffId: payload.staffId,
      status: "PRESENT",
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "attendance.checkin",
      target: `member:${payload.memberId}`,
      metadata: { attendanceId: attendance.id, method: payload.method },
    },
  });

  return attendance;
};

export const listAttendance = async (params: {
  from?: string;
  to?: string;
  classEventId?: string;
  memberId?: string;
}) => {
  const where: any = {};
  if (params.from || params.to) {
    where.checkinAt = {};
    if (params.from) {
      where.checkinAt.gte = new Date(params.from);
    }
    if (params.to) {
      where.checkinAt.lte = new Date(params.to);
    }
  }
  if (params.classEventId) {
    where.classEventId = params.classEventId;
  }
  if (params.memberId) {
    where.memberId = params.memberId;
  }

  return prisma.attendance.findMany({
    where,
    include: { member: true, classEvent: true },
    orderBy: { checkinAt: "desc" },
  });
};

export const attendanceHeatmap = async (params: { from?: string; to?: string }) => {
  const records = await listAttendance(params);
  const buckets: Record<string, number> = {};
  records.forEach((attendance) => {
    const hourKey = DateTime.fromJSDate(attendance.checkinAt).toFormat("EEE HH:00");
    buckets[hourKey] = (buckets[hourKey] ?? 0) + 1;
  });
  return buckets;
};
