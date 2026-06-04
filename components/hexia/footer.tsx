"use client"

import { Mail, MapPin, Linkedin, Facebook, Instagram, MessageCircle, Youtube } from "lucide-react"
import { t, getHrefWithLang } from "@/lib/i18n"
import { useLocale } from "@/hooks/use-locale"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { getRawCmsAssetUrl } from "@/lib/cms-assets"
import {
  companyAddress,
  companyDescription,
  companyName,
  contactEmail,
  contactWhatsapp,
  footerCopyright,
  socialProfiles,
  whatsappHref,
} from "@/lib/site-profile"

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
} as const

export function Footer() {
  const lang = useLocale()
  const siteSettings = useSiteSettings()
  const footerLogoSrc = getRawCmsAssetUrl(siteSettings.footer_logo) || getRawCmsAssetUrl(siteSettings.logo)
  const socialLinks = socialProfiles(siteSettings)
  const email = contactEmail(siteSettings)
  const whatsapp = contactWhatsapp(siteSettings)

  const quickLinks = [
    { label: t("nav.home", lang), href: getHrefWithLang("/", lang) },
    { label: t("nav.products", lang), href: getHrefWithLang("/products", lang) },
    { label: t("nav.service", lang), href: getHrefWithLang("/service", lang) },
    { label: t("nav.about", lang), href: getHrefWithLang("/about", lang) },
    { label: t("nav.news", lang), href: getHrefWithLang("/news", lang) },
    { label: t("nav.contact", lang), href: getHrefWithLang("/contact", lang) },
  ]

  const productLinks = [
    { label: t("footer.feedAdditives", lang), href: getHrefWithLang("/products?category=Feed+Additives", lang) },
    { label: t("footer.foodAdditives", lang), href: getHrefWithLang("/products?category=Food+Additives", lang) },
    { label: t("footer.nutrition", lang), href: getHrefWithLang("/products?category=Nutrition", lang) },
    { label: t("footer.chineseSpecialty", lang), href: getHrefWithLang("/products?category=Chinese+Specialty", lang) },
  ]
  return (
    <footer id="contact" style={{ backgroundColor: "var(--site-footer-background-color)", color: "var(--site-footer-text-color)" }}>
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6 lg:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2" aria-label="Hexia homepage">
              {footerLogoSrc ? (
                <img src={footerLogoSrc} alt="Hexia Logo" width={32} height={32} className="h-8 w-auto" />
              ) : null}
              <span className="text-lg font-bold text-[var(--site-footer-text-color)]">
                HEXIA
              </span>
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
