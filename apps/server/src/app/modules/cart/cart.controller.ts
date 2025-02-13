import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import CartModel from "./cart.model";
import {
  addCartItemService,
  calculatePriceService,
  getCartItemService,
} from "./cart.service";

export const addCartItem = catchAsync(async (req: Request, res: Response) => {
  const { productId, colors, size } = req.body;
  const cartSession = req.cookies.cart_session;

  if (!productId || !colors || !size) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

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

// export const syncCart = catchAsync(async (req: Request, res: Response) => {
//   const {
//     isSelect,
//     cartItemId,
//     isSelectAll,
//     cartQuantity,
//     deleteCartItem,
//     colors,
//     size,
//   } = req.query as any;
//   const sessionId = req.cookies.cart_session;

//   await syncCartService({
//     sessionId,
//     isSelect,
//     cartItemId,
//     isSelectAll,
//     cartQuantity,
//     deleteCartItem,
//     colors,
//     size,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: "Cart synchronized successfully",
//   });
// });

export const syncCart = catchAsync(async (req, res) => {
  const {
    isSelect,
    cartItemId,
    isSelectAll,
    cartQuantity,
    deleteCartItem,
    colors,
    size,
  } = req.query;
  const sessionId = req.cookies.cart_session;

  if (!sessionId) {
    throw new ApiError(400, "Invalid Cart Product");
  }

  if (isSelect !== undefined && cartItemId) {
    // Toggle product selection
    const updatedCartItem = await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem._id": cartItemId,
      },
      {
        $set: {
          "cartItem.$.selected": isSelect === "false" ? false : true,
        },
      },
      { new: true }
    );

    if (!updatedCartItem) {
      throw new ApiError(404, "cart product not found");
    }

    // Check if all items are selected
    const allItemsSelected = updatedCartItem.cartItem.every(
      (item) => item.selected
    );

    // Update selectAll based on the condition for the specific cartId
    await CartModel.findOneAndUpdate(
      {
        sessionId,
      },
      {
        selectAll: allItemsSelected,
      },
      { new: true }
    );
  }

  if (isSelectAll !== undefined) {
    // Toggle select all
    const isSelectedAll = isSelectAll === "false" ? false : true;

    await CartModel.findOneAndUpdate(
      {
        sessionId,
      },
      {
        selectAll: isSelectedAll,
        $set: { "cartItem.$[].selected": isSelectedAll },
      },
      { new: true }
    );
  }

  if (cartQuantity && cartItemId) {
    // Update product quantity
    await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem._id": cartItemId,
      },
      {
        $set: { "cartItem.$.quantity": parseInt(cartQuantity as string) },
      },
      { new: true }
    );
  }

  // if (colors && cartItemId) {
  //   // Update product selected colors
  //   await CartModel.findOneAndUpdate(
  //     {
  //       sessionId,
  //       "cartItem._id": cartItemId,
  //     },
  //     {
  //       $set: { "cartItem.$.colors": colors },
  //     },
  //     { new: true }
  //   );
  // }

  // if (size && cartItemId) {
  //   // Update product selected colors
  //   await CartModel.findOneAndUpdate(
  //     {
  //       sessionId,
  //       "cartItem._id": cartItemId,
  //     },
  //     {
  //       $set: { "cartItem.$.size": size },
  //     },
  //     { new: true }
  //   );
  // }

  if ((colors || size) && cartItemId) {
    const cart = await CartModel.findOne({ sessionId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const updatingItem: any = cart.cartItem.id(cartItemId);
    if (!updatingItem) {
      throw new ApiError(404, "Cart item not found");
    }

    const newColors = colors || updatingItem.colors;
    const newSize = size || updatingItem.size;

    // Check if a product with the same ID, color, and size already exists
    const existingItem = cart.cartItem.find(
      (item: any) =>
        item?._id?.toString() !== cartItemId &&
        item.productId.toString() === updatingItem.productId.toString() &&
        item.colors === newColors &&
        item.size === newSize
    );

    if (existingItem) {
      throw new ApiError(400, "Product already exists in the cart");
    }

    // If no duplicate found, update the item
    if (colors) {
      updatingItem.colors = colors;
    }
    if (size) {
      updatingItem.size = size;
    }

    await cart.save();
  }

  if (deleteCartItem !== undefined && cartItemId) {
    // Delete specific item from the cart
    const updatedCartItem = await CartModel.findOneAndUpdate(
      { sessionId },
      {
        $pull: {
          cartItem: { _id: cartItemId },
        },
      },
      { new: true }
    );

    const allItemsSelected = updatedCartItem?.cartItem.every(
      (item) => item.selected
    );

    await CartModel.findOneAndUpdate(
      { sessionId },
      {
        selectAll: allItemsSelected,
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "cart product was sync",
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
