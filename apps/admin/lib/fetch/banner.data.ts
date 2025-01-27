import { env } from "../env";

export const getBanners = async (bannerType = "", category = "") => {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/banner/get-all-banners?bannerType=${bannerType}&category=${category}`,
      { next: { tags: ["Banner"] } }
    );
    const banners = await res.json();
    return banners;
  } catch (error) {
    console.log(error);
  }
};

export const getSingleBanner = async (id: string) => {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/banner/get-single-banner/${id}`,
      { next: { tags: ["Banner"] } }
    );
    const banner = await res.json();
    return banner;
  } catch (error) {
    console.log(error);
  }
};
