"use client"

import { Mail, MapPin, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react"
import { t, getHrefWithLang } from "@/lib/i18n"
import { useLocale } from "@/hooks/use-locale"

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/justin-jia-8995a6364", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/haibin2280?igsh=MTh0cXl2YnJxNnIxcQ%3D%3D&utm_source=qr", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/share/1BAkfLuv6y/?mibextid=wwXIfr", label: "Facebook" },
]

export function Footer() {
  const lang = useLocale()

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
    <footer id="contact" className="bg-[#2D6A4F]">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6 lg:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2" aria-label="Hexia homepage">
              <span className="text-lg font-bold text-white">
                HEXIA
              </span>
            </a>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Hexia (Suzhou) Biotechnology Co., Ltd. - {t("footer.tagline", lang)}
            </p>
            
            <div className="mt-4 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-[#E9B35F] hover:text-[#1B4D3E]"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              {t("footer.quickLinks", lang)}
            </h4>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              {t("footer.products", lang)}
            </h4>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              {t("footer.contact", lang)}
            </h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <span>
                  <strong className="text-white">{t("footer.hqTitle", lang)}</strong>
                  <br />
                  {t("footer.hqAddress", lang).split("\n").map((line, index, lines) => (
                    <span key={index}>
                      {line}
                      {index < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" title="Email" />
                <span>
                  <a href="mailto:justin@hexiabio.com" className="text-white transition-colors hover:text-[#E9B35F]">
                    justin@hexiabio.com
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" title="WhatsApp" />
                <a href="https://wa.me/+8613862320011" target="_blank" rel="noopener noreferrer" className="text-white transition-colors hover:text-[#E9B35F]">
                  +86 138 6232 0011
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-6">
          <p className="text-center text-xs text-white/60">
            Copyright © 2026 Hexia (Suzhou) Biotechnology Co., Ltd. {t("footer.rights", lang)}
          </p>
        </div>
      </div>
    </footer>
  )
}