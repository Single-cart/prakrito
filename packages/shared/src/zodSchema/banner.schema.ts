import { z } from "zod";

export const bannerSchema = z
  .object({
    bannerType: z.enum(["topBanner", "mainBanner", "categoryBanner"]),
    category: z.string().optional(),
    order: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.bannerType === "categoryBanner") {
        return !!data.category;
      }
      return true;
    },
    {
      message: "Category is required for category banners",
      path: ["category"],
    }
  );

// Type for TypeScript
export type BannerFormData = z.infer<typeof bannerSchema>;
