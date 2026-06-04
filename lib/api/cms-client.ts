import type { Category, Product, Subcategory } from "@/lib/directus";
import type { SitePageKey, getSiteConfig } from "@/lib/api/site-config";

async function fetchCmsJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `CMS proxy request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export function getProductsFromCms(): Promise<Product[]> {
  return fetchCmsJson<Product[]>("/api/cms/products");
}

export function getProductBySlugFromCms(slug: string): Promise<Product> {
  if (!slug) {
    throw new Error("参数错误: slug 必须提供且不能为空！");
  }
  return fetchCmsJson<Product>(`/api/cms/products/${encodeURIComponent(slug)}`);
}

export function getCategoriesFromCms(): Promise<Category[]> {
  return fetchCmsJson<Category[]>("/api/cms/categories");
}

export function getSubcategoriesFromCms(): Promise<Subcategory[]> {
  return fetchCmsJson<Subcategory[]>("/api/cms/subcategories");
}

export function getSiteConfigFromCms(page: SitePageKey = "home"): ReturnType<typeof getSiteConfig> {
  return fetchCmsJson<Awaited<ReturnType<typeof getSiteConfig>>>(`/api/cms/site-config?page=${encodeURIComponent(page)}`);
}
