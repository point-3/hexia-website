import type { Metadata } from "next";
import { getSeoPage, getSiteSettings, type SitePageKey } from "@/lib/api/site-config";
import type { SeoPage, SeoPageTranslation, SiteSettings, SiteSettingsTranslation } from "@/lib/directus";

type SeoLocale = "en" | "zh";

const LANGUAGE_BY_LOCALE: Record<SeoLocale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

const GENERIC_DEFAULT_SEO = {
  title: "Company Website",
  description: "Product and service information.",
  keywords: "",
};

function cleanText(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseSeoLocale(value: string | null | undefined): SeoLocale {
  const normalized = value?.toLowerCase();
  return normalized === "zh" ? "zh" : "en";
}

function pickTranslation<T extends { languages_code: string }>(
  translations: T[] | null | undefined,
  locale: SeoLocale,
): T | undefined {
  const languageCode = LANGUAGE_BY_LOCALE[locale];
  return (
    translations?.find((translation) => translation.languages_code === languageCode) ??
    translations?.find((translation) => translation.languages_code === "en-US") ??
    translations?.[0]
  );
}

function toMetadata(values: { title: string; description: string; keywords: string }): Metadata {
  return {
    title: values.title,
    description: values.description,
    ...(values.keywords ? { keywords: values.keywords } : {}),
  };
}

export function resolveDefaultMetadata(settings: SiteSettings, localeValue: string | null | undefined = "en"): Metadata {
  const locale = parseSeoLocale(localeValue);
  const translation = settings.id === 0
    ? undefined
    : pickTranslation<SiteSettingsTranslation>(settings.translations, locale);

  return toMetadata({
    title: cleanText(translation?.default_meta_title) || GENERIC_DEFAULT_SEO.title,
    description: cleanText(translation?.default_meta_description) || GENERIC_DEFAULT_SEO.description,
    keywords: cleanText(translation?.default_meta_keywords) || GENERIC_DEFAULT_SEO.keywords,
  });
}

export function resolvePageMetadata(
  settings: SiteSettings,
  seoPage: SeoPage,
  localeValue: string | null | undefined = "en",
): Metadata {
  const locale = parseSeoLocale(localeValue);
  const siteDefaults = resolveDefaultMetadata(settings, locale);
  const pageTranslation = seoPage.id === 0
    ? undefined
    : pickTranslation<SeoPageTranslation>(seoPage.translations, locale);

  return toMetadata({
    title: cleanText(pageTranslation?.title) || String(siteDefaults.title || GENERIC_DEFAULT_SEO.title),
    description: cleanText(pageTranslation?.description) || siteDefaults.description || GENERIC_DEFAULT_SEO.description,
    keywords: cleanText(pageTranslation?.keywords) || (Array.isArray(siteDefaults.keywords) ? siteDefaults.keywords.join(", ") : cleanText(siteDefaults.keywords as string | undefined)),
  });
}

export async function getPageMetadata(
  pageKey: SitePageKey,
  localeValue: string | null | undefined = "en",
): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const seoPage = await getSeoPage(pageKey, siteSettings);
  return resolvePageMetadata(siteSettings, seoPage, localeValue);
}

export async function getPageMetadataFromSearchParams(
  pageKey: SitePageKey,
  searchParams?: Promise<{ lang?: string }>,
): Promise<Metadata> {
  const params = searchParams ? await searchParams : undefined;
  return getPageMetadata(pageKey, params?.lang);
}
