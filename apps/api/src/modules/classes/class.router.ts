import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import {
  createClassEvent,
  createTemplate,
  generateMemberICS,
  getClassEvent,
  listClassEvents,
  listTemplates,
  updateTemplate,
} from "./class.service.js";
import { eventCreateSchema, eventQuerySchema, templateCreateSchema, templateUpdateSchema } from "./class.schema.js";

const router = Router();

router.get("/", authenticate({ allowAnonymous: true }), async (req, res) => {
  const filters = eventQuerySchema.parse(req.query);
  const events = await listClassEvents(filters);
  res.json(events);
});

router.get("/events/:id", authenticate(), async (req, res) => {
  const event = await getClassEvent(req.params.id);
  res.json(event);
});

router.post("/events", authenticate(), requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = eventCreateSchema.parse(req.body);
  const event = await createClassEvent(payload);
  res.status(201).json(event);
});

router.get("/templates", authenticate(), async (_req, res) => {
  const templates = await listTemplates();
  res.json(templates);
});

router.post("/templates", authenticate(), requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = templateCreateSchema.parse(req.body);
  const template = await createTemplate(payload);
  res.status(201).json(template);
});

router.patch("/templates/:id", authenticate(), requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = templateUpdateSchema.parse(req.body);
  const template = await updateTemplate(req.params.id, payload);
  res.json(template);
});

router.get("/feed/member/:memberId.ics", authenticate(), async (req, res) => {
  const ics = await generateMemberICS(req.params.memberId);
  res.setHeader("Content-Type", "text/calendar");
  res.send(ics);
});

export default router;
