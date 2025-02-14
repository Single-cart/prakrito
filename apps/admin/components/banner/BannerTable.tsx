"use clint";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { ImageIcon, Layout, LayoutGrid } from "lucide-react";
import BannerTableRow from "./BannerTableRow";

interface BannerTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  banners: any[];
  isLoading: boolean;
  type: "main" | "category" | "top";
  showCategory?: boolean;
}

const BannerTable = ({
  banners,
  isLoading,
  type,
  showCategory,
}: BannerTableProps) => {
  const icons = {
    main: Layout,
    category: LayoutGrid,
    top: ImageIcon,
  };

  const Icon = icons[type];
  console.log(banners);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-500" />
          {type.charAt(0).toUpperCase() + type.slice(1)} Banners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Desktop Banner</TableHead>
              <TableHead>Mobile Banner</TableHead>
              {showCategory && <TableHead>Category</TableHead>}
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={showCategory ? 5 : 4}
                  className="text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showCategory ? 5 : 4}
                  className="text-center"
                >
                  No {type} banners found
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <BannerTableRow
                  key={banner._id}
                  banner={banner}
                  showCategory={showCategory}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BannerTable;
