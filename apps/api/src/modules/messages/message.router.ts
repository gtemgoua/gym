import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import {
  announcementSchema,
  messageTemplateCreateSchema,
  messageTemplateUpdateSchema,
} from "./message.schema.js";
import { createTemplate, listTemplates, sendAnnouncement, updateTemplate } from "./message.service.js";

const router = Router();

router.use(authenticate());
router.use(requireRoles(["OWNER", "MANAGER", "STAFF"]));

router.get("/templates", async (_req, res) => {
  const templates = await listTemplates();
  res.json(templates);
});

router.post("/templates", async (req, res) => {
  const payload = messageTemplateCreateSchema.parse(req.body);
  const template = await createTemplate(payload);
  res.status(201).json(template);
});

router.patch("/templates/:id", async (req, res) => {
  const payload = messageTemplateUpdateSchema.parse(req.body);
  const template = await updateTemplate(req.params.id, payload);
  res.json(template);
});

router.post("/announcements", async (req, res) => {
  const payload = announcementSchema.parse(req.body);
  const result = await sendAnnouncement(payload);
  res.json(result);
});

export default router;
