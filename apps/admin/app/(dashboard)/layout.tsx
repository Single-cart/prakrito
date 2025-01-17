import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SidebarInset, SidebarProvider } from "@/components/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Layout;
