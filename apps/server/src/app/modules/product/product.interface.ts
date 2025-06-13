import mongoose from "mongoose";

export interface FilterQuery {
  $text?: { $search: string };
  category?: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  $expr?: any;
  ratings?: { $gte: number };
}

export interface PopulatedCategory {
  _id: mongoose.Types.ObjectId;
  name: string;
}
