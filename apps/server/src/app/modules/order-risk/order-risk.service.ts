import {
  OrderRiskHistory,
  OrderRiskIdentifiers,
  RiskAssessment,
  RiskFactor,
} from "./order-risk.interface";
import { OrderRiskHistoryModel } from "./order-risk.model";

class OrderRiskService {
  private calculateRiskScore(
    history: OrderRiskHistory,
    orderValue: number
  ): number {
    if (history.totalOrders === 0) return 0;

    let riskScore = 0;

    const cancellationRate =
      (history.cancelledOrders / history.totalOrders) * 100;
    if (cancellationRate > 75) riskScore += 50;
    else if (cancellationRate > 50) riskScore += 30;
    else if (cancellationRate > 25) riskScore += 15;

    if (history.totalOrders > 10 && cancellationRate > 60) riskScore += 25;
    if (history.lastOrderStatus === "Cancelled") riskScore += 15;

    const now = new Date();
    const isNewCustomer = history.totalOrders <= 1;
    if (isNewCustomer && orderValue > 500) riskScore += 25;

    const hour = now.getUTCHours();
    if (hour < 6 || hour > 22) riskScore += 10; // High-risk hours

    const recentOrders = history.orderTimestamps.filter(
      (ts) => now.getTime() - new Date(ts).getTime() < 3600 * 1000
    ).length;
    if (recentOrders > 3) riskScore += 20;

    return Math.min(riskScore, 100);
  }

  private getRiskLevel(
    riskScore: number
  ): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    if (riskScore >= 85) return "CRITICAL";
    if (riskScore >= 70) return "HIGH";
    if (riskScore >= 40) return "MEDIUM";
    return "LOW";
  }

  private generateRiskReasons(
    history: OrderRiskHistory,
    orderValue: number
  ): string[] {
    const reasons: string[] = [];
    const cancellationRate =
      (history.cancelledOrders / history.totalOrders) * 100;

    if (cancellationRate > 0) {
      reasons.push(`High cancellation rate: ${cancellationRate.toFixed(1)}%`);
    }

    const isNewCustomer = history.totalOrders <= 1;
    if (isNewCustomer && orderValue > 500) {
      reasons.push("Large order from a new customer.");
    }

    const hour = new Date().getUTCHours();
    if (hour < 6 || hour > 22) {
      reasons.push("Order placed during unusual hours.");
    }

    const recentOrders = history.orderTimestamps.filter(
      (ts) => new Date().getTime() - new Date(ts).getTime() < 3600 * 1000
    ).length;
    if (recentOrders > 3) {
      reasons.push("Multiple orders placed in a short time.");
    }

    return reasons;
  }

  private generateRiskFactors(
    history: OrderRiskHistory,
    orderValue: number
  ): RiskFactor[] {
    const factors: RiskFactor[] = [];
    const cancellationRate =
      history.totalOrders > 0
        ? (history.cancelledOrders / history.totalOrders) * 100
        : 0;

    if (cancellationRate > 50) {
      factors.push({
        category: "HISTORICAL",
        factor: "HIGH_CANCELLATION_RATE",
        impact: cancellationRate,
        description: `High cancellation rate: ${cancellationRate.toFixed(1)}%`,
        severity: cancellationRate > 75 ? "CRITICAL" : "HIGH",
      });
    }

    if (history.totalOrders <= 1 && orderValue > 500) {
      factors.push({
        category: "BEHAVIORAL",
        factor: "NEW_CUSTOMER_HIGH_VALUE",
        impact: orderValue,
        description: "Large order from new customer",
        severity: "MEDIUM",
      });
    }

    const hour = new Date().getUTCHours();
    if (hour < 6 || hour > 22) {
      factors.push({
        category: "BEHAVIORAL",
        factor: "UNUSUAL_HOURS",
        impact: 10,
        description: "Order placed during unusual hours",
        severity: "LOW",
      });
    }

    return factors;
  }

  private generateRecommendations(
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    riskFactors: RiskFactor[]
  ): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case "CRITICAL":
        recommendations.push("Hold order for manual review");
        recommendations.push("Verify customer identity");
        recommendations.push("Contact customer directly");
        break;
      case "HIGH":
        recommendations.push("Require additional verification");
        recommendations.push("Monitor payment processing closely");
        break;
      case "MEDIUM":
        recommendations.push("Review order details");
        recommendations.push("Consider shipping insurance");
        break;
      case "LOW":
        recommendations.push("Process normally");
        break;
    }

    // Add specific recommendations based on risk factors
    riskFactors.forEach((factor) => {
      if (factor.category === "PAYMENT") {
        recommendations.push("Verify payment method");
      }
      if (factor.category === "VELOCITY") {
        recommendations.push("Check for velocity abuse");
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private calculateConfidence(
    history: OrderRiskHistory,
    riskFactors: RiskFactor[]
  ): number {
    let confidence = 50; // Base confidence

    // Increase confidence based on historical data
    if (history.totalOrders > 10) confidence += 20;
    else if (history.totalOrders > 5) confidence += 10;

    // Increase confidence based on number of risk factors
    confidence += Math.min(riskFactors.length * 5, 25);

    // Decrease confidence if very new customer
    if (history.totalOrders === 0) confidence -= 30;

    return Math.max(0, Math.min(100, confidence));
  }

  async assessOrderRisk(
    identifiers: OrderRiskIdentifiers
  ): Promise<RiskAssessment> {
    if (!identifiers.ip) {
      throw new Error("IP address is required for risk assessment");
    }

    const searchCriteria: Record<string, any>[] = [
      { "identifiers.ip": identifiers.ip },
    ];
    if (identifiers.phone) {
      searchCriteria.push({ "identifiers.phone": identifiers.phone });
    }

    let history = await OrderRiskHistoryModel.findOne({
      $or: searchCriteria,
    });

    if (!history) {
      history = new OrderRiskHistoryModel({
        totalOrders: 0,
        cancelledOrders: 0,
        successfulOrders: 0,
        refundedOrders: 0,
        chargebackOrders: 0,
        identifiers,
        orderIds: [],
        orderTimestamps: [],
        riskScore: 0,
        failedPaymentAttempts: 0,
        frequentAccountChanges: 0,
        suspiciousActivities: [],
        velocityPatterns: [],
        geolocationHistory: [],
        paymentMethodHistory: [],
        deviceHistory: [],
      });
    }

    const riskScore = this.calculateRiskScore(
      history,
      identifiers.orderValue || 0
    );
    const riskLevel = this.getRiskLevel(riskScore);
    const reasons = this.generateRiskReasons(
      history,
      identifiers.orderValue || 0
    );

    // Generate risk factors based on assessment
    const riskFactors: RiskFactor[] = this.generateRiskFactors(
      history,
      identifiers.orderValue || 0
    );

    // Generate recommendations based on risk level
    const recommendations: string[] = this.generateRecommendations(
      riskLevel,
      riskFactors
    );

    // Calculate confidence score
    const confidence = this.calculateConfidence(history, riskFactors);

    return {
      riskScore,
      riskLevel,
      reasons,
      history,
      riskFactors,
      recommendations,
      confidence,
      modelVersion: "1.0.0",
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
        refundedOrders: 0,
        chargebackOrders: 0,
        lastOrderDate: new Date(),
        lastOrderStatus: status,
        identifiers,
        orderIds: [orderId],
        riskScore: 0,
        firstOrderDate: new Date(),
        orderTimestamps: [new Date()],
        failedPaymentAttempts: 0,
        frequentAccountChanges: 0,
        suspiciousActivities: [],
        velocityPatterns: [],
        geolocationHistory: [],
        paymentMethodHistory: [],
        deviceHistory: [],
      });
    } else {
      const orderExists = history.orderIds.includes(orderId);
      if (!orderExists) {
        history.totalOrders += 1;
        history.orderIds.push(orderId);
        history.orderTimestamps.push(new Date());
      }

      if (status === "Cancelled") history.cancelledOrders += 1;
      if (status === "Delivered") history.successfulOrders += 1;

      history.lastOrderDate = new Date();
      history.lastOrderStatus = status;
      history.riskScore = this.calculateRiskScore(
        history,
        identifiers.orderValue || 0
      );
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
      history.riskScore = this.calculateRiskScore(
        history,
        identifiers.orderValue || 0
      );
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
