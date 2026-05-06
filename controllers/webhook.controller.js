import razorpayWebhookService from "../services/razorpayWebhook.service.js";

const handleWebhook = async (req, res, next) => {
  try {
    const { provider } = req.params;
    if (provider === "razorpay") {
      await razorpayWebhookService(req);
    } else if (provider === "stripe") {
      await stripeWebhookService(req);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unknown provider",
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export default {
  handleWebhook,
};
