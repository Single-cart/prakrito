"use client";

import { Button } from "@workspace/ui/components/button";
import { RefreshCw } from "lucide-react";
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
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <Button
        onClick={handleSearchClear}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium border border-gray-300"
        variant="outline"
      >
        <RefreshCw size={16} className="mr-2" />
        Reset All Filters
      </Button>
    </div>
  );
};

export default ClearFilter;
