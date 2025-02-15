"use client";

import CreateBanners from "@/components/banner/CreateBanners";
import NavHeader from "@/components/nav-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const CreateBannerPage = () => {
  const bread = [
    {
      href: "/",
      text: "Dashboard",
      last: false,
    },
    {
      href: "/banners",
      text: "Banners",
      last: true,
    },
  ];

  return (
    <div className="">
      <NavHeader bread={bread} />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateBanners />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBannerPage;
