import { env } from "../env";

interface QueryProps {
  page?: string;
  limit?: string;
  category?: string;
  subcategory?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  ratings?: string;
}

export const mixProduct = async () => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/product/all-products?limit=15`,
    {
      next: { tags: ["getAllProducts"] },
      cache: "force-cache",
    }
  );
  const data = await res.json();

  return data;
};

export const resentSold = async () => {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/product/sold-product`, {
    next: { tags: ["getAllProducts"] },
    cache: "force-cache",
  });
  const data = await res.json();

  return data;
};

export const getAllProducts = async ({
  page = "1",
  limit = "15",
  category = "",
  subcategory = "",
  search = "",
  minPrice = "",
  maxPrice = "",
  ratings = "0",
}: QueryProps) => {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/product/all-products?page=${page}&ratings=${ratings}&limit=${limit}&category=${category}&subcategory=${subcategory}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
      { next: { tags: ["getAllProducts"] }, cache: "force-cache" }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const singleProduct = async (slug: string) => {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/product/single-product/${slug}`,
      {
        next: { tags: ["getAllProducts"] },
        cache: "force-cache",
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
