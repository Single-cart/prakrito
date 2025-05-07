"use client";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getImgUrl } from "@/lib/getImgPath";
import { Badge } from "@workspace/ui/components/badge";
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
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import Image from "next/image";

import LandingAction from "@/components/LandingAction";
import NavHeader from "@/components/nav-header";
import { useGetLandingsQuery } from "@/redux/features/landing/landingApi";

const Landing = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading } = useGetLandingsQuery(void 0, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "order",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("order")}</div>,
      sortingFn: "auto",
    },
    {
      accessorKey: "heading",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Heading
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("heading")}</div>
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original.product;

        if (!product) return <div className="text-gray-500">No Product</div>;

        return (
          <div className="flex items-center space-x-3">
            {product.images?.[0] && (
              <div className="relative h-10 w-10 overflow-hidden rounded border bg-gray-50">
                <Image
                  src={getImgUrl(product.images[0])}
                  alt={product.name}
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                  className="rounded"
                />
              </div>
            )}
            <Link
              href={`/products/${product._id}`}
              className="hover:underline text-blue-600"
            >
              {product.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price Variation",
      cell: ({ row }) => {
        const product = row.original.product;

        if (
          !product ||
          !product.priceVariation ||
          product.priceVariation.length === 0
        ) {
          return <div className="text-gray-500">No pricing</div>;
        }

        // Get first price variation
        const firstVariation = product.priceVariation[0];
        const amount = parseFloat(firstVariation?.discountPrice || 0);
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "BDT",
        }).format(amount);

        return (
          <div className="flex flex-col">
            <span className="font-medium">{formatted}</span>
            {firstVariation.quantity && (
              <Badge className="mt-1 bg-blue-100 text-blue-800 self-start">
                {firstVariation.quantity}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
            row.getValue("isActive")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <LandingAction landing={row.original} />,
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const bread = [
    {
      href: "/",
      text: "Dashboard",
      last: false,
    },
    {
      href: "/landings",
      text: "Landing Pages",
      last: true,
    },
  ];

  return (
    <div className="">
      <NavHeader bread={bread} />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Landing Pages</CardTitle>
              <CardDescription>
                Manage your dynamic landing pages for products
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Link href="/landing/create">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Landing Page
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end py-4">
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
                          No landing pages found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {data?.data.length || 0} landing pages in total
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
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

export default Landing;
