import { env } from "../env";

export const getSingleLanding = async (id: string) => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/landing/:${id}`, {
      next: { tags: ["Landing"] },
    });
    const landing = await res.json();
    return landing;
  } catch (error) {
    console.log(error);
  }
};
