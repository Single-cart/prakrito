/* eslint-disable react-hooks/exhaustive-deps */
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

// Define a type for the location values
type LocationType = "inside" | "outside";

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
  // Explicitly type the defaultLocation
  const defaultLocation = "outside" as LocationType;

  const handleShippingChange = (value: LocationType) => {
    const shippingPrice = value === "inside" ? insideDhaka : outsideDhaka;
    onShippingChange(shippingPrice);
  };

  // Initialize shipping price and form value on component mount
  useEffect(() => {
    // Set initial value in the form
    form.setValue("shippingLocation", defaultLocation, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Set initial shipping price based on default location
    handleShippingChange(defaultLocation);
  }, []);

  // Update shipping price when inside/outside prices change
  useEffect(() => {
    const currentLocation = form.getValues("shippingLocation") as LocationType;
    handleShippingChange(currentLocation);
  }, [insideDhaka, outsideDhaka]);

  return (
    <FormField
      control={form.control}
      name="shippingLocation"
      defaultValue={defaultLocation}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <Label>Delivery Location</Label>
          <FormControl>
            <RadioGroup
              onValueChange={(value: LocationType) => {
                field.onChange(value);
                handleShippingChange(value);
              }}
              value={field.value}
              defaultValue={defaultLocation}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="inside" id="inside" />
                <Label htmlFor="inside" className="font-normal">
                  ঢাকার ভিতরে (৳{insideDhaka})
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="outside" id="outside" />
                <Label htmlFor="outside" className="font-normal">
                  ঢাকার বাহিরে (৳{outsideDhaka})
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
