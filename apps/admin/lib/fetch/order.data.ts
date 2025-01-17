import { store } from "@/redux/store";
import { env } from "../env";

interface QueryProps {
  orderStatus?: string;
  page?: string;
}

export const getAllOrders = async ({
  orderStatus = "",
  page = "1",
}: QueryProps) => {
  // Get the token from Redux store
  const token = store.getState().auth.token;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/order/all-orders?page=${page}&orderStatus=${orderStatus}`,
    {
      credentials: "include",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const order = await res.json();
  return order;
};
