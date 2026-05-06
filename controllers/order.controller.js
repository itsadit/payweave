import orderService from "../services/order.service";

const create = async (req, res, next) => {
  const { userId, amount, currency, idempotencyKey, paymentProvider } =
    req.body;
  try {
    if (
      !userId ||
      amount <= 0 ||
      !currency ||
      !idempotencyKey ||
      !paymentProvider
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const order = await orderService.createOrder({
      userId,
      amount,
      currency,
      idempotencyKey,
      paymentProvider,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }
    const status = await orderService.getOrderStatus(orderId);
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  getStatus,
};
