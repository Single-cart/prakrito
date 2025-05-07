import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // This is a proxy to your actual backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category/category-subcategory`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch categories" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
