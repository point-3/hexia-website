import { NextResponse } from "next/server";
import { getFooterCertificates } from "@/lib/api/site-config";

export async function GET() {
  try {
    const certificates = await getFooterCertificates();
    return NextResponse.json(certificates, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API /api/cms/footer-certificates error:", error);
    return new NextResponse("获取页脚证书失败", { status: 502 });
  }
}
