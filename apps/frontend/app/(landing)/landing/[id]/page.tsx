import { getSingleLanding } from "@/lib/fetch/landing.data";
import { FC } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const page: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const landings = await getSingleLanding(id);

  return <div>page</div>;
};

export default page;
