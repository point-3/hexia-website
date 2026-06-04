"use client"

import { useState } from "react"
import { Building2, Factory, Globe, Package, Shield, Sparkles, Users, Wrench, type LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import { t } from "@/lib/i18n"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedText,
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

function configuredFeatures(section: PageSection | null | undefined, lang: "en" | "zh"): WhyChooseFeature[] {
  const config = getSectionConfig(section, lang)
  const items = asJsonArray(config.features || config.items || config.cards)

  return items.flatMap((item) => {
    const title = fieldText(item, "title", lang)
    const description = fieldText(item, "description", lang) || fieldText(item, "desc", lang)
    if (!title && !description) return []
    return [{ icon: iconByName(item.icon), title, description }]
  })
}

function fallbackTitle(lang: "en" | "zh") {
  return lang === "zh" ? (
    <>
      为什么选择 <span className="text-[var(--hexia-gold)]">和夏</span>
    </>
  ) : (
    <>
      Why Choose <span className="text-[var(--hexia-gold)]">Hexia</span>
    </>
  )
}

export function WhyChooseSection({ section }: { section?: PageSection | null }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const configured = configuredFeatures(section, lang)
  const features = configured.length > 0 ? configured : fallbackFeatures(lang)
  const rows = features.length <= 4 ? [features] : [features.slice(0, 4), features.slice(4)]
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang) || t("home.whyChooseDesc", lang)
  const backgroundColor = section?.background_color || localizedText(config.background_color, lang) || "#FDFBF7"

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--hexia-forest-dark)] sm:text-4xl">
            {title || fallbackTitle(lang)}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
            {subtitle}
          </p>
        </div>

        <div className="hidden lg:block">
          {rows.map((row, rowIndex) => {
            const rowStart = rowIndex * 4
            const rowEnd = rowStart + row.length

            return (
              <div key={rowIndex} className={rowIndex === 0 && rows.length > 1 ? "flex gap-8 mb-8" : "flex gap-8"}>
                {row.map((feature, index) => {
                  const actualIndex = rowStart + index
                  const isHovered = hoveredIndex === actualIndex
                  const isOtherInRow = hoveredIndex !== null && hoveredIndex >= rowStart && hoveredIndex < rowEnd && hoveredIndex !== actualIndex

                  return (
                    <div
                      key={actualIndex}
                      className="relative"
                      style={{
                        flex: isHovered ? "0 0 calc(25% + 80px)" : isOtherInRow ? "1" : "1",
                        transition: "flex 0.5s ease-out",
                      }}
                      onMouseEnter={() => setHoveredIndex(actualIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 bottom-0 rounded-none shadow-xl"
                        style={{
                          backgroundColor: "#2D6A4F",
                          opacity: isHovered ? 1 : 0,
                          zIndex: 0,
                          transition: "opacity 0.5s ease-out",
                          marginLeft: isHovered ? "-40px" : "0",
                          marginRight: isHovered ? "-40px" : "0",
                        }}
                      />

                      <div className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center z-10">
                        <div
                          className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                          style={{
                            backgroundColor: isHovered ? "#E9B35F" : "rgba(45, 106, 79, 0.1)",
                            color: isHovered ? "#ffffff" : "#2D6A4F",
                          }}
                        >
                          <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                        </div>

                        <h3
                          className="text-base font-semibold text-center mb-3 uppercase tracking-wide"
                          style={{
                            color: isHovered ? "#ffffff" : "#1B4D3E",
                            transition: "color 0.5s ease-out",
                          }}
                        >
                          {feature.title}
                        </h3>

                        <p
                          className="text-sm text-center leading-relaxed"
                          style={{
                            opacity: isHovered ? 1 : 0,
                            color: isHovered ? "rgba(255,255,255,0.9)" : "#636E72",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
          {features.map((feature, index) => {
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                  style={{
                    backgroundColor: isHovered ? "#E9B35F" : "rgba(45, 106, 79, 0.1)",
                    color: isHovered ? "#ffffff" : "#2D6A4F",
                  }}
                >
                  <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                <h3 className="text-base font-semibold text-center text-[#1B4D3E] mb-3 uppercase tracking-wide">
                  {feature.title}
                </h3>

                <p
                  className="text-sm text-center text-[#636E72] leading-relaxed"
                  style={{
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
