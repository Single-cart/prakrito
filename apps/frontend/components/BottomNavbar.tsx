"use client";

import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/redux/store";
import { cn } from "@workspace/ui/lib/utils";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BottomNavbar = () => {
  const { isAuthenticated } = useAuth();
  const [cartLength, setCartLength] = useState<number>(0);
  const pathname = usePathname();

  const { allCartProducts } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setCartLength(
      allCartProducts?.cartItem?.length >= 0
        ? allCartProducts?.cartItem?.length
        : 0
    );
  }, [allCartProducts?.cartItem]);

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Shop",
      icon: LayoutGrid,
      href: "/products",
      active: pathname === "/products" || pathname.startsWith("/products/"),
    },
    {
      label: "Cart",
      icon: ShoppingBag,
      href: "/cart",
      active: pathname === "/cart",
      badge: cartLength,
    },
    {
      label: "Profile",
      icon: User,
      href: isAuthenticated ? "/profile" : "/login",
      active:
        pathname === "/profile" ||
        pathname === "/login" ||
        pathname.startsWith("/profile/"),
    },
  ];

  // Hide navbar on certain pages if needed
  if (pathname.includes("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="max-w-lg mx-auto">
        <nav className="bg-white">
          <ul className="flex items-center justify-around h-14">
            {navItems.map((item, index) => (
              <li key={index} className="relative flex-1 h-full">
                <Link
                  href={item.href}
                  className={cn(
                    "h-full flex flex-col items-center justify-center transition-colors duration-200",
                    item.active
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  <div
                    className={cn(
                      "relative inline-flex items-center justify-center p-1.5 rounded-full transition-all duration-300",
                      item.active ? "bg-primary/10" : ""
                    )}
                  >
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}

                    <item.icon
                      className={cn(
                        "w-[20px] h-[20px] transition-colors duration-200",
                        item.active ? "text-primary" : "text-inherit"
                      )}
                      strokeWidth={item.active ? 2.5 : 2}
                    />
                  </div>

                  <p
                    className={cn(
                      "text-[11px] mt-1 transition-colors duration-200",
                      item.active ? "font-medium" : "font-normal"
                    )}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BottomNavbar;
