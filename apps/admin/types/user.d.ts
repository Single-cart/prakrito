export interface IUser {
  fullName: string;
  email: string;
  password?: string;
  isSocialAuth: boolean;
  avatar?: string;
  role: "admin" | "user";
  address?: string;
  phone?: string;
  reviewsInfo?: {
    productId: string;
    reviewsCounter?: number;
  }[];
}
