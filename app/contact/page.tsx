import type { Metadata } from "next";
import { getPageLayout } from "@/lib/api/site-config";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import ContactPageClient from "./contact-client";

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ContactPageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("contact", searchParams);
}

export default async function ContactPage() {
  const pageLayout = await getPageLayout("contact");
  return <ContactPageClient pageLayout={pageLayout} />;
}
