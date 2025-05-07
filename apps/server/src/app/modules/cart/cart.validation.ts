import { Types } from "mongoose";
import z from "zod";

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const addToCartSchema = z.object({
  body: z.object({
    productId: objectIdSchema.describe("Product ID is require"),
    priceVariationIndex: z
      .number({ required_error: "Price variation index is required" })
      .min(1, "Price variation index must be at least 1"),
  }),
});
