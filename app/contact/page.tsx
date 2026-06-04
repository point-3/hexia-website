import type { Metadata } from "next";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import ContactPageClient from "./contact-client";

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ContactPageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("contact", searchParams);
}

export default function ContactPage() {
  return <ContactPageClient />;
}
