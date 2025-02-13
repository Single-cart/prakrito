/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { FC } from "react";
import { useSelector } from "react-redux";
import ProductDesc from "../_components/ProductDesc";

type Props = {
  localImages: File[];
};

const ProductFormPreview: FC<Props> = ({ localImages }) => {
  const { productCreateData } = useSelector((state: any) => state.product);

  return (
    <div className="p-6 bg-white shadow-md rounded-md space-y-4">
      {/* Product Name */}
      <h1 className="text-2xl font-bold text-gray-800">
        {productCreateData?.name}
      </h1>

      {/* Price and Discount */}
      <div className="flex items-center space-x-4">
        <span className="text-xl font-semibold text-gray-800">
          ${productCreateData?.discountPrice}
        </span>
        {productCreateData?.price && (
          <span className="text-xl font-semibold text-red-500 line-through">
            ${productCreateData?.price}
          </span>
        )}
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

      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">
          Available Colors
        </h3>
        <div className="flex space-x-4 mt-2">
          {productCreateData?.colors?.map((color: any, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-700"
            >
              {color.name} - {color.stock ? "In Stock" : "Out of Stock"}
            </span>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Available Sizes</h3>
        <div className="flex space-x-4 mt-2">
          {productCreateData?.size?.map((size: any, index: number) => (
            <span
              key={index}
              className="px-4 text-sm py-2 bg-gray-200 rounded-md text-gray-700"
            >
              {size.name} - {size.available ? "Available" : "Unavailable"}
            </span>
          ))}
        </div>
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
