import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { tag } = await req.json();

  await revalidateTag(tag);

  return Response.json({
    message: `${tag} Validate successfully`,
  });
}
