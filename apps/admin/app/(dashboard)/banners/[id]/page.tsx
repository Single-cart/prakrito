import UpdateBanner from "@/components/banner/UpdateBanner";
import NavHeader from "@/components/nav-header";
import { getSingleBanner } from "@/lib/fetch/banner.data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

type Props = {
  params: Promise<{ id: string }>;
};

const UpdateBannerPage = async ({ params }: Props) => {
  const id = (await params).id;
  const { data } = await getSingleBanner(id);

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
      <Card>
        <CardHeader>
          <CardTitle>Update Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateBanner banner={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateBannerPage;
