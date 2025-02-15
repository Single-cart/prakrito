"use client";

import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/redux/store";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BottomNavbar = () => {
  const { isAuthenticated } = useAuth();
  const [cartLength, setCartLength] = useState<number>(0);

  const { allCartProducts } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setCartLength(
      allCartProducts?.cartItem?.length >= 0
        ? allCartProducts?.cartItem?.length
        : 0
    );
  }, [allCartProducts?.cartItem]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
      <ul className="flex items-center justify-between px-4 py-2">
        <li className="flex-1">
          <Link href="/" className="flex flex-col items-center">
            <Home className="w-6 h-6 text-gray-600" />
            <p className="text-xs mt-1 text-gray-600">HOME</p>
          </Link>
        </li>

        <li className="flex-1">
          <Link href="/products" className="flex flex-col items-center">
            <LayoutGrid className="w-6 h-6 text-gray-600" />
            <p className="text-xs mt-1 text-gray-600">CATEGORY</p>
          </Link>
        </li>

        <li className="flex-1">
          <Link href="/cart" className="flex flex-col items-center relative">
            <span className="absolute -top-[3px] right-[23px] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartLength}
            </span>
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <p className="text-xs mt-1 text-gray-600">BAG</p>
          </Link>
        </li>

        <li className="flex-1">
          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className="flex flex-col items-center"
          >
            <User className="w-6 h-6 text-gray-600" />
            <p className="text-xs mt-1 text-gray-600">ME</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavbar;
