import { Schema, model } from "mongoose";
import { OrderRiskHistory } from "./order-risk.interface";

const orderRiskHistorySchema = new Schema<OrderRiskHistory>(
  {
    totalOrders: { type: Number, required: true, default: 0 },
    cancelledOrders: { type: Number, required: true, default: 0 },
    successfulOrders: { type: Number, required: true, default: 0 },
    lastOrderDate: { type: Date },
    lastOrderStatus: { type: String },
    riskScore: { type: Number, required: true, default: 0 },
    identifiers: {
      phone: { type: String, required: true, index: true },
      address: { type: String, required: true },
      ip: { type: String, required: true, index: true },
      email: { type: String },
    },
    orderIds: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better search performance
orderRiskHistorySchema.index({ "identifiers.phone": 1, "identifiers.ip": 1 });
orderRiskHistorySchema.index({
  "identifiers.phone": 1,
  "identifiers.address": 1,
});

export const OrderRiskHistoryModel = model<OrderRiskHistory>(
  "OrderRiskHistory",
  orderRiskHistorySchema
);
