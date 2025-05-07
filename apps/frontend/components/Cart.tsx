"use client";

import { RootState } from "@/redux/store";
import { Button } from "@workspace/ui/components/button";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const [isMount, setIsMount] = useState(false);
  const [cartLength, setCartLength] = useState<number>();

  const { allCartProducts } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setIsMount(true);
    setCartLength(
      allCartProducts?.cartItem?.length >= 0
        ? allCartProducts?.cartItem?.length
        : 0
    );
  }, [allCartProducts?.cartItem]);

  if (!isMount) {
    return (
      <Link href={"/cart"} className="flex items-center">
        <Button size={"icon"} variant={"outline"} className="bg-secondary">
          <ShoppingCart />
        </Button>
      </Link>
    );
  }

  return (
    <div>
      <div className="cart">
        <Button variant={"outline"} className="bg-secondary">
          <Link href={"/cart"} className="flex items-center">
            <ShoppingCart />({cartLength})
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Cart;
