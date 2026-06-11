"use client"

import { Headphones, Package, Shield, TrendingUp, Truck, type LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import { t } from "@/lib/i18n"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedText,
  themeColor,
} from "@/lib/page-section-content"

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
  package: Package,
  service: Headphones,
}

function iconByName(value: unknown): LucideIcon {
  if (typeof value !== "string") return Truck
  return iconMap[value.trim().toLowerCase()] ?? Truck
}

function fallbackServices(lang: "en" | "zh"): HomeService[] {
  return [
    { icon: Truck, title: t("home.serviceScmTitle", lang), description: t("home.serviceScmDesc", lang) },
    { icon: Shield, title: t("home.serviceQaTitle", lang), description: t("home.serviceQaDesc", lang) },
    { icon: TrendingUp, title: t("home.serviceMarketTitle", lang), description: t("home.serviceMarketDesc", lang) },
  ]
}

function configuredServices(section: PageSection | null | undefined, lang: "en" | "zh"): HomeService[] {
  const config = getSectionConfig(section, lang)
  const items = asJsonArray(config.services || config.items || config.cards)

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
      我们的 <span className="text-[var(--accent)]">专属服务</span>
    </>
  ) : (
    <>
      Our <span className="text-[var(--accent)]">Services</span>
    </>
  )
}

export function ServicesSection({ section }: { section?: PageSection | null }) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const services = configuredServices(section, lang)
  const displayServices = services.length > 0 ? services : fallbackServices(lang)
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang) || t("home.servicesDesc", lang)
  const backgroundColor = themeColor(section?.background_color || localizedText(config.background_color, lang), "var(--bg-page)")

  return (
    <section id="service" className="py-20 lg:py-28" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary-dark)] sm:text-4xl">
            {title || fallbackTitle(lang)}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[var(--text-body)]">
            {subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service) => (
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
