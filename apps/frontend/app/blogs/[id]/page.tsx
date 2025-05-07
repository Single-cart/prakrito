/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getImgUrl } from "@/lib/getImgPath";
import { formatDate } from "@/lib/utils";
import { useGetBlogByIdQuery } from "@/redux/features/blog/blogApi";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { AlertCircle, ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Helper function to safely render HTML content
const RenderHtml = ({ html }: { html: string }) => {
  try {
    const content = JSON.parse(html);
    console.log("Content from blog:", content);

    if (!content || !content.blocks) {
      return <p>No content available</p>;
    }

    return (
      <div className="blog-content">
        {content.blocks.map((block: any, index: number) => {
          switch (block.type) {
            case "header": {
              const TagName =
                `h${block.data.level}` as keyof JSX.IntrinsicElements;
              return (
                <TagName key={index} className="mt-6 mb-4 font-bold">
                  {block.data.text}
                </TagName>
              );
            }
            case "paragraph":
              return (
                <p
                  key={index}
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
                />
              );
            case "list":
              if (block.data.style === "ordered") {
                return (
                  <ol key={index} className="list-decimal pl-6 mb-4">
                    {block.data.items.map((item: any, i: number) => {
                      // Handle both string and object items
                      const content =
                        typeof item === "string"
                          ? item
                          : item?.text || item?.content || JSON.stringify(item);
                      return (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      );
                    })}
                  </ol>
                );
              } else {
                return (
                  <ul key={index} className="list-disc pl-6 mb-4">
                    {block.data.items.map((item: any, i: number) => {
                      // Handle both string and object items
                      const content =
                        typeof item === "string"
                          ? item
                          : item?.text || item?.content || JSON.stringify(item);
                      return (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      );
                    })}
                  </ul>
                );
              }
            case "table":
              return (
                <div key={index} className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      {(block.data.content || []).map(
                        (row: any[], rowIndex: number) => (
                          <tr key={rowIndex}>
                            {(row || []).map((cell, cellIndex) => {
                              const cellContent =
                                typeof cell === "string"
                                  ? cell
                                  : cell?.text || cell?.content || "";
                              return (
                                <td
                                  key={cellIndex}
                                  className="border border-gray-300 p-2"
                                  dangerouslySetInnerHTML={{
                                    __html: cellContent,
                                  }}
                                />
                              );
                            })}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              );
            default:
              // Handle any other block types
              try {
                const content =
                  typeof block.data.text === "string"
                    ? block.data.text
                    : block.data.content || JSON.stringify(block.data);
                return (
                  <div key={index} className="mb-4">
                    {content}
                  </div>
                );
              } catch (e) {
                console.error("Error rendering block:", e, block);
                return (
                  <div key={index} className="mb-4 text-red-500">
                    Error rendering content
                  </div>
                );
              }
          }
        })}
      </div>
    );
  } catch (error) {
    console.error("Failed to render content:", error);
    return <p className="text-red-500">Failed to render content</p>;
  }
};

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

const BlogDetail = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);

  const {
    data: blogResponse,
    isLoading,
    error,
  } = useGetBlogByIdQuery(
    { id, updateViews: true },
    {
      skip: !id,
    }
  );

  useEffect(() => {
    if (blogResponse && blogResponse.data) {
      setBlog(blogResponse.data);
    }
  }, [blogResponse]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load this blog post. It may have been removed or
            you may have followed a broken link.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/blogs">
            <Button>Browse All Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {blog.featuredImage && (
          <div className="relative w-full h-[400px]">
            <Image
              src={getImgUrl(blog.featuredImage)}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            {blog.category && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{blog.category.name}</span>
              </div>
            )}

            {blog.createdAt && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            )}

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{blog.isPublished ? "Published" : "Draft"}</span>
            </div>
          </div>

          {blog.summary && (
            <>
              <div className="text-lg font-medium text-gray-700 mb-6">
                {blog.summary}
              </div>
              <Separator className="my-6" />
            </>
          )}

          <div className="prose prose-gray max-w-none">
            {blog.content ? (
              <RenderHtml html={blog.content} />
            ) : (
              <p className="text-gray-500">
                No content available for this blog post.
              </p>
            )}
          </div>
        </div>
      </article>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Continue Reading</h2>
        <Card className="p-6">
          <p className="mb-4">Looking for more content?</p>
          <Link href="/blogs">
            <Button>Browse All Blogs</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail;
