"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getImgUrl } from "@/lib/getImgPath";
import { useUpdateBannerMutation } from "@/redux/features/banners/bannerApi";
import { Badge } from "@workspace/ui/components/badge";
import { Switch } from "@workspace/ui/components/switch";
import { TableCell, TableRow } from "@workspace/ui/components/table";
import Image from "next/image";
import BannerDeleteBtn from "./BannerDeleteBtn";
import BannerUpdateBtn from "./BannerUpdateBtn";

const BannerTableRow = ({
  banner,
  showCategory,
}: {
  banner: any;
  showCategory?: boolean;
}) => {
  const [updateBanner, { isLoading }] = useUpdateBannerMutation();

  return (
    <TableRow>
      <TableCell>
        <div className="relative w-40 h-20 rounded-md overflow-hidden">
          <Image
            src={getImgUrl(banner.desktopImage || banner.image)}
            alt={`${banner.category?.name || ""} banner`}
            fill
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="relative w-24 h-20 rounded-md overflow-hidden">
          <Image
            src={getImgUrl(banner.mobileImage || banner.image)}
            alt={`${banner.category?.name || ""} banner`}
            fill
          />
        </div>
      </TableCell>
      {showCategory && (
        <TableCell>
          <Badge variant="secondary">{banner.category?.name}</Badge>
        </TableCell>
      )}
      <TableCell>{banner.order || "-"}</TableCell>
      <TableCell>
        <Switch
          disabled={isLoading}
          checked={banner.isActive}
          onCheckedChange={async () => {
            const formData = new FormData();
            formData.append("isActive", String(!banner.isActive));

            await updateBanner({
              id: banner._id,
              body: formData,
            });
          }}
        />
      </TableCell>
      <TableCell className="text-right space-x-4">
        <BannerUpdateBtn id={banner._id} />
        <BannerDeleteBtn id={banner._id} />
      </TableCell>
    </TableRow>
  );
};

export default BannerTableRow;
