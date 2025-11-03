import { Router } from "express";
import { MemberStatus } from "@prisma/client";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { memberFilterSchema, memberCreateSchema, memberUpdateSchema, statusUpdateSchema } from "./member.schema.js";
import { createMember, getMember, listMembers, updateMember, updateMemberStatus } from "./member.service.js";

const router = Router();

router.use(authenticate());
router.use(requireRoles(["OWNER", "MANAGER", "STAFF"]));

router.get("/", async (req, res) => {
  const query = memberFilterSchema.parse({
    ...req.query,
    status: req.query.status ? String(req.query.status).split(",") : undefined,
  });
  const statuses = query.status?.map((value) => value as MemberStatus);
  const result = await listMembers({
    ...query,
    status: statuses,
  });
  res.json(result);
});

router.post("/", async (req, res) => {
  const payload = memberCreateSchema.parse(req.body);
  const result = await createMember(payload);
  res.status(201).json(result);
});

router.get("/:id", async (req, res) => {
  const member = await getMember(req.params.id);
  res.json(member);
});

router.patch("/:id", async (req, res) => {
  const payload = memberUpdateSchema.parse(req.body);
  const member = await updateMember(req.params.id, payload);
  res.json(member);
});

router.post("/:id/status", async (req, res) => {
  const payload = statusUpdateSchema.parse(req.body);
  await updateMemberStatus(req.params.id, payload.status);
  res.json({ ok: true });
});

export default router;
