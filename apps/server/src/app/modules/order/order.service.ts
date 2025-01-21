import mongoose, { PipelineStage } from "mongoose";
import config from "../../config/config";
import ApiError from "../../errorHandlers/ApiError";
import { generateOrderId } from "../../helpers/generateId";
import { sendMail } from "../../helpers/sendMail";
import CartModel from "../cart/cart.model";
import ProductModel from "../product/product.model";
import UserModel from "../user-management/users/user.model";
import {
  HourlyDistribution,
  MonthlySales,
  OrderData,
  OrderStatus,
  OrderSummary,
  PaymentStats,
  PopularProduct,
  ProcessingTimeStats,
} from "./order.interface";
import OrderModel from "./order.model";
console.log("first");
export const orderService = {
  async createOrder(orderData: OrderData, sessionId?: string) {
    const order = await OrderModel.create({
      shippingInfo: {
        phone: orderData.phone,
        fullName: orderData.fullName,
        address: orderData.address,
      },
      orderItems: orderData.orderItems,
      orderNots: orderData.orderNots,
      paymentType: orderData.paymentType,
      itemsPrice: orderData.itemsPrice,
      shippingPrice: orderData.shippingPrice,
      totalAmount: orderData.totalAmount,
      user: orderData.user,
      orderId: generateOrderId(),
    });

    // Clear cart items if they exist
    if (sessionId && orderData.orderItems?.length > 0) {
      const cartItemIds = orderData.orderItems.map((item: any) => item._id);
      await CartModel.findOneAndUpdate(
        { sessionId },
        {
          $pull: {
            cartItem: { _id: { $in: cartItemIds } },
          },
        },
        { new: true }
      );
    }

    // Send order confirmation email
    await sendMail({
      email: config.smtp.smtpMail!,
      subject: "New Order Notification",
      templete: "orderConfirmation.ejs",
      data: order,
    });

    return order;
  },

  async getSingleOrder(orderId: string) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order?.user) {
      await order.populate("user", "fullName email");
    }

    return order;
  },

  async getUserOrders(userId?: string, cookies?: any) {
    let userOrders;

    if (userId) {
      userOrders = await OrderModel.find({ user: userId })
        .limit(15)
        .sort({ createdAt: -1 });
    } else {
      const ordersId = Object.keys(cookies).filter((value) =>
        value.startsWith("orders")
      );

      const orderPromises = ordersId.map(async (value) => {
        const orderId = value.split("-")[1];
        return OrderModel.findOne({ orderId })
          .limit(15)
          .sort({ createdAt: -1 });
      });

      const cookiesOrder = await Promise.all(orderPromises);
      userOrders = cookiesOrder.filter(Boolean);
    }

    if (userOrders.length === 0) {
      throw new ApiError(404, "Order not found");
    }

    return userOrders;
  },

  async updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === "Delivered") {
      throw new ApiError(400, "Order already delivered");
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered") {
      // Update stock and sold
      await Promise.all(
        order.orderItems.map(async (value) => {
          await updateProductStockSold(
            value?.product?.toString(),
            value?.quantity
          );
        })
      );

      // Update user review counter
      await Promise.all(
        order.orderItems.map(async (value) => {
          await updateReviewInfo(
            value?.product.toString(),
            order?.user?.toString()!
          );
        })
      );

      // Update deliveredAt
      order.deliveredAt = new Date();
    }

    await order.save({ validateBeforeSave: true });
    return order;
  },

  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    orderStatus: string = ""
  ) {
    const query: any = {};

    if (search) {
      query.orderId = { $regex: search, $options: "i" };
    }

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        page,
        numOfOrders: total,
        hasNextPage: total > skip + limit,
        nextPage: total > skip + limit ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  },

  async deleteOrder(orderId: string) {
    const order = await OrderModel.findByIdAndDelete(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return order;
  },
};

export const updateProductStockSold = async (
  productId: string,
  quentity: number
) => {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  product.stock -= quentity;
  product.sold += quentity;
  product.soldAt = new Date();
  await product.save({ validateBeforeSave: true });
};

export const updateReviewInfo = async (productId: string, userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isReviewdBefore = user?.reviewsInfo?.find(
    (value) => value.productId === productId
  );

  if (isReviewdBefore && isReviewdBefore.reviewsCounter) {
    isReviewdBefore.reviewsCounter =
      (isReviewdBefore.reviewsCounter as number) + 1;
  } else {
    user.reviewsInfo?.push({
      reviewsCounter: 1,
      productId: productId,
    });
  }

  await user.save();
};

export const orderAnalyticsService = {
  async getOrderStatus(): Promise<OrderSummary> {
    const currentDate = new Date();
    const startMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const orders = await OrderModel.find({
      createdAt: { $gte: startMonth, $lte: endMonth },
    });

    if (!orders.length) {
      throw new ApiError(404, "Orders not found");
    }

    const orderSummary: OrderSummary = {
      totalPandingOrder: 0,
      totalDeliveredOrder: 0,
      totalCancelledOrder: 0,
      totalShippedOrder: 0,
      totalProcessingOrder: 0,
    };

    orders.forEach((order) => {
      switch (order.orderStatus) {
        case "Pending":
          orderSummary.totalPandingOrder++;
          break;
        case "Delivered":
          orderSummary.totalDeliveredOrder++;
          break;
        case "Cancelled":
          orderSummary.totalCancelledOrder++;
          break;
        case "Processing":
          orderSummary.totalProcessingOrder++;
          break;
        case "Shipped":
          orderSummary.totalShippedOrder++;
          break;
      }
    });

    return orderSummary;
  },

  async getDailyOrderStats() {
    return OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  },

  async getOrderStatusDistribution() {
    return OrderModel.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);
  },

  async getSealesReport(): Promise<MonthlySales[]> {
    const currentDate = new Date();
    const lastYearDate = new Date();
    lastYearDate.setFullYear(currentDate.getFullYear() - 1);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          deliveredAt: { $gte: lastYearDate, $lte: currentDate },
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$deliveredAt" },
            month: { $month: "$deliveredAt" },
          },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ];

    const yearlySales = await OrderModel.aggregate(pipeline)
      .hint({ orderStatus: 1, deliveredAt: 1 })
      .allowDiskUse(true);

    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index));
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const totalMonth = yearlySales.find(
        (item) => item._id.year === year && item._id.month === month
      );

      return {
        name: date.toLocaleString("en-us", { month: "long" }),
        total: totalMonth?.totalAmount || 0,
      };
    });
  },

  async getPopularProducts(): Promise<PopularProduct[]> {
    return OrderModel.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productName",
          totalOrders: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          totalOrders: 1,
          revenue: 1,
          averageOrderSize: { $divide: ["$totalOrders", "$orderCount"] },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 },
    ])
      .hint({ orderStatus: 1 })
      .allowDiskUse(true);
  },

  async getPaymentMethodStats(): Promise<PaymentStats[]> {
    return OrderModel.aggregate([
      {
        $group: {
          _id: "$paymentType",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          amounts: { $push: "$totalAmount" },
        },
      },
      {
        $project: {
          count: 1,
          totalAmount: 1,
          averageAmount: { $divide: ["$totalAmount", "$count"] },
        },
      },
    ])
      .hint({ paymentType: 1, totalAmount: 1 })
      .allowDiskUse(true);
  },

  async getProcessingTimeStats(): Promise<ProcessingTimeStats[]> {
    return OrderModel.aggregate([
      {
        $match: {
          deliveredAt: { $exists: true },
          orderStatus: "Delivered",
        },
      },
      {
        $project: {
          processingTime: {
            $divide: [
              { $subtract: ["$deliveredAt", "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
          orderStatus: 1,
        },
      },
      {
        $group: {
          _id: "$orderStatus",
          avgProcessingTime: { $avg: "$processingTime" },
          minProcessingTime: { $min: "$processingTime" },
          maxProcessingTime: { $max: "$processingTime" },
          stdDev: { $stdDevPop: "$processingTime" },
        },
      },
      {
        $project: {
          avgProcessingTime: { $round: ["$avgProcessingTime", 2] },
          minProcessingTime: { $round: ["$minProcessingTime", 2] },
          maxProcessingTime: { $round: ["$maxProcessingTime", 2] },
          standardDeviation: { $round: ["$stdDev", 2] },
        },
      },
    ])
      .hint({ orderStatus: 1, createdAt: 1, deliveredAt: 1 })
      .allowDiskUse(true);
  },

  async getHourlyOrderDistribution(): Promise<HourlyDistribution[]> {
    return OrderModel.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orderCount: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          orderCount: 1,
          revenue: 1,
          avgOrderValue: {
            $round: [{ $divide: ["$totalAmount", "$orderCount"] }, 2],
          },
        },
      },
      { $sort: { _id: 1 } },
    ])
      .hint({ createdAt: 1 })
      .allowDiskUse(true);
  },
};
