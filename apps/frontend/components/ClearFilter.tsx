"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

const ClearFilter = () => {
  const router = useRouter();
  // const params = useSearchParams();
  // const subcategory = params.get("subcategory");
  // const search = params.get("search");

  // const filterValue =
  //   subcategory !== null && subcategory !== ""
  //     ? `subcategory=${subcategory}`
  //     : `search=${search}`;

  const handleSearchClear = () => {
    router.replace("/products");
  };

  return (
    <div>
      <Button onClick={handleSearchClear} className="w-full">
        Clear Filter
      </Button>
    </div>
  );
};

export default ClearFilter;
