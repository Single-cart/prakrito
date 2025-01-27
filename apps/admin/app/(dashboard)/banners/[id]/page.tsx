import UpdateBanner from "@/components/banner/UpdateBanner";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <UpdateBanner banner={data} />
      </CardContent>
    </Card>
  );
};

export default UpdateBannerPage;
