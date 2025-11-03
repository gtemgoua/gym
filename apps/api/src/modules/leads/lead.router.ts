import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { leadActivitySchema, leadCreateSchema, leadUpdateSchema } from "./lead.schema.js";
import { addLeadActivity, createLead, listLeads, updateLead } from "./lead.service.js";

const router = Router();

router.post("/", async (req, res) => {
  const payload = leadCreateSchema.parse(req.body);
  const lead = await createLead(payload);
  res.status(201).json(lead);
});

router.use(authenticate());

router.get("/", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (req, res) => {
  const leads = await listLeads({
    stage: typeof req.query.stage === "string" ? req.query.stage : undefined,
  });
  res.json(leads);
});

router.patch("/:id", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (req, res) => {
  const payload = leadUpdateSchema.parse(req.body);
  const lead = await updateLead(req.params.id, payload);
  res.json(lead);
});

router.post("/:id/activities", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (req, res) => {
  const payload = leadActivitySchema.parse(req.body);
  const activity = await addLeadActivity(req.params.id, payload);
  res.status(201).json(activity);
});

export default router;
