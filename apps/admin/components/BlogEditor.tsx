"use client";

import EditorJS, { ToolConstructable } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";
import React, { useEffect, useRef, useState } from "react";

interface BlogEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editorId?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialContent = "",
  onChange,
  placeholder = "Enter blog content...",
  editorId = "blog-editorjs",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorReady, setEditorReady] = useState(false);

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const initEditor = async () => {
      try {
        const parsedContent = initialContent
          ? JSON.parse(initialContent)
          : { blocks: [] };

        const editor = new EditorJS({
          holder: containerRef.current!,
          tools: {
            header: {
              class: Header as unknown as ToolConstructable,
              inlineToolbar: true,
              config: {
                placeholder: "Enter a header",
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            linkTool: {
              class: LinkTool as unknown as ToolConstructable,
              config: {
                endpoint: "/api/fetch-link",
              },
            },
            table: {
              class: Table as unknown as ToolConstructable,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            marker: {
              class: Marker as unknown as ToolConstructable,
              shortcut: "CMD+SHIFT+M",
            },
          },
          data: parsedContent,
          placeholder,
          onChange: debounce(async () => {
            try {
              const outputData = await editor.save();
              onChange(JSON.stringify(outputData));
            } catch (error) {
              console.error("Error saving editor content:", error);
            }
          }, 250),
          onReady: () => {
            setEditorReady(true);
          },
        });

        editorRef.current = editor;

        return () => {
          if (editor && typeof editor.destroy === "function") {
            editor.destroy();
            editorRef.current = null;
            setEditorReady(false);
          }
        };
      } catch (error) {
        console.error("Error initializing editor:", error);
      }
    };

    initEditor();
  }, [initialContent, onChange, placeholder]);

  // Debounce function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`min-h-[300px] border rounded-md p-4 bg-white ${
          editorReady ? "cursor-text" : "cursor-wait"
        }`}
      />
      {!editorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <p className="text-sm text-gray-500">Loading editor...</p>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
