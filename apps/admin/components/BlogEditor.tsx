"use client";

import EditorJS, { OutputData, ToolConstructable } from "@editorjs/editorjs";
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
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialContent = "",
  onChange,
  placeholder = "Enter blog content...",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  // Parse initial content
  const getInitialData = (): OutputData => {
    try {
      return initialContent ? JSON.parse(initialContent) : { blocks: [] };
    } catch (error) {
      console.error("Error parsing initial content:", error);
      return { blocks: [] };
    }
  };

  // Initialize editor
  useEffect(() => {
    // Clean up existing editor if any
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    // Initialize after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: {
              class: Header as unknown as ToolConstructable,
              inlineToolbar: ["link"],
              config: {
                placeholder: "Enter a header",
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            linkTool: {
              class: LinkTool as unknown as ToolConstructable,
            },
            table: {
              class: Table as unknown as ToolConstructable,
              inlineToolbar: true,
            },
            marker: {
              class: Marker as unknown as ToolConstructable,
              shortcut: "CMD+SHIFT+M",
            },
          },
          data: getInitialData(),
          placeholder,
          onChange: async () => {
            try {
              const content = await editor.save();
              onChange(JSON.stringify(content));
            } catch (error) {
              console.error("Error saving editor content:", error);
            }
          },
          onReady: () => {
            console.log("Editor is ready");
            setEditorReady(true);
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("Failed to initialize editor:", error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Add more robust error handling for editor destruction
      try {
        if (editorRef.current) {
          if (typeof editorRef.current.destroy === "function") {
            editorRef.current.destroy();
          } else {
            console.warn("Editor instance has no destroy method");
          }
          editorRef.current = null;
        }
      } catch (error) {
        console.error("Error destroying editor:", error);
      }
    };
  }, [initialContent, onChange, placeholder]);

  return (
    <div>
      <div
        id="editorjs"
        className={`min-h-[300px] border rounded-md p-4 bg-white ${
          editorReady ? "cursor-text" : "cursor-wait"
        }`}
      />
      {!editorReady && (
        <p className="text-xs text-gray-500 mt-1">Editor is initializing...</p>
      )}
    </div>
  );
};

export default BlogEditor;
