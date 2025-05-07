import { BlogFilters, FilterQuery } from "./blog.interface";

export const buildBlogFilterQuery = (filters: BlogFilters): FilterQuery => {
  const filter: FilterQuery = {};

  if (filters.search) {
    filter.$text = { $search: filters.search };
  }

  if (filters.category) {
    filter.category = filters.category;
  }

  if (filters.author) {
    filter.author = filters.author;
  }

  if (filters.tags && filters.tags.length > 0) {
    filter.tags = { $in: filters.tags };
  }

  if (filters.isPublished !== undefined) {
    filter.isPublished = filters.isPublished;
  }

  if (filters.startDate || filters.endDate) {
    filter.createdAt = {};

    if (filters.startDate) {
      filter.createdAt.$gte = filters.startDate;
    }

    if (filters.endDate) {
      filter.createdAt.$lte = filters.endDate;
    }
  }

  return filter;
};

export const validateBlogOwnership = (
  blogAuthorId: string,
  userId: string
): boolean => {
  return blogAuthorId.toString() === userId.toString();
};

export const parseFilterParams = (query: any): BlogFilters => {
  return {
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    search: query.search?.toString(),
    category: query.category?.toString(),
    author: query.author?.toString(),
    tags: query.tags ? query.tags.toString().split(",") : undefined,
    isPublished: query.isPublished ? query.isPublished === "true" : undefined,
    startDate: query.startDate ? new Date(query.startDate) : undefined,
    endDate: query.endDate ? new Date(query.endDate) : undefined,
  };
};
