import { z } from "zod";

export const CartFormSchema = z.object({
  colors: z
    .string({ required_error: "Color is required" })
    .min(1, "Color is required"),
  size: z
    .string({ required_error: "size is required" })
    .min(1, "size is required"),
});
