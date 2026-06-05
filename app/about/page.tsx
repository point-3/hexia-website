import type { Metadata } from "next";
import { getPageLayout } from "@/lib/api/site-config";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import AboutPageClient from "./about-client";

type AboutPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: AboutPageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("about", searchParams);
}

export default async function AboutPage() {
  const pageLayout = await getPageLayout("about");
  return <AboutPageClient pageLayout={pageLayout} />;
}
