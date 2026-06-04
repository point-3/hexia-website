import type { JsonValue, PageSection, PageSectionTranslation } from "@/lib/directus"
import type { SupportedLocale } from "@/lib/i18n"

type JsonObject = Record<string, unknown>

const LANGUAGE_BY_LOCALE: Record<SupportedLocale, string> = {
  en: "en-US",
  zh: "zh-CN",
}

export function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

export function asJsonObject(value: JsonValue | unknown): JsonObject {
  return isJsonObject(value) ? value : {}
}

export function asJsonArray(value: unknown): JsonObject[] {
  return Array.isArray(value) ? value.filter(isJsonObject) : []
}

export function localizedText(value: unknown, locale: SupportedLocale, fallback = ""): string {
  if (typeof value === "string") return value.trim() || fallback
  if (!isJsonObject(value)) return fallback

  const candidates = locale === "zh"
    ? [value.zh, value["zh-CN"], value.cn, value.en, value["en-US"]]
    : [value.en, value["en-US"], value.zh, value["zh-CN"], value.cn]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim()
  }
  return fallback
}

export function fieldText(item: JsonObject, field: string, locale: SupportedLocale, fallback = ""): string {
  const localeField = locale === "zh" ? `${field}_zh` : `${field}_en`
  const altLocaleField = locale === "zh" ? `${field}_cn` : `${field}_us`
  return (
    localizedText(item[field], locale) ||
    localizedText(item[localeField], locale) ||
    localizedText(item[altLocaleField], locale) ||
    fallback
  )
}

export function getSectionTranslation(
  section: PageSection | null | undefined,
  locale: SupportedLocale,
): PageSectionTranslation | undefined {
  const languageCode = LANGUAGE_BY_LOCALE[locale]
  return (
    section?.translations?.find((item) => item.languages_code === languageCode) ??
    section?.translations?.find((item) => item.languages_code === "en-US") ??
    section?.translations?.[0]
  )
}

export function getSectionConfig(section: PageSection | null | undefined, locale: SupportedLocale): JsonObject {
  const translation = getSectionTranslation(section, locale)
  return {
    ...asJsonObject(section?.settings),
    ...asJsonObject(translation?.content_json),
  }
}
