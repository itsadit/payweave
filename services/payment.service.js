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

const createProviderOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  if (order.status !== "pending") {
    const error = new Error("payment already initiated or completed ");
    error.statusCode = 404;
    throw error;
  }
  return await createRazorpayOrder(order);
};

const retryPayment = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order is missing");
    error.statusCode = 400;
    throw error;
  }
  if (["payment_pending", "payment_success"].includes(order.status)) {
    const error = new Error("Retry not allowed");
    error.statusCode = 400;
    throw error;
  }

  order.providerOrderId = null;
  order.providerPaymentId = null;
  order.failureReason = null;

  return await createRazorpayOrder(orderId);
};

export default { createProviderOrder, retryPayment };
