import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { AppError } from "../../errors/app-error.js";
import { bookingCreateSchema, bookingUpdateSchema } from "./booking.schema.js";
import { createBooking, listBookings, promoteWaitlist, updateBookingStatus } from "./booking.service.js";

const router = Router();

router.use(authenticate());

router.get("/", async (req, res) => {
  const memberId = typeof req.query.memberId === "string" ? req.query.memberId : undefined;
  const classEventId = typeof req.query.classEventId === "string" ? req.query.classEventId : undefined;

  if (req.authUser?.role === "MEMBER" && memberId && memberId !== req.authUser.id) {
    throw new AppError("Cannot view other member bookings", 403);
  }

  const effectiveMemberId =
    req.authUser?.role === "MEMBER" ? memberId ?? req.authUser.id : memberId ?? undefined;

  const bookings = await listBookings({ memberId: effectiveMemberId, classEventId });
  res.json(bookings);
});

router.post("/", async (req, res) => {
  const payload = bookingCreateSchema.parse(req.body);
  if (req.authUser?.role === "MEMBER" && payload.memberId !== req.authUser.id) {
    throw new AppError("Cannot create booking for another member", 403);
  }
  const booking = await createBooking(payload);
  res.status(201).json(booking);
});

router.patch("/:id", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (req, res) => {
  const payload = bookingUpdateSchema.parse(req.body);
  const booking = await updateBookingStatus(req.params.id, payload);
  res.json(booking);
});

router.post("/:id/cancel", async (req, res) => {
  const booking = await updateBookingStatus(req.params.id, { status: "CANCELED" });
  res.json(booking);
});

router.post("/events/:classEventId/promote", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (req, res) => {
  await promoteWaitlist(req.params.classEventId);
  res.json({ ok: true });
});

export default router;
