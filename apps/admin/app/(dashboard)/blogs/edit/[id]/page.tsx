/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "@/app/richTextEditor.css";
import { getImgUrl } from "@/lib/getImgPath";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/redux/features/blog/blogApi";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

// Dynamic import of the rich text editor component to avoid SSR issues
const BlogEditor = dynamic(() => import("@/components/BlogEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[300px] border rounded-md p-4 bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().min(1, "Blog summary is required"),
  category: z.string().min(1, "Category is required"),
  isPublished: z.boolean().default(false),
  featuredImage: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditBlog = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { data: blogResponse, isLoading: isLoadingBlog } = useGetBlogByIdQuery(
    id,
    {
      skip: !id,
    }
  );
  const blog = blogResponse?.data;
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetAllCategoryQuery({});
  const categories = categoriesResponse?.data;
  const [updateBlog, { isLoading, isSuccess }] = useUpdateBlogMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      category: "",
      isPublished: false,
    },
  });

  // Load form data when blog data is available
  useEffect(() => {
    if (blog) {
      const categoryId = blog.category?._id || "";
      const isPublished = blog.isPublished === true;

      // Reset the form with all values
      form.reset({
        title: blog.title || "",
        content: blog.content || "",
        summary: blog.summary || "",
        category: categoryId,
        isPublished: isPublished,
      });
    }
  }, [blog, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) {
        toast.error("Blog ID is missing");
        return;
      }

      const formValues = {
        ...values,
        isPublished:
          typeof values.isPublished === "boolean"
            ? values.isPublished
            : blog?.isPublished === true,
      };

      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("content", formValues.content);
      formData.append("summary", formValues.summary);
      formData.append("category", formValues.category);
      formData.append("isPublished", String(formValues.isPublished));

      if (values.featuredImage && values.featuredImage.length > 0) {
        const file = values.featuredImage[0];
        if (file) {
          formData.append("featuredImage", file);
        }
      }

      await updateBlog({
        id,
        data: formData,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Blog updated successfully");
      const redirectTimer = setTimeout(() => {
        router.push("/blogs");
      }, 300);

      return () => clearTimeout(redirectTimer);
    }
  }, [isSuccess, router]);

  if (!id) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-semibold">Error: Missing blog ID</p>
          <p className="mt-2">Unable to edit blog because the ID is missing.</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/blogs")}
          >
            Return to blogs
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingBlog || isCategoriesLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading blog data...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-semibold">Error: Blog not found</p>
          <p className="mt-2">
            The blog you are trying to edit doesn&apos;t exist or has been
            deleted.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/blogs")}
          >
            Return to blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/blogs")}
          >
            Back to Blogs
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a brief summary of the blog"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short description that summarizes the blog content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featuredImage"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                {blog?.featuredImage && (
                  <div className="mb-2">
                    <div className="relative w-32 h-32 rounded-md overflow-hidden">
                      <Image
                        src={getImgUrl(blog.featuredImage)}
                        alt="Current featured image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Current image</p>
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...rest}
                  />
                </FormControl>
                <FormDescription>
                  Upload a new featured image to replace the current one
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="min-h-[300px]">
                    <BlogEditor
                      key={`edit-blog-${id}`}
                      editorId={`edit-blog-${id}`}
                      initialContent={field.value}
                      onChange={(content) => {
                        field.onChange(content);
                      }}
                      placeholder="Write your blog content here..."
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Write your blog content using the rich text editor. You can
                  add headers, lists, links, and more.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              const selectedCategory = categories?.find(
                (c: { _id: string; name: string }) => c._id === field.value
              );
              const effectiveValue = field.value || blog?.category?._id || "";

              return (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={effectiveValue}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category">
                          {selectedCategory?.name ||
                            categories?.find(
                              (c: { _id: string; name: string }) =>
                                c._id === effectiveValue
                            )?.name ||
                            "Select a category"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map(
                        (category: { _id: string; name: string }) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => {
              const valueToUse =
                field.value === undefined
                  ? blog?.isPublished === true
                  : field.value === true;

              return (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const boolValue = value === "true";
                      field.onChange(boolValue);
                    }}
                    value={valueToUse ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status">
                          {valueToUse ? "Published" : "Draft"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Published</SelectItem>
                      <SelectItem value="false">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/blogs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Blog"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditBlog;
