import { NextResponse } from "next/server";
import { getSubcategories } from "@/lib/api/products";

export async function GET() {
  try {
    const subcategories = await getSubcategories();
    return NextResponse.json(subcategories, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API /api/cms/subcategories error:", error);
    return new NextResponse("获取产品二级分类失败", { status: 502 });
  }
}
