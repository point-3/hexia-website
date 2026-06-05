import type { Metadata } from "next";
import { getPageLayout } from "@/lib/api/site-config";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import ServicePageClient from "./service-client";

type ServicePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ServicePageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("service", searchParams);
}

export default async function ServicePage() {
  const pageLayout = await getPageLayout("service");
  return <ServicePageClient pageLayout={pageLayout} />;
}
