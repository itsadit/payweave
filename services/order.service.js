import Order from "../models/order";

const createOrder = async (data) => {
  const { userId, amount, currency, idempotencyKey, paymentProvider } = data;
  const existingOrder = await Order.findOne({ idempotencyKey });
  if (existingOrder) return existingOrder;

  const order = new Order({
    userId,
    amount,
    currency,
    idempotencyKey,
    paymentProvider,
    status: "pending",
  });
  await order.save();
  return order;
};

const getOrderStatus = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    orderId: order._id,
    status: order.status,
    failureReason: order.failureReason || null,
  };
};

export default {
  createOrder,
  getOrderStatus,
};
