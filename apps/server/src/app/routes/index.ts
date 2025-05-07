import { Router } from "express";
import bannerRoute from "../modules/banner/banner.route";
import blogRoute from "../modules/blog/blog.route";
import cartRoute from "../modules/cart/cart.route";
import {
  categoryRoute,
  subcategoryRoute,
} from "../modules/category/category.route";
import customerReviewRoute from "../modules/customar-review/review.route";
import landingRoutes from "../modules/landing/landing.route";
import orderRoute from "../modules/order/order.route";
import productRoute from "../modules/product/product.route";
import authRouter from "../modules/user-management/auth/auth.route";
import userRouter from "../modules/user-management/users/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/subcategory",
    route: subcategoryRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/banner",
    route: bannerRoute,
  },
  {
    path: "/review",
    route: customerReviewRoute,
  },
  {
    path: "/cart",
    route: cartRoute,
  },
  {
    path: "/landing",
    route: landingRoutes,
  },
  {
    path: "/blog",
    route: blogRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
