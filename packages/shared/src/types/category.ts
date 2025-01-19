import { Schema } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  _id: string;
}

export interface ISubCategory {
  name: string;
  slug: string;
  category: Schema.Types.ObjectId;
  _id: string;
}

export interface ICategorySubcategory {
  name: string;
  slug: string;
  _id: string;
  subcategory: ISubCategory[];
}
