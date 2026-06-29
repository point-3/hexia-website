"use client"

import { BarChart3, GraduationCap, Headphones, Package, Shield, TrendingUp, Truck, type LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedText,
  themeColor,
} from "@/lib/page-section-content"
import { sectionTitleWithSuffix } from "@/lib/section-title"

type HomeService = {
  icon: LucideIcon
  title: string
  description: string
}

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  logistics: Truck,
  shield: Shield,
  quality: Shield,
  trendingup: TrendingUp,
  market: TrendingUp,
  chart: BarChart3,
  package: Package,
  service: Headphones,
  academy: GraduationCap,
}

function iconByName(value: unknown): LucideIcon {
  if (typeof value !== "string") return Truck
  return iconMap[value.trim().toLowerCase()] ?? Truck
}

function configuredServices(section: PageSection | null | undefined, lang: "en" | "zh"): HomeService[] {
  const config = getSectionConfig(section, lang)
  const sectionItems = asJsonArray(lang === "zh" ? section?.home_service_cards_zh : section?.home_service_cards_en)
  const items = sectionItems.length > 0 ? sectionItems : asJsonArray(config.services || config.items || config.cards)

  return items.flatMap((item) => {
    const title = fieldText(item, "title", lang)
    const description = fieldText(item, "description", lang) || fieldText(item, "desc", lang)
    if (!title && !description) return []
    return [{ icon: iconByName(item.icon), title, description }]
  })
}

export function ServicesSection({ section }: { section?: PageSection | null }) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const services = configuredServices(section, lang)
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang)
  const backgroundColor = themeColor(section?.background_color || localizedText(config.background_color, lang), "var(--bg-page)")

  if (services.length === 0) return null

  return (
    <section id="service" className="py-20 lg:py-28" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title || subtitle ? (
        <div className="text-center">
          {title ? (
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary-dark)] sm:text-4xl">
            {sectionTitleWithSuffix(section, title, lang)}
          </h2>
          ) : null}
          {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[var(--text-body)]">
            {subtitle}
          </p>
          ) : null}
        </div>
        ) : null}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-lg border-l-4 border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
            >
              <div className="mb-6 inline-flex rounded-lg bg-[var(--primary)]/10 p-4 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                <service.icon className="size-6" />
              </div>

              <h3 className="text-xl font-semibold text-[var(--primary-dark)]">
                {service.title}
              </h3>
              <p className="mt-3 text-pretty text-[var(--text-body)] leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
