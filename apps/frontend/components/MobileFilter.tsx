import { Button } from "@workspace/ui/components/button";
import { Filter } from "lucide-react";
import { FC } from "react";
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
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"}>
            <Filter /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="">
            <div className="my-5">
              <CategoryFilters categories={categories} />
            </div>
            <div className="my-5">
              <PriceFilters />
            </div>
            <div className="my-5">
              <RatingsFilters />
            </div>
            <div className="my-5">
              <ClearFilter />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilter;
