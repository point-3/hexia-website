import type { Metadata } from "next";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import AboutPageClient from "./about-client";

type AboutPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: AboutPageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("about", searchParams);
}

export default function AboutPage() {
  return <AboutPageClient />;
}
