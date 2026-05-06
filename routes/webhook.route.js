import express from "express";
import webhook from "../controllers/webhook.controller.js";

const router = express.Router();

router.post(
  "/webhook/:provider",
  express.raw({ type: "application/json" }),
  webhookService.handleWebhook,
);

export default router;
