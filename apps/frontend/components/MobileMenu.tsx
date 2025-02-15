"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetAllCategoryQuery } from "@/redux/features/category/categoryApi";
import { categoryType } from "@workspace/shared/index";
import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import {
  ChevronDown,
  Home,
  Info,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Profile from "./Profile";

const MobileMenu = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const { data, isLoading } = useGetAllCategoryQuery({});
  const { isAuthenticated } = useAuth();

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const menuItems = [
    { icon: <Home className="h-4 w-4" />, label: "Home", href: "/" },
    { icon: <Info className="h-4 w-4" />, label: "About Us", href: "/about" },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      label: "Blog",
      href: "/blog",
    },
    { icon: <Phone className="h-4 w-4" />, label: "Contact", href: "/contact" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="hover:bg-primary/10">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="category" className="h-full">
          <TabsList className="w-full rounded-sm border-b grid grid-cols-2">
            <TabsTrigger
              value="category"
              className="rounded-sm data-[state=active]:border-b-2"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="rounded-sm data-[state=active]:border-b-2"
            >
              Menu
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <TabsContent value="category" className="p-4 m-0">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-100 animate-pulse rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {data?.data?.map(
                    (category: categoryType.ICategorySubcategory) => (
                      <Collapsible
                        key={category._id}
                        open={openCategories.includes(category._id)}
                        onOpenChange={() => toggleCategory(category._id)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg",
                              "hover:bg-primary/5 transition-colors",
                              openCategories.includes(category._id)
                                ? "bg-primary/5"
                                : "bg-gray-50"
                            )}
                          >
                            <span className="font-medium">{category.name}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                openCategories.includes(category._id) &&
                                  "rotate-180"
                              )}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 py-2 space-y-1">
                          {category.subcategory.map(
                            (sub: categoryType.ISubCategory) => (
                              <Link
                                key={sub._id}
                                href={`/category/${sub._id}`}
                                className="block p-2 rounded-md hover:bg-primary/5 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            )
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="menu" className="m-0">
              <div className="p-4 space-y-6">
                {/* Navigation Links */}
                <nav className="space-y-1">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        "hover:bg-primary/5 transition-colors"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>

                <Separator />

                {/* Cart Section */}
                <div>
                  <Link
                    href="/cart"
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      "hover:bg-primary/5 transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Shopping Cart</span>
                    </div>
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </div>

                <Separator />

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="flex items-center justify-between p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span>Your Profile</span>
                    </div>
                    <Profile />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/register">Create Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
