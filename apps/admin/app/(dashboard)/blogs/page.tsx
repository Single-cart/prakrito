/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDate } from "@/lib/utils";
import {
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
} from "@/redux/features/blog/blogApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Blogs = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const { data, isLoading, error } = useGetAllBlogsQuery(
    {},
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  // Access blogs from the nested data structure
  const blogs = data?.data?.blogs || [];
  const hasBlogs = Array.isArray(blogs) && blogs.length > 0;

  const handleDeleteClick = (blogId: string) => {
    setBlogToDelete(blogId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    try {
      const result = await deleteBlog(blogToDelete).unwrap();

      if (result.success) {
        toast.success("Blog deleted successfully");
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
      } else {
        toast.error(result.message || "Failed to delete blog");
      }
    } catch (error: any) {
      console.error("Blog deletion error:", error);
      if (error.data && Array.isArray(error.data)) {
        // Handle array of errors
        toast.error(error.data[0]?.message || "Failed to delete blog");
      } else if (error.error) {
        // RTK Query error format
        toast.error(error.error || "Failed to delete blog");
      } else {
        toast.error(error.data?.message || "Failed to delete blog");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/blogs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          <p className="font-semibold">Error loading blogs</p>
          <p className="text-sm">
            {(error as any)?.data?.message || "Failed to fetch blogs"}
          </p>
        </div>
      )}

      {!hasBlogs && !isLoading && !error && (
        <div className="text-center py-8 bg-gray-50 rounded-md border">
          <p className="text-gray-500 mb-4">No blogs found</p>
          <Link href="/blogs/create">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create your first blog
            </Button>
          </Link>
        </div>
      )}

      {hasBlogs && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog: any) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    {blog.category?.name || "Uncategorized"}
                  </TableCell>
                  <TableCell>{blog.author?.fullName || "Unknown"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(blog.createdAt)}</TableCell>
                  <TableCell>{blog.views || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/blogs/edit/${blog._id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(blog._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Blogs;
