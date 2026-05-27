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
      enum: ["pending", "payment_pending", "payment_success", "payment_failed"],
      default: "pending",
      // INVARIANT: order.status is a strict payment state machine.
      // terminal values payment_success and payment_failed must not be overwritten once set.
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
    },
    failureReason: {
      type: String,
    },
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);
export default Order;
