import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "INR",
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentProvider: {
      type: String,
    },
    providerOrderId: {
      type: String,
      index: true,
    },
    providerPaymentId: {
      type: String,
      status: {
        type: String,
        enum: [
          "created",
          "payment_success",
          "payment_pending",
          "payment_failed",
        ],
        default: "pending",
      },
    },
    failureReason: {
      type: String,
    },
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);
export default Order;
