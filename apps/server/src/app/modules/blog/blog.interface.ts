export interface FilterQuery {
  $text?: { $search: string };
  category?: string;
  author?: string;
  tags?: { $in: string[] };
  isPublished?: boolean;
  createdAt?: { $gte?: Date; $lte?: Date };
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
}
