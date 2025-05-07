"use client";

import {
  BookOpen,
  FolderTree,
  ImagePlus,
  LayoutDashboard,
  MessageSquare,
  PackageSearch,
  PanelsTopLeft,
  ShoppingCart,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Products",
      url: "/products",
      icon: ShoppingCart,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: MessageSquare,
      items: [
        {
          title: "All Reviews",
          url: "/reviews",
        },
        {
          title: "Product Reviews",
          url: "/product-reviews",
        },
      ],
    },
    {
      title: "Orders",
      url: "/orders",
      icon: PackageSearch,
      items: [
        {
          title: "All Orders",
          url: "/order",
        },
        {
          title: "Order Analytics",
          url: "/orderAnalytics",
        },
      ],
    },
    {
      title: "Banners",
      url: "/banners",
      icon: ImagePlus,
    },
    {
      title: "Category",
      url: "/category",
      icon: FolderTree,
    },
    {
      title: "Landing Page",
      url: "/landing",
      icon: PanelsTopLeft,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "/user",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="border p-2 border-secondary">
          <h1 className="font-bold text-2xl">Admin</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
