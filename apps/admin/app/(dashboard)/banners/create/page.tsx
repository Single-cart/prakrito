"use client";

import CreateBanners from "@/components/banner/CreateBanners";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const CreateBannerPage = () => {
  return (
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
  );
};

export default CreateBannerPage;
