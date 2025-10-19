import mongoose from "mongoose";

export interface FilterQuery {
  $text?: { $search: string };
  category?: mongoose.Types.ObjectId;
  subcategory?: string;
  $expr?: any;
  ratings?: { $gte: number };
  isActive?: boolean | { $ne: boolean };
}

export interface PopulatedCategory {
  _id: mongoose.Types.ObjectId;
  name: string;
}
