import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { FC } from "react";

interface Props {
  pagination: {
    numberOfProducts: number;
    totalPage: number;
    currentPage: number;
    nextPage: number;
    prevPage: number;
  };
  category?: string;
  type: "user" | "admin";
}

const Paginations: FC<Props> = ({ pagination, category, type }) => {
  const totalPage = Array.from({ length: pagination?.totalPage });

  const nextPage = pagination?.totalPage === 1 ? 1 : pagination?.nextPage;
  const getCategoryQuery = category ? `&subcategory=${category}&&` : "";

  const paginationNextPage =
    type === "user"
      ? `/products?${getCategoryQuery}page=${nextPage}`
      : `/dashboard/products?page=${nextPage}`;

  const paginationPrevPage =
    type === "user"
      ? `/products?${getCategoryQuery}page=${pagination?.prevPage}`
      : `/dashboard/products?page=${pagination?.prevPage}`;

  return (
    <div className="overflow-x-hidden">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={paginationPrevPage} />
          </PaginationItem>

          {totalPage.map((_, index: number) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={
                  type === "user"
                    ? `/products?${getCategoryQuery}page=${index + 1}`
                    : `/dashboard/products?page=${index + 1}`
                }
                isActive={index + 1 === pagination?.currentPage}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={paginationNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginations;
