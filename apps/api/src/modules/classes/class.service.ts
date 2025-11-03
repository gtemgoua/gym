import { DateTime } from "luxon";
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export const listTemplates = () =>
  prisma.classTemplate.findMany({
    orderBy: { name: "asc" },
  });

export const createTemplate = (payload: {
  name: string;
  description?: string;
  defaultCoachId?: string;
  defaultCapacity?: number;
  defaultDuration?: number;
  creditCost: number;
  category?: string;
  color?: string;
  location?: string;
  room?: string;
  recurrenceRule?: string;
}) =>
  prisma.classTemplate.create({
    data: payload,
  });

export const updateTemplate = async (id: string, payload: Partial<Prisma.ClassTemplateUpdateInput>) => {
  const template = await prisma.classTemplate.findUnique({ where: { id } });
  if (!template) {
    throw new AppError("Template not found", 404);
  }
  return prisma.classTemplate.update({
    where: { id },
    data: payload,
  });
};

export const listClassEvents = async (params: {
  from?: string;
  to?: string;
  location?: string;
  coachId?: string;
  templateId?: string;
}) => {
  const where: Prisma.ClassEventWhereInput = {};
  if (params.from || params.to) {
    where.startAt = {};
    if (params.from) {
      where.startAt.gte = new Date(params.from);
    }
    if (params.to) {
      where.startAt.lte = new Date(params.to);
    }
  }
  if (params.location) {
    where.location = { equals: params.location, mode: "insensitive" };
  }
  if (params.coachId) {
    where.coachId = params.coachId;
  }
  if (params.templateId) {
    where.templateId = params.templateId;
  }

  return prisma.classEvent.findMany({
    where,
    include: { coach: true, template: true, bookings: true },
    orderBy: { startAt: "asc" },
  });
};

export const createClassEvent = async (payload: {
  templateId?: string;
  startAt: string;
  endAt?: string;
  coachId?: string;
  capacity: number;
  waitlistSize?: number;
  location: string;
  room?: string;
  status: string;
  notes?: string;
}) => {
  let data: Prisma.ClassEventCreateInput = {
    startAt: new Date(payload.startAt),
    endAt: payload.endAt ? new Date(payload.endAt) : new Date(Date.parse(payload.startAt) + 60 * 60 * 1000),
    coach: payload.coachId ? { connect: { id: payload.coachId } } : undefined,
    capacity: payload.capacity,
    waitlistSize: payload.waitlistSize ?? 0,
    location: payload.location,
    room: payload.room,
    status: payload.status as any,
    notes: payload.notes,
  };

  if (payload.templateId) {
    const template = await prisma.classTemplate.findUnique({ where: { id: payload.templateId } });
    if (!template) {
      throw new AppError("Template not found", 404);
    }
    data = {
      ...data,
      template: { connect: { id: template.id } },
      capacity: payload.capacity ?? template.defaultCapacity,
      endAt:
        payload.endAt ??
        DateTime.fromISO(payload.startAt)
          .plus({ minutes: template.defaultDuration ?? 60 })
          .toJSDate(),
    };
  }

  return prisma.classEvent.create({
    data,
    include: { template: true },
  });
};

export const getClassEvent = async (id: string) => {
  const event = await prisma.classEvent.findUnique({
    where: { id },
    include: {
      template: true,
      coach: true,
      bookings: {
        include: { member: true },
      },
    },
  });
  if (!event) {
    throw new AppError("Class not found", 404);
  }
  return event;
};

export const generateMemberICS = async (memberId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { memberId, status: "BOOKED" },
    include: { classEvent: true },
    orderBy: { classEvent: { startAt: "asc" } },
    take: 100,
  });

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GymStudio//Schedule//EN",
    "CALSCALE:GREGORIAN",
  ];

  bookings.forEach((booking) => {
    if (!booking.classEvent) return;
    const event = booking.classEvent;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${booking.id}@gymstudio`);
    lines.push(`DTSTAMP:${DateTime.now().toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`);
    lines.push(`DTSTART:${DateTime.fromJSDate(event.startAt).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`);
    lines.push(`DTEND:${DateTime.fromJSDate(event.endAt).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`);
    lines.push(`SUMMARY:${event.template?.name ?? "Class"}`);
    lines.push(`LOCATION:${event.location}${event.room ? " - " + event.room : ""}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};
