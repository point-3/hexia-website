import { NextResponse } from "next/server";
import { getFooterCertificates } from "@/lib/api/site-config";
import { cmsCacheControlHeader } from "@/lib/cms-cache";

export async function GET() {
  try {
    const certificates = await getFooterCertificates();
    return NextResponse.json(certificates, {
      headers: {
        "Cache-Control": cmsCacheControlHeader(),
      },
    });
  } catch (error) {
    console.error("API /api/cms/footer-certificates error:", error);
    return new NextResponse("获取页脚证书失败", { status: 502 });
  }
}
