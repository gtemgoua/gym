import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { attendanceCohorts, classFillRate, getKpiMetrics, getTodaySummary } from "./analytics.service.js";

const router = Router();

router.use(authenticate());
router.use(requireRoles(["OWNER", "MANAGER"]));

router.get("/dashboard/today", async (_req, res, next) => {
  try {
    const data = await getTodaySummary();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/metrics", async (_req, res, next) => {
  try {
    const data = await getKpiMetrics();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/reports/class-fill", async (req, res) => {
  const fillRate = await classFillRate({
    from: typeof req.query.from === "string" ? req.query.from : undefined,
    to: typeof req.query.to === "string" ? req.query.to : undefined,
  });
  res.json({ fillRate });
});

router.get("/reports/attendance-cohorts", async (_req, res) => {
  const cohorts = await attendanceCohorts();
  res.json({ cohorts });
});

export default router;
