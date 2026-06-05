import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/api/products";
import { cmsCacheControlHeader } from "@/lib/cms-cache";

type ProductRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: ProductRouteContext) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const product = await getProductBySlug(slug);
    return NextResponse.json(product, {
      headers: {
        "Cache-Control": cmsCacheControlHeader(),
      },
    });
  } catch (error) {
    console.error("API /api/cms/products/[slug] error:", error);
    return new NextResponse("获取产品详情失败", { status: 502 });
  }
}
