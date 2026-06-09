import type { JsonValue, SiteSettings, SiteSettingsTranslation } from "@/lib/directus"

type LocaleCode = "en" | "zh"

export type SocialProfile = {
  key: string
  label: string
  href: string
}

const LOCALE_TO_LANGUAGE: Record<LocaleCode, string> = {
  en: "en-US",
  zh: "zh-CN",
}

export function getSiteTranslation(
  settings: SiteSettings,
  locale: LocaleCode,
): SiteSettingsTranslation | undefined {
  const language = LOCALE_TO_LANGUAGE[locale]
  return (
    settings.translations?.find((item) => item.languages_code === language) ??
    settings.translations?.find((item) => item.languages_code === "en-US") ??
    settings.translations?.[0]
  )
}

export function companyName(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.company_name || "Hexia (Suzhou) Biotechnology Co., Ltd."
}

export function companyDescription(settings: SiteSettings, locale: LocaleCode): string {
  return (
    getSiteTranslation(settings, locale)?.company_short_description ||
    "Professional supplier of feed additives, food additives, vitamins, amino acids and nutritional raw materials."
  )
}

export function companyAddress(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.company_address || (locale === "zh" ? "中国苏州" : "Suzhou, China")
}

export function footerCopyright(settings: SiteSettings, locale: LocaleCode): string {
  return (
    getSiteTranslation(settings, locale)?.footer_copyright ||
    `Copyright © 2026 ${companyName(settings, locale)} All Rights Reserved.`
  )
}

export function quoteButtonText(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.quote_button_text || (locale === "zh" ? "获取报价" : "Get a Quote")
}

export function contactEmail(settings: SiteSettings): string {
  return settings.email?.trim() || "justin@hexiabio.com"
}

export function contactPhone(settings: SiteSettings): string {
  return settings.phone?.trim() || settings.whatsapp?.trim() || "+86 138 6232 0011"
}

export function contactWhatsapp(settings: SiteSettings): string {
  return settings.whatsapp?.trim() || settings.phone?.trim() || "+86 138 6232 0011"
}

function jsonObject(value: JsonValue | undefined): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {}
}

function enabled(item: Record<string, unknown>): boolean {
  return item.enabled !== false
}

function socialLabel(key: string): string {
  const known: Record<string, string> = {
    linkedin: "LinkedIn",
    facebook: "Facebook",
    instagram: "Instagram",
    youtube: "YouTube",
  }
  return known[key.toLowerCase()] || key
}

export function socialProfiles(settings: SiteSettings): SocialProfile[] {
  if (Array.isArray(settings.social_links)) {
    return settings.social_links.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return []
      const row = item as Record<string, unknown>
      if (!enabled(row)) return []
      const key = String(row.platform || row.key || "").trim()
      const href = String(row.href || row.url || "").trim()
      if (!key || !href) return []
      return [{
        key,
        label: String(row.label || "").trim() || socialLabel(key),
        href,
      }]
    })
  }

  return Object.entries(jsonObject(settings.social_links))
    .filter(([, href]) => typeof href === "string" && href.trim() !== "")
    .map(([key, href]) => ({
      key,
      label: socialLabel(key),
      href: String(href),
    }))
}

export function telHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "")
  return normalized ? `tel:${normalized}` : "#"
}

export function whatsappHref(phone: string): string {
  const normalized = phone.replace(/[^\d]/g, "")
  return normalized ? `https://wa.me/${normalized}` : "#"
}
