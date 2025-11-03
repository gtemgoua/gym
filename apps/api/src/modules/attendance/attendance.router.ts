import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { checkinSchema, attendanceQuerySchema } from "./attendance.schema.js";
import { attendanceHeatmap, checkInMember, listAttendance } from "./attendance.service.js";
import { AppError } from "../../errors/app-error.js";

const router = Router();

router.use(authenticate());

router.get("/", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (req, res) => {
  const query = attendanceQuerySchema.parse(req.query);
  const records = await listAttendance(query);
  res.json(records);
});

router.post("/checkin", async (req, res) => {
  const payload = checkinSchema.parse(req.body);
  if (req.authUser?.role === "MEMBER" && payload.memberId !== req.authUser.id) {
    throw new AppError("Cannot check in another member", 403);
  }
  const attendance = await checkInMember({
    memberId: payload.memberId,
    classEventId: payload.classEventId,
    method: payload.method,
    staffId: req.authUser?.role !== "MEMBER" ? req.authUser?.id : undefined,
  });
  res.json(attendance);
});

router.get("/heatmap", requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const query = attendanceQuerySchema.parse(req.query);
  const heatmap = await attendanceHeatmap(query);
  res.json(heatmap);
});

export default router;
