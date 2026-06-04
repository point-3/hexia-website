"use client"

import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedText,
} from "@/lib/page-section-content"

const fallbackPartners = [
  "Dongxiao",
  "Sinophos",
  "NHU",
  "Fufeng",
  "Meihua",
  "New Hope Group",
]

function configuredPartners(section: PageSection | null | undefined, lang: "en" | "zh"): string[] {
  const config = getSectionConfig(section, lang)
  const rawItems = config.partners || config.items || config.logos

  if (Array.isArray(rawItems)) {
    const items = rawItems.flatMap((item) => {
      if (typeof item === "string" && item.trim()) return [item.trim()]
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const partner = fieldText(item as Record<string, unknown>, "name", lang) || fieldText(item as Record<string, unknown>, "title", lang)
        return partner ? [partner] : []
      }
      return []
    })
    if (items.length > 0) return items
  }

  return asJsonArray(rawItems).flatMap((item) => {
    const partner = fieldText(item, "name", lang) || fieldText(item, "title", lang)
    return partner ? [partner] : []
  })
}

function fallbackTitle() {
  return (
    <>
      Trusted by <span className="text-[#E9B35F]">Industry Leaders</span>
    </>
  )
}

export function PartnersSection({ section }: { section?: PageSection | null }) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const partners = configuredPartners(section, lang)
  const displayPartners = partners.length > 0 ? partners : fallbackPartners
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang)
  const backgroundColor = section?.background_color || localizedText(config.background_color, lang) || "#FDFBF7"

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1B4D3E] sm:text-3xl">
            {title || fallbackTitle()}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {displayPartners.map((partner) => (
            <div
              key={partner}
              className="flex h-20 w-36 items-center justify-center rounded-lg border border-[#A3B18A] bg-white px-6 py-4 opacity-70 transition-all duration-300 hover:border-[#2D6A4F] hover:opacity-100 hover:shadow-md sm:h-24 sm:w-40"
            >
              <span className="text-center text-sm font-semibold text-[#636E72]">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
