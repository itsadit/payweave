import express from "express";
import order from "../controllers/order.controller";

const router = express.Router();

router.post("/", order.create);
router.get("/:id", order.getStatus);

export default router;
