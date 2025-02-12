import { env } from "../env";

export const getAllCustomerReviews = async () => {
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/review/get-customer-review`,
      {
        next: { tags: ["customerReview"] },
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
