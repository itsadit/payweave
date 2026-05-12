import Order from "../models/order";
import paymentService from "../services/payment.service";

const initiate = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.status === "payment_success") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    if (order.status === "payment_pending") {
      return res.status(400).json({
        success: false,
        message: "Payment already in progress",
      });
    }

    const paymentData = await paymentService.createProviderOrder(order);
    return res.status(200).json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    next(error);
  }
};

const retry = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.status !== "payment_failed") {
      return res.status(400).json({
        success: false,
        message: "Retry is only allowed after payment_failed",
      });
    }

    const paymentData = await paymentService.retryPayment(order);
    return res.status(200).json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  initiate,
  retry,
};
