"use client"

import { useState } from "react"
import { Building2, Factory, Globe, Package, Shield, Sparkles, Users, Wrench, type LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { whyChooseTitleSuffix } from "@/lib/site-profile"
import { sectionTitleWithSuffix } from "@/lib/section-title"
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

function hasJsonArray(value: unknown): boolean {
  if (Array.isArray(value)) return true
  if (typeof value !== "string" || !value.trim()) return false
  try {
    return Array.isArray(JSON.parse(value))
  } catch {
    return false
  }
}

function configuredFeatures(section: PageSection | null | undefined, lang: "en" | "zh"): WhyChooseFeature[] {
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

  return features
}

export function WhyChooseSection({ section }: { section?: PageSection | null }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const siteSettings = useSiteSettings()
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const features = configuredFeatures(section, lang)
  const rows = features.reduce<WhyChooseFeature[][]>((acc, feature, index) => {
    const rowIndex = Math.floor(index / 4)
    acc[rowIndex] = acc[rowIndex] || []
    acc[rowIndex].push(feature)
    return acc
  }, [])
  const title = translation?.title || localizedText(config.title, lang)
  const legacyConfiguredSuffix = localizedText(config.title_suffix || config.brand_suffix || config.highlight_suffix, lang)
  const titleSuffix = legacyConfiguredSuffix || whyChooseTitleSuffix(siteSettings, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang)
  const backgroundColor = "var(--bg-page)"
  const textColor = themeColor(section?.text_color || localizedText(config.text_color, lang), "var(--primary-dark)")
  const bodyTextColor = themeColor(localizedText(config.body_text_color, lang), textColor)

  if (features.length === 0) return null

  return (
    <section className="relative overflow-hidden py-16 lg:py-20" style={{ backgroundColor, color: textColor }}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title || subtitle ? (
        <div className="text-center mb-12 lg:mb-16">
          {title ? (
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: textColor }}>
            {sectionTitleWithSuffix(section, title, lang, titleSuffix)}
          </h2>
          ) : null}
          {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-pretty" style={{ color: bodyTextColor, opacity: 0.78 }}>
            {subtitle}
          </p>
          ) : null}
        </div>
        ) : null}

        <div className="hidden lg:block">
          {rows.map((row, rowIndex) => {
            const rowStart = rowIndex * 4
            const rowEnd = rowStart + row.length

            return (
              <div key={rowIndex} className={rowIndex === 0 && rows.length > 1 ? "mb-8 flex gap-8" : "flex gap-8"}>
                {row.map((feature, index) => {
                  const actualIndex = rowStart + index
                  const isHovered = hoveredIndex === actualIndex
                  const isOtherInRow =
                    hoveredIndex !== null &&
                    hoveredIndex >= rowStart &&
                    hoveredIndex < rowEnd &&
                    hoveredIndex !== actualIndex

                  return (
                    <div
                      key={actualIndex}
                      className="relative"
                      onMouseEnter={() => setHoveredIndex(actualIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        flex: isHovered ? "0 0 calc(25% + 80px)" : isOtherInRow ? "1" : "1",
                        transition: "flex 0.5s ease-out",
                        zIndex: isHovered ? 20 : 1,
                      }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 top-0 rounded-none shadow-xl"
                        style={{
                          backgroundColor: "var(--primary)",
                          opacity: isHovered ? 1 : 0,
                          zIndex: 0,
                          marginLeft: isHovered ? "-40px" : "0",
                          marginRight: isHovered ? "-40px" : "0",
                          transition: "opacity 0.5s ease-out, margin 0.5s ease-out",
                        }}
                      />

                      <div
                        className="relative z-10 flex min-h-[260px] flex-col items-center justify-center p-6 text-center lg:p-8"
                      >
                        <div
                          className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500"
                          style={{
                            backgroundColor: isHovered ? "var(--accent)" : "color-mix(in srgb, var(--primary) 10%, transparent)",
                            color: isHovered ? "#ffffff" : "var(--primary)",
                          }}
                        >
                          <feature.icon className="h-7 w-7" strokeWidth={1.5} />
                        </div>

                        <h3
                          className="mb-3 text-center text-base font-semibold uppercase leading-snug tracking-wide"
                          style={{
                            color: isHovered ? "#ffffff" : textColor,
                            transition: "color 0.5s ease-out",
                          }}
                        >
                          {feature.title}
                        </h3>

                        <p
                          className="text-center text-sm leading-relaxed"
                          style={{
                            color: isHovered ? "rgba(255,255,255,0.9)" : bodyTextColor,
                            opacity: isHovered ? 1 : 0,
                            transition: "opacity 0.5s ease-out, color 0.5s ease-out",
                          }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
          {features.map((feature, index) => {
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                className="relative flex min-h-[260px] flex-col items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_5%,var(--bg-card))] p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500"
                  style={{
                    backgroundColor: isHovered ? "var(--accent)" : "color-mix(in srgb, var(--primary) 10%, transparent)",
                    color: isHovered ? "#ffffff" : "var(--primary)",
                  }}
                >
                  <feature.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>

                <h3
                  className="mb-3 text-center text-base font-semibold uppercase leading-snug tracking-wide"
                  style={{
                    color: textColor,
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  className="text-center text-sm leading-relaxed"
                  style={{
                    color: bodyTextColor,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.5s ease-out",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
