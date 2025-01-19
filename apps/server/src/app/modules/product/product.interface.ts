export interface FilterQuery {
  $text?: { $search: string };
  category?: string;
  subcategory?: string;
  $expr?: any;
  ratings?: { $gte: number };
}
