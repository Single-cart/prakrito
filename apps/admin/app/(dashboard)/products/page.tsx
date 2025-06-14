/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import debounce from "lodash/debounce";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Plus,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import NavHeader from "@/components/nav-header";
import { getImgUrl } from "@/lib/getImgPath";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";

// Dynamically import ProductAction with no SSR
const ProductAction = dynamic(
  () => import("../../../components/ProductAction"),
  {
    ssr: false,
    loading: () => (
      <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
    ),
  }
);

const ProductTable = () => {
  const [isClient, setIsClient] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState({
    page: "1",
    limit: "10",
    search: "",
    category: "",
    subcategory: "",
    minPrice: "",
    maxPrice: "",
    ratings: "0",
  });

  // Transform query params to remove empty strings
  const transformedQuery = useMemo(() => {
    return Object.entries(queryParams).reduce(
      (acc, [key, value]) => {
        if (
          value !== "" &&
          value !== "0" &&
          value !== undefined &&
          value !== null
        ) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }, [queryParams]);

  const {
    data,
    isLoading,
    error: queryError,
  } = useGetAllProductsQuery(transformedQuery, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Handle API errors
  useEffect(() => {
    if (queryError) {
      console.error("API Error:", queryError);
      setError("Failed to load products. Please try again later.");
    } else {
      setError(null);
    }
  }, [queryError]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({ ...prev, search: value, page: "1" }));
      }, 300),
    []
  );

  const debouncedFilter = useMemo(
    () =>
      debounce((type: string, value: string) => {
        setQueryParams((prev) => ({ ...prev, [type]: value, page: "1" }));
      }, 300),
    []
  );

  // Handle image loading errors
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (target.src !== "/placeholder-image.jpg") {
        target.src = "/placeholder-image.jpg";
      }
    },
    []
  );

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "order",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Order
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("order") || 0}</div>,
        sortingFn: "auto",
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="relative w-[60px] h-[60px]">
            {isClient && row.original?.images?.[0] && (
              <Image
                src={getImgUrl(row.original.images[0])}
                alt={row.original?.name || "Product image"}
                fill
                className="rounded-md object-cover"
                onError={handleImageError}
                sizes="60px"
                priority={false}
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <Link href={`#`} className="hover:underline text-blue-600">
            {row.original?.name || "Unnamed Product"}
          </Link>
        ),
      },
      {
        accessorKey: "stock",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Stock
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const stock = row.original?.stock || 0;
          return (
            <div
              className={`${parseInt(stock.toString()) <= 10 ? "text-red-500" : ""}`}
            >
              {stock}
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const priceVariation = row.original?.priceVariation;

          if (
            !priceVariation ||
            !Array.isArray(priceVariation) ||
            priceVariation.length === 0
          ) {
            return <span className="text-gray-400">No price</span>;
          }

          const amount = parseFloat(priceVariation[0]?.discountPrice || 0);
          const formatted = new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 0,
          }).format(amount);

          const firstQuantity = priceVariation[0]?.quantity || "Standard";

          return (
            <div className="flex flex-col">
              <span>{formatted}</span>
              <span className="text-xs text-gray-500">{firstQuantity}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => row.original?.category?.name || "No Category",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ProductAction product={row.original} />,
      },
    ],
    [isClient, handleImageError]
  );

  const table = useReactTable({
    data: data?.data?.products || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: data?.data?.pagination?.totalPage || -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Math.max(0, parseInt(queryParams.page) - 1),
        pageSize: parseInt(queryParams.limit),
      },
    },
  });

  // Clean up debounced functions
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedFilter.cancel();
    };
  }, [debouncedSearch, debouncedFilter]);

  const handleSearch = useCallback(
    (value: string) => {
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleFilter = useCallback(
    (type: string, value: string) => {
      debouncedFilter(type, value);
    },
    [debouncedFilter]
  );

  const handlePageChange = useCallback((page: string) => {
    const pageNum = parseInt(page);
    if (pageNum > 0) {
      setQueryParams((prev) => ({ ...prev, page: pageNum.toString() }));
    }
  }, []);

  const resetFilters = useCallback(() => {
    setQueryParams({
      page: "1",
      limit: "10",
      search: "",
      category: "",
      subcategory: "",
      minPrice: "",
      maxPrice: "",
      ratings: "0",
    });
    setError(null);
  }, []);

  const bread = [
    {
      href: "/",
      text: "Dashboard",
      last: false,
    },
    {
      href: "/products",
      text: "Products",
      last: true,
    },
  ];

  // Only render on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <NavHeader bread={bread} />
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-600 mb-2">
                Error Loading Products
              </h2>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button onClick={resetFilters} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <NavHeader bread={bread} />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product List</CardTitle>
              <CardDescription>
                Manage your products inventory, prices and details
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Link href="/products/create">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter products..."
                value={queryParams.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                  <div className="p-2 space-y-2">
                    <Input
                      placeholder="Min Price"
                      value={queryParams.minPrice}
                      onChange={(e) => handleFilter("minPrice", e.target.value)}
                      type="number"
                      min="0"
                    />
                    <Input
                      placeholder="Max Price"
                      value={queryParams.maxPrice}
                      onChange={(e) => handleFilter("maxPrice", e.target.value)}
                      type="number"
                      min="0"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Rating</DropdownMenuLabel>
                  <div className="p-2">
                    <Input
                      placeholder="Minimum Rating"
                      value={queryParams.ratings}
                      onChange={(e) => handleFilter("ratings", e.target.value)}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing {data?.data?.products?.length || 0} of{" "}
                  {data?.data?.pagination?.numberOfProducts || 0} products
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(
                        (parseInt(queryParams.page) - 1).toString()
                      )
                    }
                    disabled={queryParams.page === "1" || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {queryParams.page} of{" "}
                    {data?.data?.pagination?.totalPage || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(
                        (parseInt(queryParams.page) + 1).toString()
                      )
                    }
                    disabled={
                      parseInt(queryParams.page) >=
                        (data?.data?.pagination?.totalPage || 0) || isLoading
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTable;
