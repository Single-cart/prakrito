import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../errorHandlers/ApiError";
import { generateOrderId } from "../../helpers/generateId";
import catchAsync from "../../middlewares/catchAsync";
import ProductModel from "../product/product.model";
import CartModel from "./cart.model";

export const addCartItemService = async (
  productId: string,
  priceVariationIndex: number,
  cartSession?: string
) => {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product does not exist");
  }

  if (cartSession) {
    try {
      return await handleExistingCart(
        cartSession,
        productId,
        priceVariationIndex,
        product
      );
    } catch (error) {
      // If cart is not found, create a new one instead of throwing error
      if (
        error instanceof ApiError &&
        error.statusCode === httpStatus.NOT_FOUND
      ) {
        return await createNewCart(productId, priceVariationIndex, product);
      }
      throw error;
    }
  }

  return await createNewCart(productId, priceVariationIndex, product);
};

export const handleExistingCart = async (
  cartSession: string,
  productId: string,
  priceVariationIndex: number,
  product: any
) => {
  // Find the existing cart
  const cart = await CartModel.findOne({
    sessionId: cartSession,
  });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const existingItem = cart.cartItem.find(
    (item) =>
      item.productId.toString() === productId &&
      item.priceVariationIndex === priceVariationIndex
  );

  if (existingItem) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product Already In Cart");
  }

  // Get the price information based on the price variation index
  const priceVariation =
    product.priceVariation &&
    product.priceVariation.length >= priceVariationIndex
      ? product.priceVariation[priceVariationIndex - 1]
      : null;

  if (!priceVariation || !priceVariation.available) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Selected variation is not available"
    );
  }

  const updatedCart = await CartModel.findOneAndUpdate(
    { sessionId: cartSession },
    {
      $push: {
        cartItem: {
          productId: new Types.ObjectId(productId),
          priceVariationIndex,
          price: priceVariation.price || product.price,
          discountPrice:
            priceVariation.discountPrice ||
            product.discountPrice ||
            priceVariation.price,
          selected: true,
          quantity: 1,
        },
      },
    },
    { runValidators: true, new: true }
  ).lean();

  if (!updatedCart) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cart update failed");
  }

  return updatedCart;
};

const createNewCart = async (
  productId: string,
  priceVariationIndex: number,
  product: any
) => {
  const sessionId = generateOrderId();

  // Get the price information based on the price variation index
  const priceVariation =
    product.priceVariation &&
    product.priceVariation.length >= priceVariationIndex
      ? product.priceVariation[priceVariationIndex - 1]
      : null;

  if (!priceVariation || !priceVariation.available) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Selected variation is not available"
    );
  }

  const newCart = await CartModel.create({
    sessionId,
    cartItem: [
      {
        productId,
        priceVariationIndex,
        price: priceVariation.price || product.price,
        discountPrice:
          priceVariation.discountPrice ||
          product.discountPrice ||
          priceVariation.price,
        quantity: 1,
        selected: true,
      },
    ],
  });

  return { cart: newCart, sessionId };
};

export const getCartItemService = async (sessionId?: string) => {
  if (!sessionId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid cart session");
  }

  const cart = await CartModel.aggregate([
    {
      $match: { sessionId: sessionId },
    },
    {
      $unwind: "$cartItem",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItem.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $addFields: {
        "cartItem.product": { $arrayElemAt: ["$product", 0] },
      },
    },
    {
      $project: {
        "cartItem.productId": 1,
        "cartItem.quantity": 1,
        "cartItem.selected": 1,
        "cartItem.price": 1,
        "cartItem.discountPrice": 1,
        "cartItem.priceVariationIndex": 1,
        "cartItem._id": 1,
        "cartItem.product": 1,
        selectAll: "$selectAll",
      },
    },
    {
      $group: {
        _id: "$_id",
        sessionId: { $first: "$sessionId" },
        cartItem: { $push: "$cartItem" },
        totalMainPrice: { $first: "$totalMainPrice" },
        totalDiscountPrice: { $first: "$totalDiscountPrice" },
        selectAll: { $max: "$selectAll" },
      },
    },
  ]);

  if (!cart.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  return {
    cartItem: cart[0].cartItem,
    selectAll: cart.length > 0 ? cart[0].selectAll : null,
  };
};

export const syncCart = catchAsync(async (req, res) => {
  const {
    isSelect,
    cartItemId,
    isSelectAll,
    cartQuantity,
    deleteCartItem,
    priceVariationIndex,
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

  if (priceVariationIndex && cartItemId) {
    // Get the cart
    const cart = await CartModel.findOne({ sessionId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const updatingItem: any = cart.cartItem.id(cartItemId);
    if (!updatingItem) {
      throw new ApiError(404, "Cart item not found");
    }

    const newPriceVariationIndex = parseInt(priceVariationIndex as string);
    if (isNaN(newPriceVariationIndex) || newPriceVariationIndex < 1) {
      throw new ApiError(400, "Invalid price variation index");
    }

    // Check if a product with the same ID and variation index already exists
    const existingItem = cart.cartItem.find(
      (item: any) =>
        item._id.toString() !== cartItemId &&
        item.productId.toString() === updatingItem.productId.toString() &&
        item.priceVariationIndex === newPriceVariationIndex
    );

    if (existingItem) {
      throw new ApiError(400, "Product variation already exists in the cart");
    }

    // Update the price variation index
    updatingItem.priceVariationIndex = newPriceVariationIndex;
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

export const calculatePriceService = async (sessionId?: string) => {
  if (!sessionId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid cart session");
  }

  const cart = await CartModel.findOne({ sessionId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  // Use type assertion to fix TypeScript errors
  const selectedProduct = cart.cartItem.filter((item) => item.selected);
  const totalMainPrice = selectedProduct.reduce(
    (acc, curr: any) => acc + curr.price * curr.quantity,
    0
  );
  const totalDiscountPrice = selectedProduct.reduce(
    (acc, curr: any) => acc + curr.discountPrice * curr.quantity,
    0
  );

  // Fix the property names to match the model
  cart.totalPrice = totalMainPrice;
  await cart.save();

  return { totalMainPrice, totalDiscountPrice };
};

export const deleteOldCartsService = async () => {
  try {
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    await CartModel.deleteMany({
      createdAt: { $lt: twoMonthsAgo },
    });
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
