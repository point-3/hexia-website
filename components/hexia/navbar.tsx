"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { t, getHrefWithLang } from "@/lib/i18n"
import { useLocale, useToggleLocale } from "@/hooks/use-locale"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { getRawCmsAssetUrl } from "@/lib/cms-assets"
import { hexToRgba } from "@/lib/site-theme"
import { quoteButtonText, siteName } from "@/lib/site-profile"

interface NavbarProps {
  variant?: "transparent" | "solid"
}

export function Navbar({ variant = "solid" }: NavbarProps) {
  const lang = useLocale()
  const toggleLocale = useToggleLocale()
  const siteSettings = useSiteSettings()
  const primaryColor = siteSettings.theme_primary || siteSettings.header_background_color || "#2D6A4F"
  const ctaColor = siteSettings.theme_accent || siteSettings.cta_color || "#E9B35F"
  const headerBackgroundColor = primaryColor
  const headerOpacity = Math.max(0, Math.min(1, (siteSettings.header_background_opacity ?? 100) / 100))
  const quoteEnabled = siteSettings.quote_button_enabled !== false
  const languageSwitchEnabled = siteSettings.language_switch_enabled !== false
  const siteNameDisplayEnabled = siteSettings.site_name_display_enabled !== false
  const logoSrc = getRawCmsAssetUrl(siteSettings.logo)
  const quoteText = quoteButtonText(siteSettings, lang)
  const displayName = siteName(siteSettings, lang)

  const navItems = [
    { label: t("nav.home", lang), href: getHrefWithLang("/", lang) },
    { label: t("nav.products", lang), href: getHrefWithLang("/products", lang) },
    { label: t("nav.service", lang), href: getHrefWithLang("/service", lang) },
    { label: t("nav.about", lang), href: getHrefWithLang("/about", lang) },
    { label: t("nav.news", lang), href: getHrefWithLang("/news", lang) },
    { label: t("nav.contact", lang), href: getHrefWithLang("/contact", lang) },
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [headerStyle, setHeaderStyle] = useState({
    backgroundColor: variant === "transparent" ? hexToRgba(headerBackgroundColor, 0.3) : hexToRgba(headerBackgroundColor, headerOpacity),
  })
  const [isTransparent, setIsTransparent] = useState(variant === "transparent")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    if (variant !== "transparent") {
      setHeaderStyle({ backgroundColor: hexToRgba(headerBackgroundColor, headerOpacity) })
      setIsTransparent(false)
      setIsSticky(true)
      return
    }

    const STICKY_THRESHOLD = 400

    const handleScroll = () => {
      const scrollY = window.scrollY
      let opacity = 1

      if (scrollY <= 0) {
        opacity = 0.3
      } else if (scrollY < STICKY_THRESHOLD) {
        opacity = 0.3 + (scrollY / STICKY_THRESHOLD) * (headerOpacity - 0.3)
      } else {
        opacity = headerOpacity
      }

      if (scrollY <= STICKY_THRESHOLD) {
        setIsSticky(false)
        setIsTransparent(true)
        setHeaderStyle({
          backgroundColor: hexToRgba(headerBackgroundColor, opacity),
        })
      } else {
        setIsSticky(true)
        setIsTransparent(false)
        setHeaderStyle({
          backgroundColor: hexToRgba(headerBackgroundColor, headerOpacity),
        })
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headerBackgroundColor, headerOpacity, variant])

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 shadow-sm top-0 ${isTransparent ? "header-transparent" : ""}`}
      style={headerStyle}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isSticky ? "h-[56px]" : "h-14 lg:h-20"}`}>
          <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2" aria-label={`${displayName} homepage`}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={`${displayName} Logo`}
                className="h-8 w-auto object-contain"
              />
            ) : null}
            {siteNameDisplayEnabled || !logoSrc ? (
              <span className="text-lg font-bold uppercase leading-tight sm:text-xl lg:text-2xl" style={{ color: ctaColor }}>
                {displayName}
              </span>
            ) : null}
          </a>

          <nav className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-sm text-[var(--site-header-text-color)] transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-[var(--site-cta-color)] after:transition-all after:duration-300 hover:text-[var(--site-header-hover-text-color)] hover:after:w-full lg:text-base"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {languageSwitchEnabled ? (
              <button
                onClick={toggleLocale}
                className="hidden items-center gap-1.5 text-base font-medium text-[var(--site-header-text-color)] transition-colors hover:text-[var(--site-header-hover-text-color)] sm:flex"
                aria-label="Switch language"
              >
                <Globe className="size-4" />
                <span>{lang === "en" ? "中文" : "EN"}</span>
              </button>
            ) : null}

            {quoteEnabled ? (
            <a href={getHrefWithLang("/contact", lang)}>
              <Button
                className="hidden border-2 border-[var(--site-cta-color)] bg-transparent text-sm font-semibold text-[var(--site-cta-color)] transition-all duration-300 hover:scale-105 hover:border-white hover:text-white sm:inline-flex"
                size="sm"
              >
                {quoteText}
              </Button>
            </a>
            ) : null}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex size-10 items-center justify-center rounded-lg text-[var(--site-header-text-color)] transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 lg:hidden",
            isMobileMenuOpen ? "max-h-[500px] pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex size-12 items-center rounded-lg px-4 text-base text-[var(--site-header-text-color)] transition-colors hover:bg-white/10 hover:text-[var(--site-header-hover-text-color)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3 px-4">
              {languageSwitchEnabled ? (
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-1.5 text-lg font-medium text-[var(--site-header-text-color)]"
                >
                  <Globe className="size-4" />
                  <span>{lang === "en" ? "中文" : "EN"}</span>
                </button>
              ) : null}
              {quoteEnabled ? (
              <a href={getHrefWithLang("/contact", lang)}>
                <Button
                  className="border-2 border-[var(--site-cta-color)] bg-transparent text-[var(--site-cta-color)] hover:bg-[var(--site-cta-color)] hover:text-white"
                  size="sm"
                >
                  {quoteText}
                </Button>
              </a>
              ) : null}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
