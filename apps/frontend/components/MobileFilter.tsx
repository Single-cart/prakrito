"use client";

import { Button } from "@workspace/ui/components/button";
import { Filter } from "lucide-react";
import { FC, useState } from "react";
import CategoryFilters from "./CategoryFilters";
import ClearFilter from "./ClearFilter";
import PriceFilters from "./PriceFilters";
import RatingsFilters from "./RatingsFilters";

import { categoryType } from "@workspace/shared/index";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

type Props = {
  categories: categoryType.ICategory[];
};

const MobileFilter: FC<Props> = ({ categories }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant={"outline"}>
            <Filter /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full h-screen max-w-[350px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="">
            <div className="my-5" onClick={handleCloseSheet}>
              <CategoryFilters categories={categories} />
            </div>
            <div className="my-5" onClick={handleCloseSheet}>
              <PriceFilters />
            </div>
            <div className="my-5" onClick={handleCloseSheet}>
              <RatingsFilters />
            </div>
            <div className="my-5" onClick={handleCloseSheet}>
              <ClearFilter />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilter;
