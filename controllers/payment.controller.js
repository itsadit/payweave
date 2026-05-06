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
    const paymentData = await paymentService.createProviderOrder(orderId);
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
};
