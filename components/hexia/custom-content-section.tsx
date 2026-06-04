"use client"

import { ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { PageSection } from "@/lib/directus"
import { getFileUrl } from "@/lib/directus"
import {
  getSectionConfig,
  getSectionTranslation,
  localizedText,
} from "@/lib/page-section-content"

function hrefWithLocale(href: string, lang: "en" | "zh"): string {
  const trimmed = href.trim()
  if (!trimmed || trimmed === "#" || trimmed.startsWith("#")) return trimmed || "#"
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(trimmed)) return trimmed
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  const params = new URLSearchParams()
  params.set("lang", lang)
  return normalized.includes("?") ? `${normalized}&${params.toString()}` : `${normalized}?${params.toString()}`
}

function sanitizeRichText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form|input|textarea|button)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form|input|textarea|button)[^>]*\/?>/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"]?)\s*(javascript:|data:text\/html)[^'">\s]*\2/gi, ' $1="#"')
}

export function CustomContentSection({ section }: { section: PageSection }) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang)
  const rawContent = translation?.content || localizedText(config.content || config.html, lang)
  const content = rawContent ? sanitizeRichText(rawContent) : ""
  const ctaLabel = translation?.cta_label || localizedText(config.cta_label || config.button_label, lang)
  const ctaHref = translation?.cta_href || localizedText(config.cta_href || config.button_href, lang)
  const backgroundColor = section.background_color || localizedText(config.background_color, lang) || "#FDFBF7"
  const textColor = section.text_color || localizedText(config.text_color, lang) || "#2D3436"
  const imageSrc = getFileUrl(section.image || localizedText(config.image, lang), { width: 1000, quality: 82, format: "webp" })
  const imagePosition = localizedText(config.image_position, lang).toLowerCase()
  const imageFirst = imagePosition === "left" || imagePosition === "top"

  if (!title && !subtitle && !content && !imageSrc && !ctaLabel) return null

  const copy = (
    <div>
      {title ? (
        <h2 className="text-3xl font-bold tracking-tight text-[#1B4D3E] sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="mt-4 text-lg font-medium text-[#2D6A4F]">
          {subtitle}
        </p>
      ) : null}
      {content ? (
        <div
          className="mt-6 space-y-4 text-pretty leading-relaxed"
          style={{ color: textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : null}
      {ctaLabel && ctaHref ? (
        <a
          href={hrefWithLocale(ctaHref, lang)}
          target={/^https?:/i.test(ctaHref) ? "_blank" : undefined}
          rel={/^https?:/i.test(ctaHref) ? "noopener noreferrer" : undefined}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#E9B35F] px-5 py-3 text-sm font-semibold text-[#1B4D3E] transition-colors hover:bg-[#2D6A4F] hover:text-white"
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </a>
      ) : null}
    </div>
  )

  const image = imageSrc ? (
    <img
      src={imageSrc}
      alt={title || subtitle || "Custom content"}
      width={1000}
      height={620}
      loading="lazy"
      className="h-auto w-full rounded-lg object-cover shadow-sm"
    />
  ) : null

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {image ? (
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {imageFirst ? image : copy}
            {imageFirst ? copy : image}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl text-center">
            {copy}
          </div>
        )}
      </div>
    </section>
  )
}
