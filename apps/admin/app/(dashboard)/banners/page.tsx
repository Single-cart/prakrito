"use client";

import BannerTable from "@/components/banner/BannerTable";
import { useGetBannersQuery } from "@/redux/features/banners/bannerApi";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ImageIcon, ImagePlus, Layout, LayoutGrid } from "lucide-react";
import Link from "next/link";

export type IBanner = {
  _id: string;
  bannerType: string;
  category?: {
    name: string;
    _id: string;
  };
  desktopImage?: string;
  mobileImage?: string;
  image?: string; // For backward compatibility
  order: number;
  isActive: boolean;
};

const BannerPage = () => {
  const { data, isLoading } = useGetBannersQuery({});
  const banners = (data?.data as IBanner[]) || [];

  const mainBanners = banners.filter(
    (banner) => banner.bannerType === "mainBanner"
  );
  const categoryBanners = banners.filter(
    (banner) => banner.bannerType === "categoryBanner"
  );
  const topBanners = banners.filter(
    (banner) => banner.bannerType === "topBanner"
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Banner Management</h1>
        </div>
        <Link href="/banners/create">
          <Button>
            <ImagePlus className="mr-2 h-4 w-4" />
            Create Banner
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="main" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Main Banners
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Category Banners
          </TabsTrigger>
          <TabsTrigger value="top" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Top Banners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <BannerTable
            banners={mainBanners}
            isLoading={isLoading}
            type="main"
          />
        </TabsContent>

        <TabsContent value="category">
          <BannerTable
            banners={categoryBanners}
            isLoading={isLoading}
            type="category"
            showCategory
          />
        </TabsContent>

        <TabsContent value="top">
          <BannerTable banners={topBanners} isLoading={isLoading} type="top" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BannerPage;
