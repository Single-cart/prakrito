"use client";

import { getImgUrl } from "@/lib/getImgPath";
import { useGetAllBlogsQuery } from "@/redux/features/blog/blogApi";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  isPublished: boolean;
  createdAt: string;
  featuredImage: string;
  category?: {
    _id: string;
    name: string;
  };
}

const Blogs = () => {
  const [localBlogs, setLocalBlogs] = useState<Blog[]>([]);
  const { data: blogsResponse, isLoading, error } = useGetAllBlogsQuery({});

  useEffect(() => {
    // Handle different response structures
    if (blogsResponse && blogsResponse.data) {
      if (Array.isArray(blogsResponse.data)) {
        setLocalBlogs(blogsResponse.data);
      } else if (
        blogsResponse.data.blogs &&
        Array.isArray(blogsResponse.data.blogs)
      ) {
        setLocalBlogs(blogsResponse.data.blogs);
      } else {
        console.error("Unexpected blogs data structure:", blogsResponse.data);
        setLocalBlogs([]);
      }
    }
  }, [blogsResponse]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Our Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full flex flex-col">
              <div className="relative w-full h-48 bg-gray-200">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error Loading Blogs</h2>
          <p>We couldn&apos;t load the blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (localBlogs.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Our Blog</h1>
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">No Blog Posts Yet</h2>
          <p className="text-gray-500 mb-4">Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localBlogs.map((blog: Blog) => (
          <Card
            key={blog._id}
            className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-48 overflow-hidden">
              {blog.featuredImage ? (
                <Image
                  src={getImgUrl(blog.featuredImage)}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <CardHeader>
              <CardDescription>
                {blog.category?.name || "Uncategorized"} •{" "}
                {blog.createdAt
                  ? formatDistanceToNow(new Date(blog.createdAt), {
                      addSuffix: true,
                    })
                  : "Recently"}
              </CardDescription>
              <CardTitle className="line-clamp-1 h-[40px]">
                {blog.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 line-clamp-1">{blog.summary}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/blogs/${blog._id}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
