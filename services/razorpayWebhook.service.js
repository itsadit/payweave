import crypto from "crypto";
import Order from "../models/order.js";

const razorpayWebhookService = async (req) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    const error = new Error("Invalid signature");
    error.statusCode = 400;
    throw error;
  }
  const event = JSON.parse(req.body.toString());
  if (!["payment.captured", "payment.failed"].includes(event.event)) {
    return;
  }

  const paymentEntity = event?.payload?.payment?.entity;
  if (!paymentEntity) return;
  const providerOrderId = paymentEntity.order_id;

  const order = await Order.findOne({ providerOrderId });
  if (!order) return;

  if (["payment_success", "payment_failed"].includes(order.status)) return;
  
  if (event.event === "payment.captured") {
    order.status = "payment_success";
    order.providerPaymentId = paymentEntity.id;
  }
  if (event.event === "payment.failed") {
    order.status = "payment_failed";
    order.failureReason = paymentEntity.error_description || "Payment failed";
  }
  await order.save();
};

export default razorpayWebhookService;
