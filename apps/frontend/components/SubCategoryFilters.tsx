import { categoryType } from "@workspace/shared/index";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";

interface Props {
  subcategory: categoryType.ISubCategory[];
}

const SubCategoryFilters = ({ subcategory }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {subcategory && (
        <>
          <h1 className="font-[400] text-lg">Categories</h1>
          <Separator />
        </>
      )}

      {subcategory?.map((item) => (
        <Link
          className="font-[500] hover:underline hover:text-[#000000b2]"
          href={`/category/${item._id}`}
          key={item._id}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default SubCategoryFilters;
