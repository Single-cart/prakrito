export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderSummary {
  totalPandingOrder: number;
  totalDeliveredOrder: number;
  totalCancelledOrder: number;
  totalShippedOrder: number;
  totalProcessingOrder: number;
}
