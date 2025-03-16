"use server";

import { revalidateTag } from "next/cache";
import { env } from "../env";

export const customRevalidate = async (tag: string) => {
  try {
    await revalidateTag(tag);
    await fetch(`${env.NEXT_PUBLIC_CLIENT_URL}/api/revalidate`, {
      method: "POST",
      body: JSON.stringify({ tag }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
