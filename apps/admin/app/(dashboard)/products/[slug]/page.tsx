import { singleProduct } from "@/lib/fetch/product.data";
import { Card, CardContent } from "@workspace/ui/components/card";
import UpdateProductInfo from "../_components/UpdateProductInfo";

type Props = {
  params: Promise<{ slug: string }>;
};

const page = async ({ params }: Props) => {
  const slug = (await params).slug;
  const { data } = await singleProduct(slug);

  return (
    <div className="p-1 md:p-2 xl:p-4">
      <Card>
        <CardContent>
          <UpdateProductInfo product={data?.product} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
