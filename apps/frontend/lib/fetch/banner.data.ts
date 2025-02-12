import { env } from "../env";

export const getBanners = async (bannerType = "", category = "") => {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/banner/get-active-banners?bannerType=${bannerType}&category=${category}`,
      { next: { tags: ["Banner"] } }
    );
    const banners = await res.json();
    return banners;
  } catch (error) {
    console.log(error);
  }
};
