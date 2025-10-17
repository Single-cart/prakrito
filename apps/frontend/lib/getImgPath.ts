import { env } from "./env";

export const getImgUrl = (imgPath: string) => {
  // Handle the case where imgPath might be undefined or null
  if (!imgPath) return "";
  // Remove 'public/' prefix if it exists, as it's typically not part of the URL path
  const normalizedPath = imgPath.startsWith("public/")
    ? imgPath.substring(7)
    : imgPath;
  return `${env.NEXT_PUBLIC_SERVER_URL}/${normalizedPath}`;
};
