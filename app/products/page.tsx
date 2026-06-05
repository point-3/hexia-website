import type { Metadata } from "next";
import { getPageLayout } from "@/lib/api/site-config";
import { getPageMetadataFromSearchParams } from "@/lib/seo";
import ProductsPageClient from "./products-client";

type ProductsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("products", searchParams);
}

export default async function ProductsPage() {
  const pageLayout = await getPageLayout("products");
  return <ProductsPageClient pageLayout={pageLayout} />;
}
