/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { useEffect } from "react";

const ShippingPriceSelection = ({
  form,
  onShippingChange,
  insideDhaka,
  outsideDhaka,
}: {
  form: any;
  onShippingChange: (price: number) => void;
  insideDhaka: number;
  outsideDhaka: number;
}) => {
  // Initialize shipping price on component mount
  useEffect(() => {
    // Set initial shipping price to outside Dhaka
    handleShippingChange("outside");
  }, []);

  const handleShippingChange = (value: string) => {
    const shippingPrice = value === "inside" ? insideDhaka : outsideDhaka;
    onShippingChange(shippingPrice);
  };

  return (
    <FormField
      control={form.control}
      name="shippingLocation"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <Label>Delivery Location</Label>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                handleShippingChange(value);
              }}
              defaultValue={field.value || "outside"}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="inside" id="inside" />
                <Label htmlFor="inside" className="font-normal">
                  Inside Dhaka (৳{insideDhaka})
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="outside" id="outside" />
                <Label htmlFor="outside" className="font-normal">
                  Outside Dhaka (৳{outsideDhaka})
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ShippingPriceSelection;
