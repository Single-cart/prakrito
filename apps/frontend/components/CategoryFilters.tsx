import { categoryType } from "@workspace/shared/index";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";

interface Props {
  categories: categoryType.ICategory[];
}

const CategoryFilters = ({ categories }: Props) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {categories && (
        <>
          <h1 className="font-medium text-lg mb-2 text-primary">Categories</h1>
          <Separator className="mb-3 bg-gray-200" />
        </>
      )}

      <div className="flex flex-col gap-2">
        {categories?.map((item) => (
          <Link
            className="py-1.5 px-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            href={`/category/${item._id}/category`}
            key={item._id}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
