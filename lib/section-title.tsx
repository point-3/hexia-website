import type { ReactNode } from "react"
import type { PageSection } from "@/lib/directus"
import type { SupportedLocale } from "@/lib/i18n"
import { localizedText } from "@/lib/page-section-content"

function titleSuffixSeparator(locale: SupportedLocale) {
  return locale === "zh" ? "" : " "
}

export function sectionTitleSuffix(section: PageSection | null | undefined, locale: SupportedLocale): string {
  return (locale === "zh" ? section?.title_suffix_zh : section?.title_suffix_en)?.trim() || ""
}

export function titleWithHighlightedSuffix(title: string, suffix: string, locale: SupportedLocale): ReactNode {
  const cleanTitle = title.trim()
  const cleanSuffix = suffix.trim()
  if (!cleanTitle || !cleanSuffix) return cleanTitle || cleanSuffix

  const titleLower = cleanTitle.toLowerCase()
  const suffixLower = cleanSuffix.toLowerCase()
  if (titleLower.endsWith(suffixLower)) {
    const prefix = cleanTitle.slice(0, cleanTitle.length - cleanSuffix.length).trimEnd()
    const matchedSuffix = cleanTitle.slice(cleanTitle.length - cleanSuffix.length)
    return (
      <>
        {prefix ? `${prefix}${titleSuffixSeparator(locale)}` : ""}
        <span className="text-[var(--accent)]">{matchedSuffix}</span>
      </>
    )
  }

  return (
    <>
      {cleanTitle}
      {titleSuffixSeparator(locale)}
      <span className="text-[var(--accent)]">{cleanSuffix}</span>
    </>
  )
}

export function sectionTitleWithSuffix(
  section: PageSection | null | undefined,
  title: string,
  locale: SupportedLocale,
  fallbackSuffix = "",
): ReactNode {
  const suffix = sectionTitleSuffix(section, locale) || localizedText(fallbackSuffix, locale)
  return titleWithHighlightedSuffix(title, suffix, locale)
}
