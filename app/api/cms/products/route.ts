import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api/products";
import { cmsCacheControlHeader } from "@/lib/cms-cache";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": cmsCacheControlHeader(),
      },
    });
  } catch (error) {
    console.error("API /api/cms/products error:", error);
    return new NextResponse("获取产品列表失败", { status: 502 });
  }
}
