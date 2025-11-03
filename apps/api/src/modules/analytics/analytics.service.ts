import { DateTime } from "luxon";
import prisma from "../../lib/prisma.js";

export const getTodaySummary = async () => {
  const start = DateTime.now().startOf("day").toJSDate();
  const end = DateTime.now().endOf("day").toJSDate();

  const [newSignups, failedPayments, upcomingClasses, todaysAttendance] = await Promise.all([
    prisma.user.count({
      where: {
        role: "MEMBER",
        createdAt: { gte: start, lte: end },
      },
    }),
    prisma.invoice.count({
      where: { status: "OPEN", dueAt: { gte: start, lte: end } },
    }),
    prisma.classEvent.findMany({
      where: { startAt: { gte: start, lte: end } },
      include: { bookings: true },
      orderBy: { startAt: "asc" },
    }),
    prisma.attendance.count({
      where: { checkinAt: { gte: start, lte: end } },
    }),
  ]);

  const occupancy =
    upcomingClasses.length === 0
      ? 0
      : Math.round(
          (upcomingClasses.reduce((acc, event) => acc + event.bookings.length, 0) /
            upcomingClasses.reduce((acc, event) => acc + event.capacity, 0)) *
            100,
        );

  return {
    newSignups,
    failedPayments,
    upcomingClasses: upcomingClasses.slice(0, 5),
    occupancy,
    attendanceCount: todaysAttendance,
  };
};

export const getKpiMetrics = async () => {
  const [activeSubscriptions, churnedSubscriptions, totalMembers, invoices] = await Promise.all([
    prisma.subscription.findMany({
      where: { status: { in: ["ACTIVE", "TRIALING"] } },
      include: { plan: true },
    }),
    prisma.subscription.count({
      where: {
        status: "CANCELED",
        canceledAt: {
          gte: DateTime.now().minus({ months: 1 }).toJSDate(),
        },
      },
    }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.invoice.findMany({
      where: {
        status: "PAID",
        paidAt: { gte: DateTime.now().minus({ months: 6 }).toJSDate() },
      },
    }),
  ]);

  const mrr = activeSubscriptions.reduce((acc, sub) => {
    const planPrice = Number(sub.plan?.price ?? 0);
    switch (sub.plan?.billingPeriod) {
      case "ANNUAL":
        return acc + planPrice / 12;
      case "QUARTERLY":
        return acc + planPrice / 3;
      case "MONTHLY":
        return acc + planPrice;
      case "WEEKLY":
        return acc + planPrice * 4;
      default:
        return acc;
    }
  }, 0);

  const churnRate =
    activeSubscriptions.length === 0 ? 0 : (churnedSubscriptions / activeSubscriptions.length) * 100;

  const arpu =
    invoices.length === 0 ? 0 : invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0) / totalMembers || 0;

  const averageLifespanMonths = activeSubscriptions.length === 0 ? 0 : 18; // placeholder assumption
  const ltv = arpu * averageLifespanMonths;

  return {
    mrr: Number(mrr.toFixed(2)),
    churnRate: Number(churnRate.toFixed(2)),
    ltv: Number(ltv.toFixed(2)),
    totalMembers,
    activeSubscriptions: activeSubscriptions.length,
  };
};

export const classFillRate = async (params: { from?: string; to?: string }) => {
  const events = await prisma.classEvent.findMany({
    where: {
      startAt: {
        gte: params.from ? new Date(params.from) : undefined,
        lte: params.to ? new Date(params.to) : undefined,
      },
    },
    include: { bookings: true },
  });

  if (events.length === 0) {
    return 0;
  }

  const fillRate =
    events.reduce((acc, event) => acc + event.bookings.filter((b) => b.status === "BOOKED").length, 0) /
    events.reduce((acc, event) => acc + event.capacity, 0);

  return Number((fillRate * 100).toFixed(2));
};

export const attendanceCohorts = async () => {
  const records = await prisma.attendance.findMany({
    include: { member: true },
    orderBy: { checkinAt: "asc" },
  });

  const map = new Map<string, number>();
  records.forEach((record) => {
    const week = DateTime.fromJSDate(record.checkinAt).startOf("week").toISODate();
    map.set(week!, (map.get(week!) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([week, count]) => ({ week, count }));
};
