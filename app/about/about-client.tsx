"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Target } from "lucide-react"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { PartnersSection } from "@/components/hexia/partners-section"
import { AboutHeroSection } from "@/components/hexia/about-hero-section"
import { AboutSection } from "@/components/hexia/about-section"
import { CustomContentSection } from "@/components/hexia/custom-content-section"
import type { PageLayout, PageSection } from "@/lib/directus"
import { fallbackSection, isCustomSection, sectionsForPage } from "@/lib/page-layout"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedSectionContent,
  localizedText,
  themeColor,
} from "@/lib/page-section-content"
import { sectionTitleWithSuffix } from "@/lib/section-title"

type Locale = "en" | "zh"

type InfoCard = {
  title: string
  body: string
  tags: string[]
}

function localizedStringList(value: unknown, lang: Locale): string[] {
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [item.trim()]
    if (!item || typeof item !== "object" || Array.isArray(item)) return []
    const row = item as Record<string, unknown>
    const text =
      fieldText(row, "label", lang) ||
      fieldText(row, "title", lang) ||
      fieldText(row, "name", lang) ||
      localizedText(row.value, lang)
    return text ? [text] : []
  })
}

function sectionText(
  section: PageSection,
  lang: Locale,
  key: "title" | "subtitle" | "content",
  fallback = "",
): string {
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  if (key === "title") return translation?.title || localizedText(config.title, lang) || fallback
  if (key === "subtitle") return translation?.subtitle || localizedText(config.subtitle || config.description, lang) || fallback
  return localizedSectionContent(section, lang, config) || fallback
}

function sectionTranslationContent(section: PageSection, lang: Locale, fallback = ""): string {
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  return (
    translation?.content ||
    localizedSectionContent(section, lang, config) ||
    fallback
  )
}

function CompanyHeroSection({ section, lang }: { section: PageSection; lang: Locale }) {
  const config = getSectionConfig(section, lang)
  const title = sectionText(section, lang, "title")
  const subtitle = sectionText(section, lang, "subtitle")
  const content = sectionTranslationContent(section, lang)
  const backgroundColor = themeColor(section.background_color || localizedText(config.background_color, lang))
  const textColor = themeColor(section.text_color || localizedText(config.text_color, lang), "var(--bg-card)")

  if (!title && !subtitle && !content) return null

  return (
    <section
      className={`relative z-0 py-16 lg:py-20 ${backgroundColor ? "" : "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]"}`}
      style={{ backgroundColor: backgroundColor || undefined, color: textColor }}
    >
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="about-company-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#about-company-pattern)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl" style={{ color: textColor }}>
            {sectionTitleWithSuffix(section, title, lang)}
          </h2>
          {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-lg opacity-80">{subtitle}</p> : null}
          {content ? (
            <div
              className="mx-auto mt-4 max-w-3xl text-pretty text-lg opacity-80"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function MissionSection({ section, lang }: { section: PageSection; lang: Locale }) {
  const config = getSectionConfig(section, lang)
  const title = sectionText(section, lang, "title")
  const subtitle = sectionText(section, lang, "subtitle")
  const content = sectionText(section, lang, "content")
  const backgroundColor = themeColor(section.background_color || localizedText(config.background_color, lang), "var(--bg-muted)")
  const textColor = themeColor(section.text_color || localizedText(config.text_color, lang), "var(--text-body)")

  if (!title && !subtitle && !content) return null

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--primary)]">
            <Target className="size-8 text-white" />
          </div>
          {title ? <h2 className="mt-6 text-2xl font-bold text-[var(--primary-dark)] sm:text-3xl">{sectionTitleWithSuffix(section, title, lang)}</h2> : null}
          {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-[var(--text-body)]">{subtitle}</p> : null}
          {content ? (
            <div
              className="mx-auto mt-4 max-w-2xl text-lg"
              style={{ color: textColor }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function configuredInfoCards(section: PageSection, lang: Locale): InfoCard[] {
  const config = getSectionConfig(section, lang)
  const sectionItems = asJsonArray(lang === "zh" ? section.presence_cards_zh : section.presence_cards_en)
  const items = sectionItems.length > 0 ? sectionItems : asJsonArray(config.cards || config.items || config.locations)
  return items.flatMap((item) => {
    const title = fieldText(item, "title", lang) || fieldText(item, "name", lang)
    const body =
      fieldText(item, "body", lang) ||
      fieldText(item, "content", lang) ||
      fieldText(item, "description", lang) ||
      localizedText(item.address, lang)
    if (!title && !body) return []
    return [{
      title,
      body,
      tags: localizedStringList(item.tags || item.areas, lang),
    }]
  })
}

function GlobalPresenceSection({ section, lang }: { section: PageSection; lang: Locale }) {
  const config = getSectionConfig(section, lang)
  const title = sectionText(section, lang, "title")
  const subtitle = sectionText(section, lang, "subtitle")
  const backgroundColor = themeColor(section.background_color || localizedText(config.background_color, lang), "var(--bg-page)")
  const cards = configuredInfoCards(section, lang)

  if (!title && !subtitle && cards.length === 0) return null

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--primary)]">
            <MapPin className="size-8 text-white" />
          </div>
          {title ? <h2 className="mt-6 text-2xl font-bold text-[var(--primary-dark)] sm:text-3xl">{sectionTitleWithSuffix(section, title, lang)}</h2> : null}
          {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-[var(--text-body)]">{subtitle}</p> : null}
        </div>

        {cards.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8">
              <h3 className="font-semibold text-[var(--primary-dark)]">{card.title}</h3>
              {card.body ? (
                <p className="mt-2 whitespace-pre-line text-[var(--text-body)]">{card.body}</p>
              ) : null}
              {card.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)]">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        ) : null}
      </div>
    </section>
  )
}

function AboutContent({ pageLayout }: { pageLayout: PageLayout }) {
  const searchParams = useSearchParams()
  const lang: Locale = searchParams.get("lang") === "zh" ? "zh" : "en"
  const sections = sectionsForPage(pageLayout, [
    fallbackSection("about_hero", "banner", 1),
    fallbackSection("company_intro", "about", 2),
    fallbackSection("company_hero", "company_hero", 3),
    fallbackSection("mission", "mission", 4),
    fallbackSection("global_presence", "global_presence", 5),
    fallbackSection("partners", "partners", 6),
  ])

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Navbar variant="transparent" />

      <main>
        {sections.map((section) => {
          if (isCustomSection(section)) return <CustomContentSection key={section.id} section={section} />
          if (section.section_key === "about_hero") return <AboutHeroSection key={section.id} section={section} />
          if (section.section_key === "company_intro") return <AboutSection key={section.id} section={section} />
          if (section.section_key === "company_hero") return <CompanyHeroSection key={section.id} section={section} lang={lang} />
          if (section.section_key === "mission") return <MissionSection key={section.id} section={section} lang={lang} />
          if (section.section_key === "global_presence") return <GlobalPresenceSection key={section.id} section={section} lang={lang} />
          if (section.section_key === "partners") return <PartnersSection key={section.id} section={section} />
          return null
        })}
      </main>

      <Footer />
    </div>
  )
}

export default function AboutPage({ pageLayout }: { pageLayout: PageLayout }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-[var(--text-body)]">Loading...</div>
      </div>
    }>
      <AboutContent pageLayout={pageLayout} />
    </Suspense>
  )
}
