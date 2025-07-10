import {
  OrderRiskHistory,
  OrderRiskIdentifiers,
  RiskAssessment,
} from "./order-risk.interface";
import { OrderRiskHistoryModel } from "./order-risk.model";

class OrderRiskService {
  private calculateRiskScore(history: OrderRiskHistory): number {
    if (history.totalOrders === 0) return 0;

    const cancellationRate =
      (history.cancelledOrders / history.totalOrders) * 100;
    let riskScore = 0;

    // Base risk on cancellation rate
    if (cancellationRate > 75) riskScore += 60;
    else if (cancellationRate > 50) riskScore += 40;
    else if (cancellationRate > 25) riskScore += 20;

    // Additional risk factors
    if (history.totalOrders > 5 && cancellationRate > 50) riskScore += 20;
    if (history.lastOrderStatus === "Cancelled") riskScore += 10;

    return Math.min(riskScore, 100); // Cap at 100
  }

  private getRiskLevel(riskScore: number): "LOW" | "MEDIUM" | "HIGH" {
    if (riskScore >= 70) return "HIGH";
    if (riskScore >= 40) return "MEDIUM";
    return "LOW";
  }

  private generateRiskReasons(history: OrderRiskHistory): string[] {
    const reasons: string[] = [];
    const cancellationRate =
      (history.cancelledOrders / history.totalOrders) * 100;

    if (cancellationRate > 0) {
      reasons.push(
        `Previous cancellation rate: ${cancellationRate.toFixed(1)}% (${
          history.cancelledOrders
        } out of ${history.totalOrders} orders)`
      );
    }

    if (history.lastOrderStatus === "Cancelled") {
      reasons.push("Last order was cancelled");
    }

    if (history.totalOrders > 5 && cancellationRate > 50) {
      reasons.push(
        "High volume of orders with significant cancellation history"
      );
    }

    return reasons;
  }

  async assessOrderRisk(
    identifiers: OrderRiskIdentifiers
  ): Promise<RiskAssessment> {
    // Validate required fields
    if (!identifiers.ip) {
      throw new Error("IP address is required for risk assessment");
    }

    // Find existing history or create new one
    const searchCriteria: Record<string, any>[] = [
      { "identifiers.ip": identifiers.ip },
    ];

    if (identifiers.phone) {
      searchCriteria.push({ "identifiers.phone": identifiers.phone });
    }

    if (identifiers.phone && identifiers.address) {
      searchCriteria.push({
        $and: [
          { "identifiers.phone": identifiers.phone },
          { "identifiers.address": identifiers.address },
        ],
      });
    }

    let history = await OrderRiskHistoryModel.findOne({
      $or: searchCriteria,
    });

    if (!history) {
      history = await OrderRiskHistoryModel.create({
        totalOrders: 0,
        cancelledOrders: 0,
        successfulOrders: 0,
        identifiers,
        orderIds: [],
        riskScore: 0,
      });
    }

    const riskScore = this.calculateRiskScore(history);
    const riskLevel = this.getRiskLevel(riskScore);
    const reasons = this.generateRiskReasons(history);

    return {
      riskScore,
      riskLevel,
      reasons,
      history,
    };
  }

  async updateOrderStatus(
    orderId: string,
    identifiers: OrderRiskIdentifiers,
    status: string
  ): Promise<void> {
    let history = await OrderRiskHistoryModel.findOne({
      $or: [
        { "identifiers.phone": identifiers.phone },
        { "identifiers.ip": identifiers.ip },
      ],
    });

    if (!history) {
      history = await OrderRiskHistoryModel.create({
        totalOrders: 1,
        cancelledOrders: status === "Cancelled" ? 1 : 0,
        successfulOrders: status === "Delivered" ? 1 : 0,
        lastOrderDate: new Date(),
        lastOrderStatus: status,
        identifiers,
        orderIds: [orderId],
        riskScore: 0,
      });
    } else {
      // Check if this order already exists in history
      const orderExists = history.orderIds.includes(orderId);

      if (!orderExists) {
        // New order - increment totals
        history.totalOrders += 1;
        history.orderIds.push(orderId);
      }

      // Update status counts (remove old status counts if order exists)
      if (orderExists) {
        // If updating existing order, we need to adjust counts
        // This is a simplified approach - in production you might want to store
        // individual order statuses to handle this more accurately
        if (status === "Cancelled") history.cancelledOrders += 1;
        if (status === "Delivered") history.successfulOrders += 1;
      } else {
        // New order
        if (status === "Cancelled") history.cancelledOrders += 1;
        if (status === "Delivered") history.successfulOrders += 1;
      }

      history.lastOrderDate = new Date();
      history.lastOrderStatus = status;
      history.riskScore = this.calculateRiskScore(history);
      await history.save();
    }
  }

  async updateExistingOrderStatus(
    orderId: string,
    identifiers: OrderRiskIdentifiers,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    let history = await OrderRiskHistoryModel.findOne({
      $or: [
        { "identifiers.phone": identifiers.phone },
        { "identifiers.ip": identifiers.ip },
      ],
    });

    if (history && history.orderIds.includes(orderId)) {
      // Remove old status count
      if (oldStatus === "Cancelled")
        history.cancelledOrders = Math.max(0, history.cancelledOrders - 1);
      if (oldStatus === "Delivered")
        history.successfulOrders = Math.max(0, history.successfulOrders - 1);

      // Add new status count
      if (newStatus === "Cancelled") history.cancelledOrders += 1;
      if (newStatus === "Delivered") history.successfulOrders += 1;

      history.lastOrderDate = new Date();
      history.lastOrderStatus = newStatus;
      history.riskScore = this.calculateRiskScore(history);
      await history.save();
    }
  }

  async getOrderHistory(
    identifiers: OrderRiskIdentifiers
  ): Promise<OrderRiskHistory | null> {
    return OrderRiskHistoryModel.findOne({
      $or: [
        { "identifiers.phone": identifiers.phone },
        { "identifiers.ip": identifiers.ip },
        {
          $and: [
            { "identifiers.phone": identifiers.phone },
            { "identifiers.address": identifiers.address },
          ],
        },
      ],
    });
  }
}

export const orderRiskService = new OrderRiskService();
