import { Router } from "express";
import Stripe from "stripe";
import env from "../../config/env.js";
import logger from "../../config/logger.js";

const router = Router();

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

router.post("/stripe", async (req, res) => {
  // In production mount a raw body parser for Stripe signature verification.
  const event = req.body as Stripe.Event;
  logger.info({ type: event.type }, "Stripe webhook received");

  switch (event.type) {
    case "invoice.paid":
    case "invoice.payment_failed":
    case "customer.subscription.updated":
      // TODO: enqueue job for billing processor
      break;
    default:
      logger.debug({ type: event.type }, "Unhandled Stripe event");
  }

  res.json({ received: true });
});

export default router;
