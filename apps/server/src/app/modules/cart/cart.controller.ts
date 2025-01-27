import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  addCartItemService,
  calculatePriceService,
  getCartItemService,
  syncCartService,
} from "./cart.service";

export const addCartItem = catchAsync(async (req: Request, res: Response) => {
  const { productId, colors, size } = req.body;
  const cartSession = req.cookies.cart_session;

  const result = await addCartItemService(productId, colors, size, cartSession);

  if (result?.sessionId) {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 2);

    res.cookie("cart_session", result.sessionId, {
      httpOnly: true,
      expires: expirationDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product added to cart",
    data: result,
  });
});

export const getCartItem = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.cookies.cart_session;
  const result = await getCartItemService(sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Cart products retrieved",
    data: {
      cartItem: result.cartItem,
      selectAll: result.selectAll,
    },
  });
});

export const syncCart = catchAsync(async (req: Request, res: Response) => {
  const {
    isSelect,
    cartItemId,
    isSelectAll,
    cartQuantity,
    deleteCartItem,
    colors,
    size,
  } = req.query as any;
  const sessionId = req.cookies.cart_session;

  await syncCartService({
    sessionId,
    isSelect,
    cartItemId,
    isSelectAll,
    cartQuantity,
    deleteCartItem,
    colors,
    size,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Cart synchronized successfully",
  });
});

export const calculatePrice = catchAsync(
  async (req: Request, res: Response) => {
    const sessionId = req.cookies.cart_session;
    const result = await calculatePriceService(sessionId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Price calculated successfully",
      data: {
        totalMainPrice: result.totalMainPrice,
        totalDiscountPrice: result.totalDiscountPrice,
      },
    });
  }
);
