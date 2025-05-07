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
    // Find existing history or create new one
    let history = await OrderRiskHistoryModel.findOne({
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
      // Update existing history
      history.totalOrders += 1;
      if (status === "Cancelled") history.cancelledOrders += 1;
      if (status === "Delivered") history.successfulOrders += 1;
      history.lastOrderDate = new Date();
      history.lastOrderStatus = status;
      history.orderIds.push(orderId);
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
