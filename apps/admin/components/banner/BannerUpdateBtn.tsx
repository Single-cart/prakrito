"use client";

import { Button } from "@workspace/ui/components/button";
import { Edit } from "lucide-react";
import Link from "next/link";

const BannerUpdateBtn = ({ id }: { id: string }) => {
  return (
    <Link href={`/banners/${id}`}>
      <Button size={"icon"}>
        <Edit />
      </Button>
    </Link>
  );
};

export default BannerUpdateBtn;
