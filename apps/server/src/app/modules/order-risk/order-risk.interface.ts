export interface OrderRiskIdentifiers {
  phone?: string;
  address?: string;
  ip: string;
  email?: string;
  orderValue?: number;
  userAgent?: string;
  deviceFingerprint?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  browserLanguage?: string;
  timezone?: string;
  sessionDuration?: number;
  referrer?: string;
}

export interface OrderRiskHistory {
  totalOrders: number;
  cancelledOrders: number;
  successfulOrders: number;
  refundedOrders: number;
  chargebackOrders: number;
  lastOrderDate?: Date;
  lastOrderStatus?: string;
  riskScore: number;
  identifiers: OrderRiskIdentifiers;
  orderIds: string[];
  firstOrderDate?: Date;
  orderTimestamps: Date[];
  failedPaymentAttempts: number;
  frequentAccountChanges: number;
  suspiciousActivities: SuspiciousActivity[];
  velocityPatterns: VelocityPattern[];
  geolocationHistory: GeolocationData[];
  paymentMethodHistory: PaymentMethodData[];
  deviceHistory: DeviceData[];
}

export interface SuspiciousActivity {
  type:
    | "RAPID_ORDERS"
    | "UNUSUAL_HOURS"
    | "MULTIPLE_ADDRESSES"
    | "PAYMENT_FAILURES"
    | "VELOCITY_ABUSE"
    | "ACCOUNT_TAKEOVER";
  timestamp: Date;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  metadata?: Record<string, any>;
}

export interface VelocityPattern {
  timeWindow: "1HOUR" | "24HOURS" | "7DAYS" | "30DAYS";
  orderCount: number;
  totalValue: number;
  avgOrderValue: number;
  lastUpdated: Date;
}

export interface GeolocationData {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  isVpn?: boolean;
  isProxy?: boolean;
  riskScore: number;
  firstSeen: Date;
  lastSeen: Date;
  orderCount: number;
}

export interface PaymentMethodData {
  type: string;
  lastFourDigits?: string;
  failureCount: number;
  successCount: number;
  firstUsed: Date;
  lastUsed: Date;
  isBlacklisted: boolean;
}

export interface DeviceData {
  fingerprint: string;
  userAgent: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
  firstSeen: Date;
  lastSeen: Date;
  orderCount: number;
  suspiciousScore: number;
}

export interface RiskAssessment {
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reasons: string[];
  history: OrderRiskHistory;
  riskFactors: RiskFactor[];
  recommendations: string[];
  confidence: number;
  modelVersion: string;
}

export interface RiskFactor {
  category:
    | "BEHAVIORAL"
    | "PAYMENT"
    | "SHIPPING"
    | "DEVICE"
    | "VELOCITY"
    | "HISTORICAL";
  factor: string;
  impact: number;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}
