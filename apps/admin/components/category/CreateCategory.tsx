"use client";

import { LoadingButton } from "@/components/LoaderButton";
import {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
} from "@/redux/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tags } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category Name is Required"),
});

interface CreateCategoryProps {
  onSuccess?: () => void;
}

const CreateCategory = ({ onSuccess }: CreateCategoryProps) => {
  const [createCategory, { isLoading, isSuccess, error }] =
    useCreateCategoryMutation();
  const { refetch } = useGetAllCategoryQuery({});

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateCategory = async (
    value: z.infer<typeof createCategorySchema>
  ) => {
    await createCategory({
      data: value,
    });
    await refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Category created successfully");
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
          onSubmit={form.handleSubmit(handleCreateCategory)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Category Name
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Tags className="h-4 w-4 text-blue-500" />
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      className="w-full"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              <Button type="submit">Create Category</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCategory;
