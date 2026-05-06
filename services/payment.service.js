import Razorpay from "razorpay";
import Order from "../models/order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createProviderOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  if (order.status !== "pending") {
    const error = new Error(
      "payment already initiated or completed for this order",
    );
    error.statusCode = 400;
    throw error;
  }
  if (order.providerOrderId) {
    return {
      provider: order.provider,
      providerOrderId: order.providerOrderId,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    };  
  }
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

export default { createProviderOrder };
