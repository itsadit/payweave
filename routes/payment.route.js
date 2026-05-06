import express from "express";
import payment from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/:orderId/initiate", payment.initiate);
export default router;
