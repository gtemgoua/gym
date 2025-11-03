import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { accessUpdateSchema } from "./access.schema.js";
import { allowedMembersList, listAccessGrants, upsertAccessGrant } from "./access.service.js";
import { AppError } from "../../errors/app-error.js";

const router = Router();

router.use(authenticate());

router.get("/", requireRoles(["OWNER", "MANAGER", "STAFF"]), async (_req, res) => {
  const grants = await listAccessGrants();
  res.json(grants);
});

router.post("/", requireRoles(["OWNER", "MANAGER"]), async (req, res) => {
  const payload = accessUpdateSchema.parse(req.body);
  const grant = await upsertAccessGrant(payload);
  res.status(201).json(grant);
});

router.get("/allowed", async (req, res) => {
  if (req.authUser?.scope !== "door" && !["OWNER", "MANAGER"].includes(req.authUser?.role ?? "")) {
    throw new AppError("Forbidden", 403);
  }
  const allowed = await allowedMembersList();
  res.json({ members: allowed });
});

export default router;
