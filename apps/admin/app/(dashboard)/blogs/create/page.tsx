"use client";

import "@/app/richTextEditor.css";
import { useCreateBlogMutation } from "@/redux/features/blog/blogApi";
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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().min(1, "Blog summary is required"),
  category: z.string().min(1, "Category is required"),
  isPublished: z.boolean().default(false),
  featuredImage: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Featured image is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Dynamic import of the rich text editor component to avoid SSR issues
const BlogEditor = dynamic(() => import("@/components/BlogEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[300px] border rounded-md p-4 bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});

const CreateBlog = () => {
  const router = useRouter();
  const { data: categoriesResponse } = useGetAllCategoryQuery({});
  const categories = categoriesResponse?.data;
  const [createBlog, { isLoading, isSuccess }] = useCreateBlogMutation();

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

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("summary", values.summary);
      formData.append("category", values.category);
      formData.append("isPublished", String(values.isPublished));

      if (values.featuredImage && values.featuredImage.length > 0) {
        const file = values.featuredImage[0];
        if (file) {
          formData.append("featuredImage", file);
        }
      }

      await createBlog({ data: formData }).unwrap();
    } catch (error: any) {
      console.error("Blog creation error:", error);
      if (error.data && Array.isArray(error.data)) {
        toast.error(error.data[0]?.message || "Failed to create blog");
      } else if (error.error) {
        toast.error(error.error || "Failed to create blog");
      } else {
        toast.error(error.data?.message || "Failed to create blog");
      }
    }
  };

  // Handle success with a timeout to ensure proper cleanup
  useEffect(() => {
    if (isSuccess) {
      toast.success("Blog created successfully");
      const redirectTimer = setTimeout(() => {
        router.push("/blogs");
      }, 300);

      return () => clearTimeout(redirectTimer);
    }
  }, [isSuccess, router]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Blog</h1>
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
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...rest}
                  />
                </FormControl>
                <FormDescription>
                  Upload a featured image for your blog post
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
                      key="create-blog-editor"
                      editorId="create-blog-editor"
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

              return (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category">
                          {selectedCategory?.name || "Select a category"}
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
              return (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const boolValue = value === "true";
                      field.onChange(boolValue);
                    }}
                    value={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status">
                          {field.value ? "Published" : "Draft"}
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
              {isLoading ? "Creating..." : "Create Blog"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlog;
