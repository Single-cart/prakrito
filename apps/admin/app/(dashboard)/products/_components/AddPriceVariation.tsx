/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FC, useEffect } from "react";
import { useFieldArray } from "react-hook-form";

interface AddPriceVariationProps {
  // form: UseFormReturn<z.infer<typeof productZodSchema.ProductSchema>>;
  form: any;
}

const AddPriceVariation: FC<AddPriceVariationProps> = ({ form }) => {
  const {
    fields: priceVariationFields,
    append: appendPriceVariation,
    remove: removePriceVariation,
  } = useFieldArray({
    control: form.control,
    name: "priceVariation",
  });

  // Add at least one price variation by default if none exists
  useEffect(() => {
    if (priceVariationFields.length === 0) {
      appendPriceVariation({
        price: 0,
        quantity: "",
        available: true,
      });
    }
  }, [appendPriceVariation, priceVariationFields.length]);

  const addNewPriceVariation = () => {
    appendPriceVariation({
      price: 0,
      quantity: "",
      available: true,
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="w-full border border-dashed hover:bg-primary-foreground font-semibold text-sm p-3 rounded-md">
          Add Sizes & Colors
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Price Variation</DialogTitle>
          </DialogHeader>

          {/* Price Variations */}
          <div>
            <FormLabel>Price Variation</FormLabel>
            {priceVariationFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <FormField
                  name={`priceVariation.${index}.price`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Price" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={`priceVariation.${index}.quantity`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={`priceVariation.${index}.available`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value: string) =>
                            field.onChange(value === "true")
                          }
                          value={field.value ? "true" : "false"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Stock" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">In Stock</SelectItem>
                            <SelectItem value="false">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="sm"
                  type="button"
                  className="bg-red-500 text-white"
                  onClick={() => removePriceVariation(index)}
                  disabled={priceVariationFields.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              className="w-full mt-4"
              type="button"
              onClick={addNewPriceVariation}
            >
              Add Price Variation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPriceVariation;
