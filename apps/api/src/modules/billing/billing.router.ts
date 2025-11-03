import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { invoiceCreateSchema, invoicePaymentSchema } from "./billing.schema.js";
import { createInvoice, exportInvoicesCsv, listInvoices, markInvoicePaid } from "./billing.service.js";

const router = Router();

router.use(authenticate());
router.use(requireRoles(["OWNER", "MANAGER"]));

router.get("/invoices", async (req, res) => {
  const invoices = await listInvoices({
    status: typeof req.query.status === "string" ? req.query.status : undefined,
    memberId: typeof req.query.memberId === "string" ? req.query.memberId : undefined,
  });
  res.json(invoices);
});

router.post("/invoices", async (req, res) => {
  const payload = invoiceCreateSchema.parse(req.body);
  const invoice = await createInvoice(payload);
  res.status(201).json(invoice);
});

router.post("/invoices/:id/pay", async (req, res) => {
  const payload = invoicePaymentSchema.parse(req.body);
  const invoice = await markInvoicePaid(req.params.id, payload);
  res.json(invoice);
});

router.get("/invoices/export", async (req, res) => {
  const csv = await exportInvoicesCsv({
    from: typeof req.query.from === "string" ? req.query.from : undefined,
    to: typeof req.query.to === "string" ? req.query.to : undefined,
  });
  res.setHeader("Content-Type", "text/csv");
  res.attachment("invoices.csv");
  res.send(csv);
});

export default router;
