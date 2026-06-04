import type { Metadata } from "next";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import ServicePageClient from "./service-client";

type ServicePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ServicePageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("service", searchParams);
}

export default function ServicePage() {
  return <ServicePageClient />;
}
