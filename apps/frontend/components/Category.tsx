"use client";

import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { categoryType } from "@workspace/shared/index";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Category = () => {
  const [isMount, setIsMount] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { data } = useGetAllCategoryQuery({});
  const handleCategoryHover = (categoryId: string | null) => {
    setHoveredCategory(categoryId);
  };

  const categories = data?.data as categoryType.ICategorySubcategory[];

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div className="">
      <ul className="h-[320px] bg-primary-foreground rounded-md shadow-md py-3">
        {categories?.map((item) => (
          <li
            key={item._id}
            className={`relative w-full py-1 px-4 cursor-pointer ${
              hoveredCategory === item._id ? "bg-white" : ""
            }`}
            onMouseEnter={() => handleCategoryHover(item._id)}
            onMouseLeave={() => handleCategoryHover(null)}
          >
            <Link
              href={`/category/${item._id}?type=category`}
              className="block"
            >
              <span className="flex items-center justify-between">
                {item.name}
                {item.subcategory?.length > 0 &&
                  hoveredCategory === item._id && <ChevronRight />}
              </span>
            </Link>

            {item.subcategory?.length > 0 && (
              <ul
                className={`absolute left-[100%] z-40 top-0 bg-primary-foreground py-2 max-w-[250px] w-full rounded-lg shadow-md ${
                  hoveredCategory === item._id ? "block" : "hidden"
                }`}
              >
                {item.subcategory.map((subItem) => (
                  <li
                    className="py-1 px-4 hover:bg-white hover:underline"
                    key={subItem._id}
                  >
                    <Link
                      href={`/category/${subItem._id}?type=subcategory`}
                      className="block"
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
