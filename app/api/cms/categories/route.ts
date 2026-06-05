import { NextResponse } from "next/server";
import { getCategories } from "@/lib/api/products";
import { cmsCacheControlHeader } from "@/lib/cms-cache";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": cmsCacheControlHeader(),
      },
    });
  } catch (error) {
    console.error("API /api/cms/categories error:", error);
    return new NextResponse("获取产品分类失败", { status: 502 });
  }
}
