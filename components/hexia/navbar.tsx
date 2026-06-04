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

interface NavbarProps {
  variant?: "transparent" | "solid"
}

export function Navbar({ variant = "solid" }: NavbarProps) {
  const lang = useLocale()
  const toggleLocale = useToggleLocale()
  const siteSettings = useSiteSettings()
  const primaryColor = siteSettings.primary_color || "#2D6A4F"
  const ctaColor = siteSettings.cta_color || "#E9B35F"
  const logoSrc = getRawCmsAssetUrl(siteSettings.logo) || "/images/金logo-03.svg"

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
    backgroundColor: variant === "transparent" ? hexToRgba(primaryColor, 0.3) : hexToRgba(primaryColor, 1),
  })
  const [isTransparent, setIsTransparent] = useState(variant === "transparent")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    if (variant !== "transparent") {
      setHeaderStyle({ backgroundColor: hexToRgba(primaryColor, 1) })
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
        opacity = 0.3 + (scrollY / STICKY_THRESHOLD) * 0.7
      } else {
        opacity = 1
      }

      if (scrollY <= STICKY_THRESHOLD) {
        setIsSticky(false)
        setIsTransparent(true)
        setHeaderStyle({
          backgroundColor: hexToRgba(primaryColor, opacity),
        })
      } else {
        setIsSticky(true)
        setIsTransparent(false)
        setHeaderStyle({
          backgroundColor: primaryColor,
        })
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [primaryColor, variant])

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 shadow-sm top-0 ${isTransparent ? "header-transparent" : ""}`}
      style={headerStyle}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isSticky ? "h-[56px]" : "h-14 lg:h-20"}`}>
          <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2" aria-label="Hexia homepage">
            <img
              src={logoSrc}
              alt="Hexia Logo"
              width={28}
              height={28}
              className="h-auto w-auto sm:w-8"
            />
            <span className="text-lg font-bold leading-tight sm:text-xl lg:text-2xl" style={{ color: ctaColor }}>
              HEXIA
            </span>
          </a>

          <nav className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-sm text-[var(--site-header-text-color)] transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-[var(--site-cta-color)] after:transition-all after:duration-300 hover:text-[var(--site-cta-color)] hover:after:w-full lg:text-base"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLocale}
              className="hidden items-center gap-1.5 text-base font-medium text-[var(--site-header-text-color)] transition-colors hover:text-[var(--site-cta-color)] sm:flex"
              aria-label="Switch language"
            >
              <Globe className="size-4" />
              <span>{lang === "en" ? "中文" : "EN"}</span>
            </button>

            <a href={getHrefWithLang("/contact", lang)}>
              <Button
                className="hidden border-2 border-[var(--site-cta-color)] bg-transparent text-sm font-semibold text-[var(--site-cta-color)] transition-all duration-300 hover:scale-105 hover:border-white hover:text-white sm:inline-flex"
                size="sm"
              >
                {t("common.getQuote", lang)}
              </Button>
            </a>

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
                className="flex size-12 items-center rounded-lg px-4 text-base text-[var(--site-header-text-color)] transition-colors hover:bg-white/10 hover:text-[var(--site-cta-color)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3 px-4">
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 text-lg font-medium text-[var(--site-header-text-color)]"
              >
                <Globe className="size-4" />
                <span>{lang === "en" ? "中文" : "EN"}</span>
              </button>
              <a href={getHrefWithLang("/contact", lang)}>
                <Button
                  className="border-2 border-[var(--site-cta-color)] bg-transparent text-[var(--site-cta-color)] hover:bg-[var(--site-cta-color)] hover:text-white"
                  size="sm"
                >
                  {t("common.getQuote", lang)}
                </Button>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
