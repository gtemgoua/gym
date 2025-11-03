import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import {
  cancelSubscription,
  createSubscription,
  listSubscriptions,
  updateSubscription,
} from "./subscription.service.js";
import { subscriptionCreateSchema, subscriptionUpdateSchema } from "./subscription.schema.js";

const router = Router();

router.use(authenticate());

router.get("/", async (req, res) => {
  const subscriptions = await listSubscriptions({
    memberId: typeof req.query.memberId === "string" ? req.query.memberId : undefined,
  });
  res.json(subscriptions);
});

router.post("/", requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = subscriptionCreateSchema.parse(req.body);
  const subscription = await createSubscription(payload);
  res.status(201).json(subscription);
});

router.patch("/:id", requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = subscriptionUpdateSchema.parse(req.body);
  const subscription = await updateSubscription(req.params.id, payload);
  res.json(subscription);
});

router.post("/:id/cancel", requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const subscription = await cancelSubscription(req.params.id);
  res.json(subscription);
});

export default router;
