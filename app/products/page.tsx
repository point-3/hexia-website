import type { Metadata } from "next";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import ProductsPageClient from "./products-client";

type ProductsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("products", searchParams);
}

export default function ProductsPage() {
  return <ProductsPageClient />;
}
