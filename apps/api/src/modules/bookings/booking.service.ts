import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listBookings = async (params: { classEventId?: string; memberId?: string }) =>
  prisma.booking.findMany({
    where: {
      classEventId: params.classEventId,
      memberId: params.memberId,
    },
    include: {
      classEvent: true,
      member: true,
    },
  });

export const createBooking = async (payload: { memberId: string; classEventId: string; source?: string }) => {
  const event = await prisma.classEvent.findUnique({
    where: { id: payload.classEventId },
    include: { bookings: true },
  });
  if (!event) {
    throw new AppError("Class not found", 404);
  }

  const member = await prisma.user.findUnique({ where: { id: payload.memberId }, include: { memberProfile: true } });
  if (!member || member.role !== "MEMBER") {
    throw new AppError("Member not found", 404);
  }

  if (member.memberProfile?.status !== "ACTIVE" && member.memberProfile?.status !== "TRIAL") {
    throw new AppError("Member is not eligible to book", 400);
  }

  const existing = await prisma.booking.findFirst({
    where: { memberId: payload.memberId, classEventId: payload.classEventId, status: { in: ["BOOKED", "WAITLISTED"] } },
  });
  if (existing) {
    throw new AppError("Member already booked", 409);
  }

  const confirmed = event.bookings.filter((b) => b.status === "BOOKED").length;
  const status = confirmed >= event.capacity ? "WAITLISTED" : "BOOKED";

  const booking = await prisma.booking.create({
    data: {
      classEventId: payload.classEventId,
      memberId: payload.memberId,
      status,
      source: payload.source,
    },
    include: { classEvent: true },
  });

  await prisma.auditLog.create({
    data: {
      action: "booking.created",
      target: `class:${payload.classEventId}`,
      metadata: { bookingId: booking.id, status },
      userId: payload.memberId,
    },
  });

  return booking;
};

export const updateBookingStatus = async (
  id: string,
  payload: { status: "BOOKED" | "WAITLISTED" | "CANCELED" | "NO_SHOW"; consumedCredit?: boolean },
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: payload.status,
      consumedCredit: payload.consumedCredit,
    },
  });

  if (payload.status === "CANCELED") {
    await promoteWaitlist(booking.classEventId);
  }

  return updated;
};

export const promoteWaitlist = async (classEventId: string) => {
  const event = await prisma.classEvent.findUnique({
    where: { id: classEventId },
    include: { bookings: { orderBy: { createdAt: "asc" }, include: { member: true } } },
  });
  if (!event) {
    return;
  }

  const confirmed = event.bookings.filter((b) => b.status === "BOOKED").length;
  if (confirmed >= event.capacity) {
    return;
  }

  const candidate = event.bookings.find((b) => b.status === "WAITLISTED");
  if (!candidate) {
    return;
  }

  await prisma.booking.update({
    where: { id: candidate.id },
    data: { status: "BOOKED" },
  });

  if (candidate.member?.email) {
    await prisma.messageLog.create({
      data: {
        channel: "EMAIL",
        toAddress: candidate.member.email,
        status: "QUEUED",
        payload: { type: "waitlist_promoted", bookingId: candidate.id },
      },
    });
  }
};
