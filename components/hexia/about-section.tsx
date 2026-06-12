"use client"

import { useEffect, useRef, useState } from "react"
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
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { brandHighlightName } from "@/lib/site-profile"

type HomeStat = {
  value: number
  suffix: string
  label: string
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const startTime = Date.now()

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(value * easeOut))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  )
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return fallback
}

function fallbackStats(lang: "en" | "zh"): HomeStat[] {
  return [
    { value: 20, suffix: "+", label: t("home.statsExp", lang) },
    { value: 642, suffix: "+", label: t("home.statsPartners", lang) },
    { value: 175, suffix: "+", label: t("home.statsCountries", lang) },
    { value: 24, suffix: "/7", label: t("home.statsSupport", lang) },
  ]
}

function configuredStats(section: PageSection | null | undefined, lang: "en" | "zh"): HomeStat[] {
  const translation = getSectionTranslation(section, lang)
  const translatedStats = asJsonArray(translation?.stat_cards)
  const config = getSectionConfig(section, lang)
  const items = translatedStats.length > 0 ? translatedStats : asJsonArray(config.stats || config.items || config.cards)

  return items
    .slice()
    .sort((a, b) => numberValue(a.sort, 0) - numberValue(b.sort, 0))
    .flatMap((item) => {
      const label = fieldText(item, "label", lang) || fieldText(item, "title", lang)
      if (!label) return []
      return [{
        value: numberValue(item.value ?? item.number),
        suffix: localizedText(item.suffix, lang),
        label,
      }]
    })
}

function configuredParagraphs(value: unknown, lang: "en" | "zh"): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => localizedText(item, lang))
    .filter(Boolean)
}

export function AboutSection({ section }: { section?: PageSection | null }) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const siteSettings = useSiteSettings()
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const stats = configuredStats(section, lang)
  const displayStats = stats.length > 0 ? stats : fallbackStats(lang)
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle, lang)
  const content = translation?.content || localizedText(config.content, lang)
  const paragraphs = configuredParagraphs(config.paragraphs, lang)
  const backgroundColor = themeColor(section?.background_color || localizedText(config.background_color, lang), "var(--bg-page)")
  const statBackgroundColor = themeColor(localizedText(config.stat_background_color, lang), "var(--primary-dark)")

  return (
    <section id="about" className="py-20 lg:py-28" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--primary-dark)] sm:text-4xl">
              {title || (
                <>
                  {lang === "zh" ? "关于 " : "About "}
                  <span className="text-[var(--accent)]">{brandHighlightName(siteSettings, lang)}</span>
                </>
              )}
            </h2>
            {subtitle ? (
              <p className="mt-4 text-lg font-medium text-[var(--primary)]">{subtitle}</p>
            ) : null}

            <div className="mt-6 space-y-4 text-pretty text-[var(--text-body)] leading-relaxed">
              {content ? (
                <div className="space-y-4" dangerouslySetInnerHTML={{ __html: content }} />
              ) : paragraphs.length > 0 ? (
                paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <>
                  <p>{t("home.aboutP1", lang)}</p>
                  <p>{t("home.aboutP2", lang)}</p>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {displayStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-h-[128px] flex-col items-center justify-center rounded-lg p-6 text-center transition-all duration-300"
                  style={{ backgroundColor: statBackgroundColor }}
                >
                  <span className="text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-2 text-sm text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
