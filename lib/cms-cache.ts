export const CMS_REVALIDATE_TAGS = {
  siteConfig: "cms:site-config",
  products: "cms:products",
  articles: "cms:articles",
  assets: "cms:assets",
} as const

export const DEFAULT_CMS_REVALIDATE_PATHS = [
  "/",
  "/products",
  "/products/[slug]",
  "/service",
  "/about",
  "/contact",
  "/news",
  "/news/[slug]",
] as const

function positiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function getCmsRevalidateSeconds(): number {
  return positiveInteger(process.env.CMS_REVALIDATE_SECONDS, 60)
}

export function cmsCacheControlHeader(): string {
  const seconds = getCmsRevalidateSeconds()
  return `s-maxage=${seconds}, stale-while-revalidate=${seconds * 5}`
}

export function cmsFetchNextOptions(tags: string[]) {
  return {
    revalidate: getCmsRevalidateSeconds(),
    tags,
  }
}
