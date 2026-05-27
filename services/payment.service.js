import Razorpay from "razorpay";
import Order from "../models/order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (order) => {
  const razorpayOrder = await razorpay.orders.create({
    amount: order.amount * 100,
    currency: order.currency,
    receipt: order._id.toString(),
  });
  order.provider = "razorpay";
  order.providerOrderId = razorpayOrder.id;
  // INVARIANT: once provider order creation succeeds, the internal payment state moves to payment_pending.
  order.status = "payment_pending";
  await order.save();

  return {
    provider: "razorpay",
    providerOrderId: razorpayOrder.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  };
};

const createProviderOrder = async (order) => {
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  // INVARIANT: payment initiation is only allowed from pending orders.
  // The frontend must never directly set payment status.
  if (order.status !== "pending") {
    const error = new Error("payment already initiated or completed");
    error.statusCode = 400;
    throw error;
  }
  return await createRazorpayOrder(order);
};

const retryPayment = async (order) => {
  if (!order) {
    const error = new Error("Order is missing");
    error.statusCode = 400;
    throw error;
  }
  // INVARIANT: retry is allowed only from payment_failed.
  if (order.status !== "payment_failed") {
    const error = new Error("Retry not allowed");
    error.statusCode = 400;
    throw error;
  }

  order.providerOrderId = null;
  order.providerPaymentId = null;
  order.failureReason = null;

  return await createRazorpayOrder(order);
};

export default { createProviderOrder, retryPayment };
