import { Schema, model } from "mongoose";
import {
  OrderRiskHistory,
  SuspiciousActivity,
  VelocityPattern,
  GeolocationData,
  PaymentMethodData,
  DeviceData,
} from "./order-risk.interface";

const suspiciousActivitySchema = new Schema<SuspiciousActivity>({
  type: {
    type: String,
    enum: [
      "RAPID_ORDERS",
      "UNUSUAL_HOURS",
      "MULTIPLE_ADDRESSES",
      "PAYMENT_FAILURES",
      "VELOCITY_ABUSE",
      "ACCOUNT_TAKEOVER",
    ],
    required: true,
  },
  timestamp: { type: Date, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
  metadata: { type: Schema.Types.Mixed },
});

const velocityPatternSchema = new Schema<VelocityPattern>({
  timeWindow: {
    type: String,
    enum: ["1HOUR", "24HOURS", "7DAYS", "30DAYS"],
    required: true,
  },
  orderCount: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  avgOrderValue: { type: Number, required: true },
  lastUpdated: { type: Date, required: true },
});

const geolocationDataSchema = new Schema<GeolocationData>({
  ip: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  region: { type: String },
  isVpn: { type: Boolean, default: false },
  isProxy: { type: Boolean, default: false },
  riskScore: { type: Number, required: true, default: 0 },
  firstSeen: { type: Date, required: true },
  lastSeen: { type: Date, required: true },
  orderCount: { type: Number, required: true, default: 0 },
});

const paymentMethodDataSchema = new Schema<PaymentMethodData>({
  type: { type: String, required: true },
  lastFourDigits: { type: String },
  failureCount: { type: Number, required: true, default: 0 },
  successCount: { type: Number, required: true, default: 0 },
  firstUsed: { type: Date, required: true },
  lastUsed: { type: Date, required: true },
  isBlacklisted: { type: Boolean, default: false },
});

const deviceDataSchema = new Schema<DeviceData>({
  fingerprint: { type: String, required: true },
  userAgent: { type: String, required: true },
  screenResolution: { type: String },
  language: { type: String },
  timezone: { type: String },
  firstSeen: { type: Date, required: true },
  lastSeen: { type: Date, required: true },
  orderCount: { type: Number, required: true, default: 0 },
  suspiciousScore: { type: Number, required: true, default: 0 },
});

const orderRiskHistorySchema = new Schema<OrderRiskHistory>(
  {
    totalOrders: { type: Number, required: true, default: 0 },
    cancelledOrders: { type: Number, required: true, default: 0 },
    successfulOrders: { type: Number, required: true, default: 0 },
    refundedOrders: { type: Number, required: true, default: 0 },
    chargebackOrders: { type: Number, required: true, default: 0 },
    lastOrderDate: { type: Date },
    lastOrderStatus: { type: String },
    riskScore: { type: Number, required: true, default: 0 },
    identifiers: {
      phone: { type: String, index: true },
      address: { type: String },
      ip: { type: String, required: true, index: true },
      email: { type: String },
      userAgent: { type: String },
      deviceFingerprint: { type: String },
      paymentMethod: { type: String },
      shippingMethod: { type: String },
      browserLanguage: { type: String },
      timezone: { type: String },
      sessionDuration: { type: Number },
      referrer: { type: String },
    },
    orderIds: [{ type: String }],
    firstOrderDate: { type: Date },
    orderTimestamps: [{ type: Date }],
    failedPaymentAttempts: { type: Number, required: true, default: 0 },
    frequentAccountChanges: { type: Number, required: true, default: 0 },
    suspiciousActivities: [suspiciousActivitySchema],
    velocityPatterns: [velocityPatternSchema],
    geolocationHistory: [geolocationDataSchema],
    paymentMethodHistory: [paymentMethodDataSchema],
    deviceHistory: [deviceDataSchema],
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
orderRiskHistorySchema.index({ "identifiers.deviceFingerprint": 1 });
orderRiskHistorySchema.index({ "identifiers.email": 1 });
orderRiskHistorySchema.index({ "suspiciousActivities.type": 1 });
orderRiskHistorySchema.index({ "velocityPatterns.timeWindow": 1 });
orderRiskHistorySchema.index({ "geolocationHistory.ip": 1 });
orderRiskHistorySchema.index({ "paymentMethodHistory.type": 1 });
orderRiskHistorySchema.index({ "deviceHistory.fingerprint": 1 });
orderRiskHistorySchema.index({ riskScore: -1 });

export const OrderRiskHistoryModel = model<OrderRiskHistory>(
  "OrderRiskHistory",
  orderRiskHistorySchema
);
