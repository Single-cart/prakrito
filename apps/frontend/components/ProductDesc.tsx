"use client";

import "@/app/richTextEditor.css";
import type DOMPurifyType from "dompurify";
import { JSX, useEffect, useState } from "react";

// Define types for EditorJS blocks
interface BaseBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  data: {
    text: string;
  };
}

interface HeaderBlock extends BaseBlock {
  type: "header";
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

interface ListBlock extends BaseBlock {
  type: "list";
  data: {
    // Update the items type to handle both string and object formats
    items: Array<
      string | { content: string; items?: Array<string | { content: string }> }
    >;
    style?: "ordered" | "unordered";
  };
}

interface LinkToolBlock extends BaseBlock {
  type: "linkTool";
  data: {
    link: string;
  };
}

interface TableBlock extends BaseBlock {
  type: "table";
  data: {
    content: string[][];
  };
}

type EditorBlock =
  | ParagraphBlock
  | HeaderBlock
  | ListBlock
  | LinkToolBlock
  | TableBlock;

interface EditorContent {
  blocks: EditorBlock[];
}

// DOMPurify instance
let DOMPurify: typeof DOMPurifyType | null = null;

interface ProductDescProps {
  productDesc: string;
}

interface LinkToolBlock extends BaseBlock {
  type: "linkTool";
  data: {
    link: string;
  };
}

interface TableBlock extends BaseBlock {
  type: "table";
  data: {
    content: string[][];
  };
}

function isLinkToolBlock(block: EditorBlock): block is LinkToolBlock {
  return block.type === "linkTool" && "link" in block.data;
}

function isTableBlock(block: EditorBlock): block is TableBlock {
  return block.type === "table" && "content" in block.data;
}

function ProductDesc({ productDesc }: ProductDescProps) {
  const [parsedDescription, setParsedDescription] =
    useState<EditorContent | null>(null);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeContent = async () => {
      try {
        const purify = await import("dompurify");
        DOMPurify = purify.default;
        const parsed = JSON.parse(productDesc || "{}") as EditorContent;
        setParsedDescription(parsed);
      } catch (error) {
        console.error("Error initializing content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeContent();
  }, [productDesc]);

  const sanitize = (html: string): { __html: string } => {
    if (typeof window !== "undefined" && DOMPurify) {
      return { __html: DOMPurify.sanitize(html) };
    }
    return { __html: "" };
  };

  const renderListItem = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any,
    index: number,
    blockId: string
  ) => {
    // Debug log to see the item structure
    console.log("List item:", item);

    if (typeof item === "string") {
      return (
        <li
          key={`${blockId}-${index}`}
          className="text-gray-600"
          dangerouslySetInnerHTML={sanitize(item)}
        />
      );
    }

    // Handle cases where item is an object with HTML content
    if (item && typeof item === "object") {
      // If item has HTML content
      if ("html" in item) {
        return (
          <li
            key={`${blockId}-${index}`}
            className="text-gray-600"
            dangerouslySetInnerHTML={sanitize(item.html)}
          />
        );
      }

      // If item has content property
      if ("content" in item) {
        return (
          <li
            key={`${blockId}-${index}`}
            className="text-gray-600"
            dangerouslySetInnerHTML={sanitize(item.content)}
          />
        );
      }

      // If item is stringifiable
      if (item.toString) {
        return (
          <li key={`${blockId}-${index}`} className="text-gray-600">
            {item.toString()}
          </li>
        );
      }
    }

    // Fallback for any other case
    return (
      <li key={`${blockId}-${index}`} className="text-gray-600">
        {JSON.stringify(item)}
      </li>
    );
  };

  const renderBlock = (block: EditorBlock): JSX.Element | null | undefined => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={block.id}
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={sanitize(block.data.text)}
          />
        );

      case "header": {
        const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        const headerSizes = {
          1: "text-4xl",
          2: "text-3xl",
          3: "text-2xl",
          4: "text-xl",
          5: "text-lg",
          6: "text-base",
        };

        return (
          <HeaderTag
            key={block.id}
            className={`${headerSizes[block.data.level]} font-semibold my-4`}
            dangerouslySetInnerHTML={sanitize(block.data.text)}
          />
        );
      }

      case "list": {
        if (!Array.isArray(block.data.items)) {
          console.error("List items is not an array:", block.data.items);
          return null;
        }

        const ListTag = block.data.style === "ordered" ? "ol" : "ul";
        const listClass =
          block.data.style === "ordered" ? "list-decimal" : "list-disc";

        return (
          <ListTag
            key={block.id}
            className={`${listClass} ml-6 space-y-2 my-4`}
          >
            {block.data.items.map((item, index) =>
              renderListItem(item, index, block.id)
            )}
          </ListTag>
        );
      }

      case "linkTool":
        if (!isLinkToolBlock(block)) return null;
        return (
          <a
            key={block.id}
            href={block.data.link}
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {block.data.link}
          </a>
        );

      case "table":
        if (!isTableBlock(block)) return null;
        return (
          <div key={block.id} className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {(block.data.content as string[][]).map((row, rowIndex) => (
                  <tr
                    key={`${block.id}-row-${rowIndex}`}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${block.id}-cell-${rowIndex}-${cellIndex}`}
                        className="px-6 py-4 whitespace-normal text-sm text-gray-500"
                        dangerouslySetInnerHTML={sanitize(cell)}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <article className="prose prose-gray max-w-none">
      <div className="space-y-4">
        {parsedDescription?.blocks.map(renderBlock)}
      </div>
    </article>
  );
}

export default ProductDesc;
