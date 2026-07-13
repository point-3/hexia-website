import type { JsonValue, SiteSettings, SiteSettingsTranslation } from "@/lib/directus"
import {
  DEFAULT_BROWSER_TITLE_PREFIX,
  DEFAULT_COMPANY_ADDRESS,
  DEFAULT_COMPANY_DESCRIPTION,
  DEFAULT_COMPANY_NAME,
  DEFAULT_HQ_TITLE_EN,
  DEFAULT_HQ_TITLE_ZH,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_CONTACT_PHONE,
  DEFAULT_SITE_NAME,
} from "@/lib/site-defaults"

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
  return getSiteTranslation(settings, locale)?.company_name || DEFAULT_COMPANY_NAME
}

export function siteName(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.site_name || settings.site_title?.trim() || DEFAULT_SITE_NAME
}

export function browserTitlePrefix(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.browser_title_prefix || DEFAULT_BROWSER_TITLE_PREFIX
}

export function brandHighlightName(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.brand_highlight_name || siteName(settings, locale)
}

export function whyChooseTitleSuffix(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.why_choose_title_suffix || ""
}

export function companyDescription(settings: SiteSettings, locale: LocaleCode): string {
  return (
    getSiteTranslation(settings, locale)?.company_short_description ||
    DEFAULT_COMPANY_DESCRIPTION
  )
}

export function companyHeadquartersTitle(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.hq_title || (locale === "zh" ? DEFAULT_HQ_TITLE_ZH : DEFAULT_HQ_TITLE_EN)
}

export function companyAddress(settings: SiteSettings, locale: LocaleCode): string {
  return getSiteTranslation(settings, locale)?.company_address || DEFAULT_COMPANY_ADDRESS
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
  return settings.email?.trim() || DEFAULT_CONTACT_EMAIL
}

export function contactPhone(settings: SiteSettings): string {
  return settings.phone?.trim() || settings.whatsapp?.trim() || DEFAULT_CONTACT_PHONE
}

export function contactWhatsapp(settings: SiteSettings): string {
  return settings.whatsapp?.trim() || settings.phone?.trim() || DEFAULT_CONTACT_PHONE
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
