export interface IUser {
  _id: string;
  fullName: string;
  email: string;
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
