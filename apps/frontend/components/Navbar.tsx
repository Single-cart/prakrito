import { styles } from "@/app/styles";
import { getBanners } from "@/lib/fetch/banner.data";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { BookOpen, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import MobileMenu from "./MobileMenu";
import Profile from "./Profile";
import Search from "./Search";

const Navbar = async () => {
  const banners = await getBanners("topBanner");
  const latestBanner = banners?.data?.[banners.data.length - 1];

  const topBannerDesktopImg = latestBanner?.desktopImage
    ? new URL(
        latestBanner.desktopImage,
        process.env.NEXT_PUBLIC_SERVER_URL || ""
      ).toString()
    : null;

  const topBannerMobileImg = latestBanner?.mobileImage
    ? new URL(
        latestBanner.mobileImage,
        process.env.NEXT_PUBLIC_SERVER_URL || ""
      ).toString()
    : null;

  return (
    <div className="overflow-x-hidden">
      {/* Top banner - Desktop */}
      {topBannerDesktopImg && (
        <div className="sticky hidden lg:block">
          <div className="relative w-full h-[50px]">
            <Image
              src={topBannerDesktopImg}
              alt="Top banner"
              fill
              priority
              sizes="100vw"
              className="object-cover w-full"
              quality={90}
            />
          </div>
        </div>
      )}

      {/* Top banner - Mobile */}
      {topBannerMobileImg && (
        <div className="sticky block lg:hidden">
          <div className="relative w-full h-[40px]">
            <Image
              src={topBannerMobileImg}
              alt="Top banner"
              fill
              priority
              sizes="100vw"
              className="object-cover w-full"
              quality={90}
            />
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="sticky hidden lg:block top-0 z-50 bg-primary">
        <div
          className={cn(
            styles.paddingX,
            "flex items-center justify-between py-3 w-full"
          )}
        >
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="relative w-[150px] h-[50px]">
                <Image
                  src="/logo.png"
                  alt="shop logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>
          <div className="flex-grow mx-8">
            <Search searchRoute="/products" />
          </div>
          <div className="flex items-center gap-7">
            <Link href="/blogs">
              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-white hover:bg-white/90 text-primary"
              >
                <BookOpen className="h-4 w-4" />
                <span>Blogs</span>
              </Button>
            </Link>
            <Cart />
            <Profile />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          styles.paddingX,
          "sticky block lg:hidden top-0 z-50 bg-primary w-full py-1"
        )}
      >
        <div className="flex items-center justify-between">
          <MobileMenu />
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="relative w-[130px] h-[50px]">
                <Image
                  src="/logo.png"
                  alt="shop logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search Your Product</DialogTitle>
              </DialogHeader>
              <Search searchRoute="/products" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
