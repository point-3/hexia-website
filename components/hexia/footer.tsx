"use client"

import { Mail, MapPin, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { t, getHrefWithLang } from "@/lib/i18n"

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/justin-jia-8995a6364", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/haibin2280?igsh=MTh0cXl2YnJxNnIxcQ%3D%3D&utm_source=qr", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/share/1BAkfLuv6y/?mibextid=wwXIfr", label: "Facebook" },
]

export function Footer() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

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
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                HEXIA
              </span>
            </a>
            <p className="mt-4 text-sm text-white leading-relaxed">
              Hexia (Suzhou) Biotechnology Co., Ltd. - {t("footer.tagline", lang)}
            </p>
            
            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-[#E9B35F] hover:text-[#1B4D3E]"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              {t("footer.quickLinks", lang)}
            </h4>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              {t("footer.products", lang)}
            </h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              {t("footer.contact", lang)}
            </h4>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-white">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <span>
                  <strong className="text-white">Suzhou HQ</strong><br />
                  ROOM 232A, BUILDING A, NO. 188 SUHONG EAST ROAD, SUZHOU INDUSTRIAL PARK, SUZHOU AREA, CHINA (JIANGSU) PILOT FREE TRADE ZONE
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <span>
                  <a href="mailto:justin@hexiabio.com" className="text-white transition-colors hover:text-[#E9B35F]">
                    justin@hexiabio.com
                  </a><br />
                  <a href="mailto:morehope.justin@gmail.com" className="text-white transition-colors hover:text-[#E9B35F]">
                    morehope.justin@gmail.com
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <a href="https://wa.me/+8613862320011" target="_blank" rel="noopener noreferrer" className="text-white transition-colors hover:text-[#E9B35F]">
                  +86 138 6232 0011
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white">
            Copyright © 2026 Hexia (Suzhou) Biotechnology Co., Ltd. {t("footer.rights", lang)}
          </p>
        </div>
      </div>
    </footer>
  )
}
