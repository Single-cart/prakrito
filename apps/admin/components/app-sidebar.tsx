"use client";

import {
  FolderTree,
  ImagePlus,
  LayoutDashboard,
  MessageSquare,
  PackageSearch,
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
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: ShoppingCart,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: MessageSquare,
      items: [
        {
          title: "All Reviews",
          url: "/dashboard/reviews",
        },
        {
          title: "Manage Reviews",
          url: "/dashboard/manage-reviews",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: PackageSearch,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Order Analytics",
          url: "/dashboard/orderAnalytics",
        },
      ],
    },
    {
      title: "Banners",
      url: "/dashboard/banners",
      icon: ImagePlus,
    },
    {
      title: "Category",
      url: "/dashboard/category",
      icon: FolderTree,
    },
    {
      title: "Users",
      url: "/dashboard/users",
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
