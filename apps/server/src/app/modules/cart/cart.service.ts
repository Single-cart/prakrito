import httpStatus from "http-status";
import ApiError from "../../errorHandlers/ApiError";
import { generateOrderId } from "../../helpers/generateId";
import ProductModel from "../product/product.model";
import CartModel from "./cart.model";

export const addCartItemService = async (
  productId: string,
  colors: string,
  size: string,
  cartSession?: string
) => {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product does not exist");
  }

  if (cartSession) {
    return handleExistingCart(cartSession, productId, colors, size, product);
  }
  return createNewCart(productId, colors, size, product);
};

const handleExistingCart = async (
  sessionId: string,
  productId: string,
  colors: string,
  size: string,
  product: any
) => {
  const cart = await CartModel.findOne({ sessionId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const existingItem = cart.cartItem.find(
    (item) =>
      item.productId.toString() === productId &&
      item.size === size &&
      item.colors === colors
  );

  if (existingItem) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart");
  }

  const updatedCart = await CartModel.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        cartItem: {
          productId,
          colors,
          size,
          price: product.price,
          discountPrice: parseInt(product.discountPrice),
          quantity: 1,
        },
      },
    },
    { new: true, runValidators: true }
  );

  return updatedCart;
};

const createNewCart = async (
  productId: string,
  colors: string,
  size: string,
  product: any
) => {
  const sessionId = generateOrderId();
  const newCart = await CartModel.create({
    sessionId,
    cartItem: {
      productId,
      colors,
      size,
      price: product.price,
      discountPrice: parseInt(product.discountPrice),
      quantity: 1,
    },
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
      $project: {
        "cartItem.productId": 1,
        "cartItem.quantity": 1,
        "cartItem.selected": 1,
        "cartItem.price": 1,
        "cartItem.discountPrice": 1,
        "cartItem.colors": 1,
        "cartItem.size": 1,
        "cartItem._id": 1,
        "cartItem.product": {
          name: { $arrayElemAt: ["$product.name", 0] },
          image: {
            $arrayElemAt: [{ $arrayElemAt: ["$product.images", 0] }, 0],
          },
          colors: {
            $arrayElemAt: ["$product.colors", 0],
          },
          size: {
            $arrayElemAt: ["$product.size", 0],
          },
          shipping: { $arrayElemAt: ["$product.shipping", 0] },
          slug: { $arrayElemAt: ["$product.slug", 0] },
        },
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
    selectAll: cart[0].selectAll,
  };
};

export const syncCartService = async (params: {
  sessionId?: string;
  isSelect?: string;
  cartItemId?: string;
  isSelectAll?: string;
  cartQuantity?: string;
  deleteCartItem?: string;
  colors?: string;
  size?: string;
}) => {
  const { sessionId } = params;
  if (!sessionId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid cart session");
  }

  if (params.isSelect !== undefined && params.cartItemId) {
    await handleItemSelection(sessionId, params.cartItemId, params.isSelect);
  }

  if (params.isSelectAll !== undefined) {
    await handleSelectAll(sessionId, params.isSelectAll);
  }

  if (params.cartQuantity && params.cartItemId) {
    await handleQuantityUpdate(
      sessionId,
      params.cartItemId,
      params.cartQuantity
    );
  }

  if ((params.colors || params.size) && params.cartItemId) {
    await handleColorSizeUpdate(
      sessionId,
      params.cartItemId,
      params.colors,
      params.size
    );
  }

  if (params.deleteCartItem !== undefined && params.cartItemId) {
    await handleItemDeletion(sessionId, params.cartItemId);
  }
};

// Helper functions for syncCartService
const handleItemSelection = async (
  sessionId: string,
  cartItemId: string,
  isSelect: string
) => {
  const updatedCart = await CartModel.findOneAndUpdate(
    { sessionId, "cartItem._id": cartItemId },
    { $set: { "cartItem.$.selected": isSelect === "true" } },
    { new: true }
  );

  if (!updatedCart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart item not found");
  }

  const allSelected = updatedCart.cartItem.every((item) => item.selected);
  await CartModel.updateOne(
    { sessionId },
    { $set: { selectAll: allSelected } }
  );
};

const handleSelectAll = async (sessionId: string, isSelectAll: string) => {
  await CartModel.updateOne(
    { sessionId },
    {
      $set: {
        selectAll: isSelectAll === "true",
        "cartItem.$[].selected": isSelectAll === "true",
      },
    }
  );
};

const handleQuantityUpdate = async (
  sessionId: string,
  cartItemId: string,
  quantity: string
) => {
  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid quantity value");
  }

  const updatedCart = await CartModel.findOneAndUpdate(
    { sessionId, "cartItem._id": cartItemId },
    { $set: { "cartItem.$.quantity": parsedQuantity } },
    { new: true }
  );

  if (!updatedCart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart item not found");
  }
};

const handleColorSizeUpdate = async (
  sessionId: string,
  cartItemId: string,
  colors?: string,
  size?: string
) => {
  const cart = await CartModel.findOne({ sessionId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const cartItem = cart.cartItem.id(cartItemId);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart item not found");
  }

  // Check for existing items with same product, new color/size combination
  const hasDuplicate = cart.cartItem.some(
    (item) =>
      item._id.toString() !== cartItemId &&
      item.productId.toString() === cartItem.productId.toString() &&
      item.colors === (colors || cartItem.colors) &&
      item.size === (size || cartItem.size)
  );

  if (hasDuplicate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product variant already exists in cart"
    );
  }

  // Update fields if provided
  if (colors) cartItem.colors = colors;
  if (size) cartItem.size = size;

  await cart.save();
};

const handleItemDeletion = async (sessionId: string, cartItemId: string) => {
  const updatedCart = await CartModel.findOneAndUpdate(
    { sessionId },
    { $pull: { cartItem: { _id: cartItemId } } },
    { new: true }
  );

  if (!updatedCart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  // Update selectAll status after deletion
  const allSelected =
    updatedCart.cartItem.length > 0
      ? updatedCart.cartItem.every((item) => item.selected)
      : false;

  await CartModel.updateOne(
    { sessionId },
    { $set: { selectAll: allSelected } }
  );
};

export const calculatePriceService = async (sessionId?: string) => {
  if (!sessionId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid cart session");
  }

  const cart = await CartModel.findOne({ sessionId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const selectedProduct = cart.cartItem.filter((item) => item.selected);
  const totalMainPrice = selectedProduct.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  const totalDiscountPrice = selectedProduct.reduce(
    (acc, curr) => acc + curr.discountPrice * curr.quantity,
    0
  );

  cart.totalMainPrice = totalMainPrice;
  cart.totalDiscountPrice = totalDiscountPrice;
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
