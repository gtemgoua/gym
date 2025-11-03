import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { createPlan, getPlan, listPlans, updatePlan } from "./plan.service.js";
import { planCreateSchema, planUpdateSchema } from "./plan.schema.js";

const router = Router();

router.get("/", authenticate({ allowAnonymous: true }), async (_req, res) => {
  const plans = await listPlans();
  res.json(plans);
});

router.get("/:id", authenticate({ allowAnonymous: true }), async (req, res) => {
  const plan = await getPlan(req.params.id);
  res.json(plan);
});

router.post("/", authenticate(), requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = planCreateSchema.parse(req.body);
  const plan = await createPlan(payload);
  res.status(201).json(plan);
});

router.patch("/:id", authenticate(), requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = planUpdateSchema.parse(req.body);
  const plan = await updatePlan(req.params.id, payload);
  res.json(plan);
});

export default router;
