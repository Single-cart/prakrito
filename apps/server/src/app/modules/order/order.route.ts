import { orderZodSchema } from "@workspace/shared/index";
import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuards";
import validateRequest from "../../middlewares/validateRequest";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getDailyOrderStats,
  getHourlyOrderDistribution,
  getOrderStatus,
  getOrderStatusDistribution,
  getPaymentMethodStats,
  getPopularProducts,
  getProcessingTimeStats,
  getSealesReport,
  getSingleOrder,
  getUserOrders,
  updateOrderStatus,
} from "./order.controller";

const orderRoute = express.Router();

orderRoute.post(
  "/create-order",
  validateRequest(orderZodSchema.createOrderSchema),
  createOrder
);
orderRoute.get("/single-order/:id", getSingleOrder);
orderRoute.get("/user-orders", getUserOrders);
orderRoute.put(
  "/update-order-status/:id",
  validateRequest(orderZodSchema.updateOrderStatusSchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateOrderStatus
);
orderRoute.get(
  "/all-orders",
  isAuthenticated,
  authorizeUser("admin"),
  getAllOrders
);
orderRoute.delete(
  "/delete-order/:id",
  validateRequest(orderZodSchema.deleteOrderSchema),
  isAuthenticated,
  authorizeUser("admin"),
  deleteOrder
);

//chart
orderRoute.get(
  "/monthly-sales",
  isAuthenticated,
  authorizeUser("admin"),
  getSealesReport
);
orderRoute.get(
  "/order-status",
  isAuthenticated,
  authorizeUser("admin"),
  getOrderStatus
);

orderRoute.get(
  "/analytics/daily",
  isAuthenticated,
  authorizeUser("admin"),
  getDailyOrderStats
);

orderRoute.get(
  "/analytics/status-distribution",
  isAuthenticated,
  authorizeUser("admin"),
  getOrderStatusDistribution
);

orderRoute.get(
  "/analytics/popular-products",
  isAuthenticated,
  authorizeUser("admin"),
  getPopularProducts
);

orderRoute.get(
  "/analytics/payment-methods",
  isAuthenticated,
  authorizeUser("admin"),
  getPaymentMethodStats
);

orderRoute.get(
  "/analytics/processing-times",
  isAuthenticated,
  authorizeUser("admin"),
  getProcessingTimeStats
);

orderRoute.get(
  "/analytics/hourly-distribution",
  isAuthenticated,
  authorizeUser("admin"),
  getHourlyOrderDistribution
);

export default orderRoute;
