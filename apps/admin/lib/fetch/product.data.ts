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
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/product/all-products`, {
    next: { tags: ["getAllProducts"] },
  });
  const data = await res.json();

  return data;
};

export const resentSold = async () => {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/product/sold-product`, {
    next: { tags: ["getAllProducts"] },
  });
  const data = await res.json();

  return data;
};

export const getAllProducts = async ({
  page = "1",
  limit = "10",
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
        next: { tags: ["getAllProducts", "singleProduct"] },
        cache: "force-cache",
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const singleProductAdmin = async (slug: string) => {
  // Import store dynamically to avoid circular dependencies
  const { store } = await import("@/redux/store");
  const token = store.getState().auth.token;
  console.log(token);
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/product/single-product/${slug}`,
      {
        next: { tags: ["getAllProductsAdmin", "singleProductAdmin"] },
        cache: "no-store",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
