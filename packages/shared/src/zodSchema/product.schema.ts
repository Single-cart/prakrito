import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string({ required_error: "Product name is required" }),
  priceVariation: z
    .array(
      z.object({
        price: z.string().optional(),
        discountPrice: z.string({
          required_error: "discount price is required",
        }),
        quantity: z.string({ required_error: "Quantity is required" }),
        available: z.boolean({
          required_error: "Availability status is required",
        }),
      })
    )
    .min(1, { message: "At least one price variation is required" }),

  stock: z.string({ required_error: "Product stock is required" }),
  sold: z.string().optional(),
  soldAt: z.date().optional(),
  order: z.string().optional(),
  insideDhaka: z.string({
    required_error: "Product inside dhaka shipping is required",
  }),
  outsideDhaka: z.string({
    required_error: "Product outside dhaka shipping is required",
  }),
  subcategory: z.string().optional(),
  category: z.string({ required_error: "product category is required" }),
});

export const ProductFilterSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    price: z.string().optional(),
    maxPrice: z.string().optional(),
    minPrice: z.string().optional(),
    ratings: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const ProductDescriptionSchema = z.object({
  description: z.string({
    required_error: "Product Description is required",
  }),
});

export const CreateProductReviewSchema = z.object({
  body: z.object({
    rating: z.number({ required_error: "Review rating is required" }),
    comment: z.string({ required_error: "Review comment is required" }),
  }),
});
export const UpdateProductReviewSchema = z.object({
  body: z.object({
    approved: z.boolean({ required_error: "Review status is required" }),
    productId: z.string({ required_error: "ProductId is required" }),
    reviewId: z.string({ required_error: "ReviewId is required" }),
  }),
});
