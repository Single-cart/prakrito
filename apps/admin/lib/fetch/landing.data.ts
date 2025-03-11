import { env } from "../env";

export const getAllLanding = async () => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/landing`, {
      next: { tags: ["Landing"] },
    });
    const landing = await res.json();
    return landing;
  } catch (error) {
    console.log(error);
  }
};
