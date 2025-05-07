import { z } from "zod";

export const CartFormSchema = z.object({
  priceVariationIndex: z
    .number({ required_error: "Price variation index is required" })
    .min(1, "Price variation index must be at least 1"),
});
