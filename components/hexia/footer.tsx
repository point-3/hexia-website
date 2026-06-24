"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, MapPin, Linkedin, Facebook, Instagram, MessageCircle, Youtube } from "lucide-react"
import { t, getHrefWithLang } from "@/lib/i18n"
import { useLocale } from "@/hooks/use-locale"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { getRawCmsAssetUrl } from "@/lib/cms-assets"
import { getCategoriesFromCms } from "@/lib/api/cms-client"
import type { Category } from "@/lib/directus"
import {
  companyAddress,
  companyDescription,
  companyName,
  contactEmail,
  contactWhatsapp,
  footerCopyright,
  siteName,
  socialProfiles,
  whatsappHref,
} from "@/lib/site-profile"

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
} as const

type FooterLink = {
  label: string
  href: string
}

type JsonObject = Record<string, unknown>

const quickLinkDefinitions = [
  { key: "home", href: "/", labelKey: "nav.home", defaultLabel: "Home" },
  { key: "products", href: "/products", labelKey: "nav.products", defaultLabel: "Products" },
  { key: "service", href: "/service", labelKey: "nav.service", defaultLabel: "Service" },
  { key: "about", href: "/about", labelKey: "nav.about", defaultLabel: "About Us" },
  { key: "news", href: "/news", labelKey: "nav.news", defaultLabel: "News" },
  { key: "contact", href: "/contact", labelKey: "nav.contact", defaultLabel: "Contact Us" },
] as const

function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function localizedText(value: unknown, lang: string): string {
  if (typeof value === "string") return value.trim()
  if (!isJsonObject(value)) return ""

  const candidates = lang === "zh"
    ? [value.zh, value["zh-CN"], value.cn, value.en, value["en-US"]]
    : [value.en, value["en-US"], value.zh, value["zh-CN"], value.cn]

  for (const candidate of candidates) {
    const text = stringValue(candidate)
    if (text) return text
  }
  return ""
}

function applyLocaleToHref(href: string, lang: string): string {
  const trimmed = href.trim()
  if (!trimmed || trimmed === "#" || trimmed.startsWith("#")) return trimmed || "#"
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(trimmed)) return trimmed

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  const hashIndex = normalized.indexOf("#")
  if (hashIndex === -1) return getHrefWithLang(normalized, lang)

  const path = normalized.slice(0, hashIndex) || "/"
  const hash = normalized.slice(hashIndex)
  return `${getHrefWithLang(path, lang)}${hash}`
}

function defaultQuickLinks(lang: string): FooterLink[] {
  return quickLinkDefinitions.map((item) => ({
    label: t(item.labelKey, lang),
    href: applyLocaleToHref(item.href, lang),
  }))
}

function quickLinksFromConfig(value: unknown, lang: string): FooterLink[] {
  if (!Array.isArray(value)) return defaultQuickLinks(lang)

  return value.flatMap((item) => {
    if (!isJsonObject(item)) return []
    if (item.enabled === false || item.hidden === true) return []

    const key = stringValue(item.key).toLowerCase()
    const href = stringValue(item.href) || stringValue(item.url)
    const definition = quickLinkDefinitions.find((entry) => entry.key === key || entry.href === href)
    const configuredLabel =
      localizedText(item.label, lang) ||
      (lang === "zh" ? stringValue(item.label_zh) || stringValue(item.name_cn) : stringValue(item.label_en) || stringValue(item.name))
    const label = definition && (!configuredLabel || configuredLabel === definition.defaultLabel)
      ? t(definition.labelKey, lang)
      : configuredLabel
    const linkHref = href || definition?.href || ""

    if (!label || !linkHref) return []
    return [{ label, href: applyLocaleToHref(linkHref, lang) }]
  })
}

function fallbackProductLinks(lang: string): FooterLink[] {
  return [
    { label: t("footer.feedAdditives", lang), href: applyLocaleToHref("/products?category=Feed+Additives", lang) },
    { label: t("footer.foodAdditives", lang), href: applyLocaleToHref("/products?category=Food+Additives", lang) },
    { label: t("footer.nutrition", lang), href: applyLocaleToHref("/products?category=Nutrition", lang) },
    { label: t("footer.chineseSpecialty", lang), href: applyLocaleToHref("/products?category=Chinese+Specialty", lang) },
  ]
}

function productLinksFromCategories(categories: Category[], lang: string): FooterLink[] {
  return categories.flatMap((category) => {
    const label = lang === "zh"
      ? stringValue(category.name_cn) || stringValue(category.name)
      : stringValue(category.name) || stringValue(category.name_cn)

    if (!label) return []

    const query = new URLSearchParams({ category: label }).toString()
    return [{
      label,
      href: applyLocaleToHref(`/products?${query}`, lang),
    }]
  })
}

export function Footer() {
  const lang = useLocale()
  const siteSettings = useSiteSettings()
  const [cmsCategories, setCmsCategories] = useState<Category[] | null>(null)
  const footerLogoSrc = getRawCmsAssetUrl(siteSettings.footer_logo) || getRawCmsAssetUrl(siteSettings.logo)
  const socialLinks = socialProfiles(siteSettings)
  const email = contactEmail(siteSettings)
  const whatsapp = contactWhatsapp(siteSettings)
  const displayName = siteName(siteSettings, lang)
  const siteNameDisplayEnabled = siteSettings.site_name_display_enabled !== false

  useEffect(() => {
    let active = true

    getCategoriesFromCms()
      .then((categories) => {
        if (active) setCmsCategories(categories)
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[footer] categories fallback:", error)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const quickLinks = useMemo(() => quickLinksFromConfig(siteSettings.quick_links, lang), [lang, siteSettings.quick_links])
  const productLinks = useMemo(() => {
    if (cmsCategories === null) return fallbackProductLinks(lang)
    return productLinksFromCategories(cmsCategories, lang)
  }, [cmsCategories, lang])

  return (
    <footer id="contact" style={{ backgroundColor: "var(--site-footer-background-color)", color: "var(--site-footer-text-color)" }}>
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6 lg:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2" aria-label={`${displayName} homepage`}>
              {footerLogoSrc ? (
                <img src={footerLogoSrc} alt={`${displayName} Logo`} className="h-8 w-auto object-contain" />
              ) : null}
              {siteNameDisplayEnabled ? (
                <span className="text-lg font-bold uppercase text-[var(--site-footer-text-color)]">
                  {displayName}
                </span>
              ) : null}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-[var(--site-footer-text-color)] opacity-80">
              {companyName(siteSettings, lang)} - {companyDescription(siteSettings, lang)}
            </p>
            
            {socialLinks.length > 0 ? (
              <div className="mt-4 flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.key.toLowerCase() as keyof typeof socialIcons]
                  if (!Icon) return null
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-[var(--site-footer-text-color)] opacity-70 transition-colors hover:bg-[var(--site-footer-link-color)] hover:text-[var(--site-primary-color)] hover:opacity-100"
                    >
                      <Icon className="size-4" />
                    </a>
                  )
                })}
              </div>
            ) : null}

          </div>

          {quickLinks.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--site-footer-link-color)]">
                {t("footer.quickLinks", lang)}
              </h4>
              <ul className="mt-3 space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--site-footer-text-color)] opacity-80 transition-colors hover:text-[var(--site-footer-link-color)] hover:opacity-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productLinks.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--site-footer-link-color)]">
                {t("footer.products", lang)}
              </h4>
              <ul className="mt-3 space-y-2">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--site-footer-text-color)] opacity-80 transition-colors hover:text-[var(--site-footer-link-color)] hover:opacity-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--site-footer-link-color)]">
              {t("footer.contact", lang)}
            </h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-start gap-2 text-sm text-[var(--site-footer-text-color)] opacity-80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--site-footer-link-color)]" />
                <span>
                  <strong className="text-[var(--site-footer-text-color)]">{t("footer.hqTitle", lang)}</strong>
                  <br />
                  {companyAddress(siteSettings, lang).split("\n").map((line, index, lines) => (
                    <span key={index}>
                      {line}
                      {index < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--site-footer-text-color)] opacity-80">
                <Mail className="mt-0.5 size-4 shrink-0 text-[var(--site-footer-link-color)]" aria-hidden="true" />
                <span>
                  <a href={`mailto:${email}`} className="text-[var(--site-footer-text-color)] transition-colors hover:text-[var(--site-footer-link-color)]">
                    {email}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--site-footer-text-color)] opacity-80">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[var(--site-footer-link-color)]" aria-hidden="true" />
                <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className="text-[var(--site-footer-text-color)] transition-colors hover:text-[var(--site-footer-link-color)]">
                  {whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-6">
          <p className="text-center text-xs text-[var(--site-footer-text-color)] opacity-60">
            {footerCopyright(siteSettings, lang)}
          </p>
        </div>
      </div>
    </footer>
  )
}
