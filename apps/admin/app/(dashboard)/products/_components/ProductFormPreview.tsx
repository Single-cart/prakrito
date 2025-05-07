/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import Image from "next/image";
import { FC } from "react";
import { useSelector } from "react-redux";
import ProductDesc from "../_components/ProductDesc";

type Props = {
  localImages: File[];
};

const ProductFormPreview: FC<Props> = ({ localImages }) => {
  const { productCreateData } = useSelector((state: any) => state.product);
  console.log(productCreateData);
  return (
    <div className="p-6 bg-white shadow-md rounded-md space-y-4">
      {/* Product Name */}
      <h1 className="text-2xl font-bold text-gray-800">
        {productCreateData?.name}
      </h1>

      {/* Price and Discount */}
      <div className="w-full mt-4">
        <h3 className="text-lg font-semibold mb-2">Price Variations</h3>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price</TableHead>
                <TableHead>Discount Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productCreateData?.priceVariation?.map(
                (
                  variation: {
                    price: number;
                    discountPrice: number;
                    quantity: string;
                    available: boolean;
                  },
                  index: number
                ) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      ${variation.price}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${variation.discountPrice}
                    </TableCell>
                    <TableCell>{variation.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          variation.available ? "default" : "destructive"
                        }
                        className={
                          variation.available
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {variation.available ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Description */}
      <div className="border border-dashed">
        <h2 className="text-lg font-semibold text-gray-700">Description</h2>
        <ProductDesc productDesc={productCreateData?.description} />
      </div>

      {/* Stock and Shipping */}
      <div className="flex items-center space-x-6">
        <span className="text-gray-700">Stock: {productCreateData?.stock}</span>
        <span className="text-gray-700">
          inside Dhaka: ${productCreateData?.insideDhaka}
        </span>
        <span className="text-gray-700">
          outside Dhaka: ${productCreateData?.outsideDhaka}
        </span>
      </div>

      {/* Local Images */}
      {localImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Images</h3>
          <div className="flex space-x-4 mt-2">
            {localImages.map((image, index) => (
              <Image
                key={index}
                src={URL.createObjectURL(image)}
                alt="Product"
                height={128}
                width={128}
                className="w-32 h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormPreview;
