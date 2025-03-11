import { z } from "zod";

const createLandingZodSchema = z.object({
  body: z.object({
    heading: z.string({
      required_error: "Heading is required",
    }),
    product: z.string({
      required_error: "Product ID is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    phone: z.string({
      required_error: "Phone is required",
    }),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateLandingZodSchema = z.object({
  body: z.object({
    heading: z.string().optional(),
    product: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const landingValidation = {
  createLandingZodSchema,
  updateLandingZodSchema,
};
