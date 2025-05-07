export interface OrderSummary {
  totalPandingOrder: number;
  totalDeliveredOrder: number;
  totalCancelledOrder: number;
  totalShippedOrder: number;
  totalProcessingOrder: number;
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";
export type PaymentType = "COD" | "Card" | "Mobile Banking";

export interface OrderItem {
  productName: string;
  product: string;
  quantity: number;
  price: number;
  priceVariationIndex: number;
  _id: string;
}

export interface ShippingInfo {
  phone: string;
  fullName: string;
  address: string;
}

export interface OrderData {
  phone: string;
  fullName: string;
  address: string;
  orderNots: string;
  paymentType: string;
  itemsPrice: number;
  shippingPrice: number;
  orderItems: OrderItem[];
  totalAmount: number;
  user?: string;
}

export interface OrderSummary {
  totalPandingOrder: number;
  totalDeliveredOrder: number;
  totalCancelledOrder: number;
  totalShippedOrder: number;
  totalProcessingOrder: number;
}

export interface MonthlySales {
  name: string;
  total: number;
}

export interface DailyStats {
  _id: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
}

export interface StatusDistribution {
  _id: OrderStatus;
  count: number;
  revenue: number;
}

export interface PopularProduct {
  _id: string;
  totalOrders: number;
  revenue: number;
  averageOrderSize: number;
}

export interface PaymentStats {
  _id: PaymentType;
  count: number;
  totalAmount: number;
  averageAmount: number;
}

export interface ProcessingTimeStats {
  _id: OrderStatus;
  avgProcessingTime: number;
  minProcessingTime: number;
  maxProcessingTime: number;
  standardDeviation: number;
}

export interface HourlyDistribution {
  _id: number;
  orderCount: number;
  revenue: number;
  avgOrderValue: number;
}
export interface MonthlySales {
  name: string;
  total: number;
}
