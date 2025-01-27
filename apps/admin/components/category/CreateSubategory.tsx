"use client";

import { LoadingButton } from "@/components/LoaderButton";
import {
  useCreateSubcategoryMutation,
  useGetAllCategoryQuery,
} from "@/redux/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryType } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
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
import { Layers } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const createSubcategorySchema = z.object({
  name: z.string().min(1, "Subcategory Name is Required"),
  category: z.string().min(1, "Category is required"),
});

interface CreateSubcategoryProps {
  onSuccess?: () => void;
}

const CreateSubcategory = ({ onSuccess }: CreateSubcategoryProps) => {
  const { refetch, data } = useGetAllCategoryQuery({});
  const [createSubcategory, { isLoading, isSuccess, error }] =
    useCreateSubcategoryMutation();

  const category = data?.data as
    | categoryType.ICategorySubcategory[]
    | undefined;

  const form = useForm<z.infer<typeof createSubcategorySchema>>({
    resolver: zodResolver(createSubcategorySchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const handleCreatesubCategory = async (
    value: z.infer<typeof createSubcategorySchema>
  ) => {
    await createSubcategory({
      data: value,
    });
    await refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Subcategory created successfully");
      form.reset();
      onSuccess?.();
    } else if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [error, form, isSuccess, onSuccess]);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreatesubCategory)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Parent Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category?.map((item) => (
                        <SelectItem
                          value={item?._id.toString()}
                          key={item?._id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-blue-500" />
                            {item?.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Subcategory Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subcategory name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onSuccess?.();
              }}
            >
              Cancel
            </Button>
            {isLoading ? (
              <LoadingButton />
            ) : (
              <Button type="submit">Create Subcategory</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSubcategory;
