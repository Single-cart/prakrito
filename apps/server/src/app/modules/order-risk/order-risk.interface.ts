export interface OrderRiskIdentifiers {
  phone?: string;
  address?: string;
  ip: string;
  email?: string;
}

export interface OrderRiskHistory {
  totalOrders: number;
  cancelledOrders: number;
  successfulOrders: number;
  lastOrderDate?: Date;
  lastOrderStatus?: string;
  riskScore: number; // 0-100, higher means more risky
  identifiers: OrderRiskIdentifiers;
  orderIds: string[]; // List of all orders by this user/identifier
}

export interface RiskAssessment {
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  history: OrderRiskHistory;
}
