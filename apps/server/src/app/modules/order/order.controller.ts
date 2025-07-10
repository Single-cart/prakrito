import { Request, Response } from "express";
import catchAsync from "../../middlewares/catchAsync";
import { orderRiskService } from "../order-risk/order-risk.service";
import { orderAnalyticsService, orderService } from "./order.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Create the order first
  const order = await orderService.createOrder(
    req.body,
    req.cookies.cart_session
  );

  // Update risk history with new order (this also calculates risk assessment)
  await orderRiskService.updateOrderStatus(
    order.orderId,
    {
      phone: req.body.phone,
      address: req.body.address,
      ip: req.ip || "Unknown",
      email: req.body.email,
    },
    "Pending"
  );

  // Get the updated risk assessment after adding this order
  const riskAssessment = await orderRiskService.assessOrderRisk({
    phone: req.body.phone,
    address: req.body.address,
    ip: req.ip || "Unknown",
    email: req.body.email,
  });

  if (!req.body.user) {
    res.cookie(`orders-${order.orderId}`, JSON.stringify(order.orderId), {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
    riskAssessment,
  });
});

export const getSingleOrder = catchAsync(
  async (req: Request, res: Response) => {
    const order = await orderService.getSingleOrder(req.params.id);

    // Get risk assessment for this order
    let riskAssessment = null;
    if (order?.shippingInfo) {
      try {
        riskAssessment = await orderRiskService.assessOrderRisk({
          phone: order.shippingInfo.phone,
          address: order.shippingInfo.address,
          ip: req.ip || "Unknown",
          email: order.shippingInfo.email ?? undefined,
        });
      } catch (error) {
        console.log("Risk assessment failed:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      order,
      riskAssessment,
    });
  }
);

export const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  const userOrders = await orderService.getUserOrders(
    req.query.userId as string,
    req.cookies
  );

  res.status(200).json({
    success: true,
    message: "Your all orders here",
    userOrders,
  });
});

export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    // Get the current order to know the old status
    const currentOrder = await orderService.getSingleOrder(req.params.id);
    const oldStatus = currentOrder.orderStatus;

    // Update the order status
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.orderStatus
    );

    // Update risk history when order status changes
    // Use the appropriate method based on whether this is an existing order
    await orderRiskService.updateExistingOrderStatus(
      order.orderId,
      {
        phone: order?.shippingInfo?.phone,
        address: order?.shippingInfo?.address,
        ip: req.ip || "Unknown",
        email: order?.shippingInfo?.email ?? undefined,
      },
      oldStatus,
      req.body.orderStatus
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  }
);

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { orders, pagination } = await orderService.getAllOrders(
    parseInt(req.query.page as string),
    parseInt(req.query.limit as string),
    req.query.search as string,
    req.query.orderStatus as string
  );

  res.status(200).json({
    success: true,
    orders,
    pagination,
  });
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  await orderService.deleteOrder(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

export const getSealesReport = catchAsync(
  async (req: Request, res: Response) => {
    const monthSales = await orderAnalyticsService.getSealesReport();

    res.status(200).json({
      success: true,
      monthSales,
    });
  }
);

export const getDailySalesReport = catchAsync(
  async (req: Request, res: Response) => {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const salesData = await orderAnalyticsService.getDailySalesReport(
      startDate,
      endDate
    );

    // Transform data for ApexCharts format: [timestamp, value]
    const chartData = salesData.map((item) => [
      item.date.getTime(),
      item.total,
    ]);

    res.status(200).json({
      success: true,
      chartData,
    });
  }
);

export const getOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const orderSummary = await orderAnalyticsService.getOrderStatus();
    res.status(200).json({
      success: true,
      orderSummary,
    });
  }
);

export const getDailyOrderStats = catchAsync(
  async (req: Request, res: Response) => {
    const data = await orderAnalyticsService.getDailyOrderStats();
    res.json({ success: true, data });
  }
);

export const getOrderStatusDistribution = catchAsync(
  async (req: Request, res: Response) => {
    const data = await orderAnalyticsService.getOrderStatusDistribution();
    res.json({ success: true, data });
  }
);

export const getPopularProducts = catchAsync(
  async (req: Request, res: Response) => {
    const data = await orderAnalyticsService.getPopularProducts();
    res.json({ success: true, data });
  }
);

export const getPaymentMethodStats = catchAsync(
  async (req: Request, res: Response) => {
    const data = await orderAnalyticsService.getPaymentMethodStats();
    res.json({ success: true, data });
  }
);

export const getProcessingTimeStats = catchAsync(
  async (req: Request, res: Response) => {
    const data = await orderAnalyticsService.getProcessingTimeStats();
    res.json({ success: true, data });
  }
);

export const getHourlyOrderDistribution = catchAsync(
  async (req: Request, res: Response) => {
    const data = await orderAnalyticsService.getHourlyOrderDistribution();
    res.json({ success: true, data });
  }
);
