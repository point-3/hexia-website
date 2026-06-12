"use client"

import { useState } from "react"
import { Building2, Factory, Globe, Package, Shield, Sparkles, Users, Wrench, type LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import { getFileUrl } from "@/lib/directus"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { t } from "@/lib/i18n"
import { whyChooseTitleSuffix } from "@/lib/site-profile"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedText,
  themeColor,
} from "@/lib/page-section-content"

type WhyChooseFeature = {
  icon: LucideIcon
  title: string
  description: string
}

type ConfiguredFeatureResult = {
  features: WhyChooseFeature[]
  hasExplicitCards: boolean
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  team: Users,
  building: Building2,
  building2: Building2,
  package: Package,
  factory: Factory,
  shield: Shield,
  globe: Globe,
  sparkles: Sparkles,
  wrench: Wrench,
}

function iconByName(value: unknown): LucideIcon {
  if (typeof value !== "string") return Sparkles
  return iconMap[value.trim().toLowerCase()] ?? Sparkles
}

function fallbackFeatures(lang: "en" | "zh"): WhyChooseFeature[] {
  return [
    { icon: Users, title: t("home.teamTitle", lang), description: t("home.teamDesc", lang) },
    { icon: Building2, title: t("home.layoutTitle", lang), description: t("home.layoutDesc", lang) },
    { icon: Package, title: t("home.rangeTitle", lang), description: t("home.rangeDesc", lang) },
    { icon: Factory, title: t("home.capacityTitle", lang), description: t("home.capacityDesc", lang) },
    { icon: Shield, title: t("home.qcTitle", lang), description: t("home.qcDesc", lang) },
    { icon: Globe, title: t("home.marketTitle", lang), description: t("home.marketDesc", lang) },
    { icon: Sparkles, title: t("home.solutionTitle", lang), description: t("home.solutionDesc", lang) },
    { icon: Wrench, title: t("home.customTitle", lang), description: t("home.customDesc", lang) },
  ]
}

function hasJsonArray(value: unknown): boolean {
  if (Array.isArray(value)) return true
  if (typeof value !== "string" || !value.trim()) return false
  try {
    return Array.isArray(JSON.parse(value))
  } catch {
    return false
  }
}

function configuredFeatures(section: PageSection | null | undefined, lang: "en" | "zh"): ConfiguredFeatureResult {
  const translation = getSectionTranslation(section, lang)
  const moduleCardsValue = lang === "zh" ? section?.feature_cards_zh : section?.feature_cards_en
  const moduleCards = asJsonArray(moduleCardsValue)
  const hasModuleCards = hasJsonArray(moduleCardsValue)
  const translatedCards = asJsonArray(translation?.feature_cards)
  const config = getSectionConfig(section, lang)
  const hasTranslatedCards = hasJsonArray(translation?.feature_cards)
  const configuredCards = asJsonArray(config.features || config.items || config.cards)
  const hasConfiguredCards = hasJsonArray(config.features) || hasJsonArray(config.items) || hasJsonArray(config.cards)
  const items = hasModuleCards ? moduleCards : hasTranslatedCards ? translatedCards : configuredCards

  const features = items.flatMap((item) => {
    const title = fieldText(item, "title", lang)
    const description = fieldText(item, "description", lang) || fieldText(item, "desc", lang)
    if (!title && !description) return []
    return [{ icon: iconByName(item.icon), title, description }]
  })

  return {
    features,
    hasExplicitCards: hasModuleCards || hasTranslatedCards || hasConfiguredCards,
  }
}

function titleSuffixSeparator(lang: "en" | "zh") {
  return lang === "zh" ? "" : " "
}

function titleWithSuffix(prefix: string, suffix: string, lang: "en" | "zh") {
  const cleanPrefix = prefix.trim()
  const cleanSuffix = suffix.trim()
  if (!cleanPrefix || !cleanSuffix) return cleanPrefix || cleanSuffix

  return (
    <>
      {cleanPrefix}
      {titleSuffixSeparator(lang)}
      <span className="text-[var(--accent)]">{cleanSuffix}</span>
    </>
  )
}

function fallbackTitle(lang: "en" | "zh", displayName: string) {
  return titleWithSuffix(lang === "zh" ? "为什么选择" : "Why Choose", displayName, lang)
}

function whyChooseTitlePrefix(title: string, lang: "en" | "zh") {
  if (lang === "zh") {
    const match = title.match(/^为什么选择\s*/i)
    return match ? match[0].trim() : title
  }

  const match = title.match(/^why\s+choose\b/i)
  return match ? title.slice(0, match[0].length).trim() : title
}

function titleWithHighlightedSuffix(title: string, suffix: string, lang: "en" | "zh") {
  const cleanTitle = title.trim()
  const cleanSuffix = suffix.trim()
  if (!cleanTitle || !cleanSuffix) return cleanTitle

  const titleLower = cleanTitle.toLowerCase()
  const suffixLower = cleanSuffix.toLowerCase()
  if (!titleLower.endsWith(suffixLower)) {
    return titleWithSuffix(whyChooseTitlePrefix(cleanTitle, lang), cleanSuffix, lang)
  }

  const prefix = cleanTitle.slice(0, cleanTitle.length - cleanSuffix.length).trimEnd()
  const matchedSuffix = cleanTitle.slice(cleanTitle.length - cleanSuffix.length)

  return (
    <>
      {prefix ? `${prefix}${titleSuffixSeparator(lang)}` : ""}
      <span className="text-[var(--accent)]">{matchedSuffix}</span>
    </>
  )
}

export function WhyChooseSection({ section }: { section?: PageSection | null }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const siteSettings = useSiteSettings()
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const configured = configuredFeatures(section, lang)
  const features = configured.hasExplicitCards ? configured.features : fallbackFeatures(lang)
  const title = translation?.title || localizedText(config.title, lang)
  const configuredSuffix = localizedText(config.title_suffix || config.brand_suffix || config.highlight_suffix, lang)
  const titleSuffix = whyChooseTitleSuffix(siteSettings, lang) || configuredSuffix
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang) || t("home.whyChooseDesc", lang)
  const backgroundColor = themeColor(section?.background_color || localizedText(config.background_color, lang), "var(--bg-page)")
  const textColor = themeColor(section?.text_color || localizedText(config.text_color, lang), "var(--primary-dark)")
  const bodyTextColor = themeColor(localizedText(config.body_text_color, lang), textColor)
  const imageSrc = getFileUrl(section?.image || localizedText(config.image, lang), { width: 1600, quality: 82, format: "webp" })

  return (
    <section className="relative overflow-hidden py-16 lg:py-20" style={{ backgroundColor, color: textColor }}>
      {imageSrc ? (
        <div className="pointer-events-none absolute inset-0">
          <img
            src={imageSrc}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            className="h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0" style={{ backgroundColor, opacity: 0.72 }} />
        </div>
      ) : null}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: textColor }}>
            {title ? titleWithHighlightedSuffix(title, titleSuffix, lang) : fallbackTitle(lang, titleSuffix)}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty" style={{ color: bodyTextColor, opacity: 0.78 }}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                className="relative flex min-h-[260px] flex-col items-center justify-center rounded-lg p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-8"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor: isHovered ? "var(--primary)" : "color-mix(in srgb, var(--primary) 5%, var(--bg-card))",
                }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                  style={{
                    backgroundColor: isHovered ? "var(--accent)" : "color-mix(in srgb, var(--primary) 10%, transparent)",
                    color: isHovered ? "#ffffff" : "var(--primary)",
                  }}
                >
                  <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                <div className="flex w-56 max-w-full flex-col items-center">
                  <h3
                    className="mb-3 flex min-h-12 w-full items-center justify-center text-center text-base font-semibold uppercase leading-snug tracking-wide"
                    style={{
                      color: isHovered ? "#ffffff" : textColor,
                      transition: "color 0.3s ease-out",
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="min-h-[4.5rem] w-full text-center text-sm leading-relaxed"
                    style={{
                      color: isHovered ? "rgba(255,255,255,0.9)" : bodyTextColor,
                      opacity: isHovered ? 1 : 0.78,
                      transition: "opacity 0.3s ease-out, color 0.3s ease-out",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
