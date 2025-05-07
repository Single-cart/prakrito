/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { useEffect, useState } from "react";
import { LoadingButton } from "./LoaderButton";

type Props = {
  selectItem: any;
  minShippingPrice: number;
  isLoading: boolean;
};

const Orders = ({ selectItem, minShippingPrice, isLoading }: Props) => {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentShippingPrice, setCurrentShippingPrice] =
    useState(minShippingPrice);

  // Calculate subtotal whenever items change
  useEffect(() => {
    const calculatedSubtotal =
      selectItem?.reduce((acc: number, item: any) => {
        const selectedVariation =
          item?.product?.priceVariation?.[item?.priceVariationIndex - 1];
        const itemPrice = selectedVariation?.discountPrice || 0;
        return acc + itemPrice * (item?.quantity || 1);
      }, 0) || 0;

    setSubtotal(calculatedSubtotal);
  }, [selectItem]);

  // Update shipping price when it changes
  useEffect(() => {
    setCurrentShippingPrice(minShippingPrice);
  }, [minShippingPrice]);

  // Update total whenever subtotal or shipping price changes
  useEffect(() => {
    const newTotal = subtotal + currentShippingPrice;
    setTotal(newTotal);
  }, [subtotal, currentShippingPrice]);

  return (
    <div>
      <table className="w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 text-start">
              Product Info
            </th>
            <th className="border border-gray-400 p-2 text-start">Amount</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {selectItem?.map((item: any, index: number) => {
            const selectedVariation =
              item?.product?.priceVariation?.[item?.priceVariationIndex - 1];
            const itemPrice = selectedVariation?.discountPrice || 0;
            const quantity = item?.quantity || 1;

            return (
              <tr key={item.productId + index}>
                <td className="border border-gray-400 p-2 flex items-center justify-between">
                  <span>
                    {item?.product?.name}{" "}
                    <span className="font-bold text-sm font-sans">
                      x {quantity}
                    </span>
                    {selectedVariation && (
                      <span className="text-sm text-gray-600 ml-2">
                        ({selectedVariation.quantity})
                      </span>
                    )}
                  </span>
                </td>
                <td className="border border-gray-400 p-2">
                  ৳{(itemPrice * quantity).toFixed(2)}
                </td>
              </tr>
            );
          })}
          <tr className="font-semibold">
            <td className="border border-gray-400 p-2">Subtotal</td>
            <td className="border border-gray-400 p-2">
              ৳{subtotal.toFixed(2)}
            </td>
          </tr>
          <tr className="font-semibold">
            <td className="border border-gray-400 p-2">Shipping Charge</td>
            <td className="border border-gray-400 p-2">
              {currentShippingPrice === 0
                ? "Free"
                : `৳${currentShippingPrice.toFixed(2)}`}
            </td>
          </tr>
          <tr className="font-semibold">
            <td className="border border-gray-400 p-2">Total</td>
            <td className="border border-gray-400 p-2">৳{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="bg-gray-200 mt-6 p-4">
        <div className="flex items-center gap-1">
          <input defaultChecked type="radio" name="delivery" id="" />
          <Label className="text-lg">Cash on delivery</Label>
        </div>
        <Separator />

        <div className="mt-4">
          <p className="text-sm">
            Your personal data will be used to process your order, support your
            experience throughout this website
          </p>
        </div>

        <div className="flex justify-end mt-6">
          {isLoading ? <LoadingButton /> : <Button>Confirm Order</Button>}
        </div>
      </div>
    </div>
  );
};

export default Orders;
