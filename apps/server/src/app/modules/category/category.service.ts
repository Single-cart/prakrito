import ApiError from "../../errorHandlers/ApiError";
import { slugify } from "../../helpers/slugify";
import { CategoryModel, SubCategoryModel } from "./category.model";

// Get all category and subcategory service
export const getAllCategoryAndSubCategoryService = async () => {
  const category = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "category",
        as: "subcategory",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        subcategory: {
          $map: {
            input: "$subcategory",
            as: "subcategory",
            in: {
              _id: "$$subcategory._id",
              name: "$$subcategory.name",
              slug: "$$subcategory.slug",
            },
          },
        },
      },
    },
  ]);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

// Create category service
export const createCategoryService = async (name: string) => {
  const slug = slugify(name);

  const isExistCategory = await CategoryModel.findOne({ name: name });
  if (isExistCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await CategoryModel.create({
    name,
    slug,
  });

  return category;
};

// Get all categories service
export const getAllCategoryService = async () => {
  const category = await CategoryModel.find();
  if (!category) {
    throw new ApiError(404, "No categories found");
  }

  const categoryLength = await CategoryModel.countDocuments();

  return {
    category,
    categoryLength,
  };
};

// Get single category service
export const getSingleCategoryService = async (slug: string) => {
  const category = await CategoryModel.findOne({ slug: slug });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

// Update category service
export const updateCategoryService = async (id: string, name: string) => {
  const slug = slugify(name);

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug,
    },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

// Delete category service
export const deleteCategoryService = async (id: string) => {
  const category = await CategoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await SubCategoryModel.deleteMany({ category: id });
};

// Create subcategory service
export const createSubCategoryService = async (
  name: string,
  category: string
) => {
  const slug = slugify(name);

  const isExistSubcategory = await SubCategoryModel.findOne({ name: name });
  if (isExistSubcategory) {
    throw new ApiError(400, "Subcategory already exists");
  }

  const subcategory = await SubCategoryModel.create({
    name,
    slug,
    category: category,
  });

  return subcategory;
};

// Get all subcategories service
export const getAllSubCategoryService = async () => {
  const subcategory = await SubCategoryModel.find();
  if (!subcategory) {
    throw new ApiError(404, "No subcategories found");
  }

  return subcategory;
};

// Get single subcategory service
export const getSingleSubCategoryService = async (slug: string) => {
  const subcategory = await SubCategoryModel.findOne({ slug: slug });
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  return subcategory;
};

// Update subcategory service
export const updateSubCategoryService = async (id: string, name: string) => {
  const slug = slugify(name);

  const subcategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug,
    },
    { new: true }
  );

  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  return subcategory;
};

// Delete subcategory service
export const deleteSubCategoryService = async (id: string) => {
  const subcategory = await SubCategoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }
};
