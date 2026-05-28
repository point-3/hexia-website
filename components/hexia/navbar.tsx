"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { t, getHrefWithLang } from "@/lib/i18n"
import { useLocale, useToggleLocale } from "@/hooks/use-locale"

interface NavbarProps {
  variant?: "transparent" | "solid"
}

export function Navbar({ variant = "solid" }: NavbarProps) {
  const lang = useLocale()
  const toggleLocale = useToggleLocale()

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
    backgroundColor: variant === "transparent" ? "rgba(45, 106, 79, 0.3)" : "rgba(45, 106, 79, 1)",
  })
  const [isTransparent, setIsTransparent] = useState(variant === "transparent")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    if (variant !== "transparent") {
      setHeaderStyle({ backgroundColor: "rgba(45, 106, 79, 1)" })
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
          backgroundColor: `rgba(45, 106, 79, ${opacity})`,
        })
      } else {
        setIsSticky(true)
        setIsTransparent(false)
        setHeaderStyle({
          backgroundColor: "#2D6A4F",
        })
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [variant])

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 shadow-sm top-0 ${isTransparent ? "header-transparent" : ""}`}
      style={headerStyle}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isSticky ? "h-[56px]" : "h-14 lg:h-20"}`}>
          {/* Logo */}
<<<<<<< HEAD
          <a href="/" className="flex items-center gap-2" aria-label="Hexia homepage">
            <Image
              src="/images/金logo-03.svg"
              alt="Hexia Logo"
              width={28}
              height={28}
              className="h-auto w-auto sm:w-8"
            />
            <span className="text-lg font-bold leading-tight text-[#E9B35F] sm:text-xl lg:text-2xl">
=======
          <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2">
            <span className="text-xl font-bold leading-tight text-white lg:text-2xl">
>>>>>>> 2bd17698e421a88bfe1acd84bdbe85b330dccc2e
              HEXIA
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-sm text-white transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-[#E9B35F] after:transition-all after:duration-300 hover:text-[#63AE30] hover:after:w-full lg:text-base"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch */}
            <button
<<<<<<< HEAD
              onClick={() => setLanguage(language === "EN" ? "中" : "EN")}
              className="flex size-10 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-[#63AE30]"
              aria-label="Switch language"
            >
              <Globe className="size-4" />
              <span className="hidden sm:inline">{language}</span>
            </button>
=======
                onClick={toggleLocale}
                className="hidden items-center gap-1.5 text-base font-medium text-white transition-colors hover:text-[#63AE30] sm:flex"
              >
                <Globe className="size-4" />
                <span>{lang === "en" ? "中文" : "EN"}</span>
              </button>
>>>>>>> 2bd17698e421a88bfe1acd84bdbe85b330dccc2e

            {/* Get a Quote Button */}
            <a href={getHrefWithLang("/contact", lang)}>
              <Button
                className="hidden border-2 border-[#E9B35F] bg-transparent text-sm font-semibold text-[#E9B35F] transition-all duration-300 hover:scale-105 hover:text-white hover:border-white sm:inline-flex"
                size="sm"
              >
<<<<<<< HEAD
                Get Quote
=======
                {t("common.getQuote", lang)}
>>>>>>> 2bd17698e421a88bfe1acd84bdbe85b330dccc2e
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex size-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
                className="flex size-12 items-center rounded-lg px-4 text-base text-white transition-colors hover:bg-[#63AE30]/10 hover:text-[#63AE30]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
<<<<<<< HEAD
            <div className="mt-2 flex items-center justify-center gap-3 px-4">
              <Button
                className="w-full border-2 border-[#E9B35F] bg-transparent text-base font-semibold text-[#E9B35F] hover:bg-[#E9B35F] hover:text-white"
                size="lg"
              >
                Get a Quote
              </Button>
=======
            <div className="mt-2 flex items-center gap-3 px-4">
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 text-lg font-medium text-white"
              >
                <Globe className="size-4" />
                <span>{lang === "en" ? "中文" : "EN"}</span>
              </button>
              <a href={getHrefWithLang("/contact", lang)}>
                <Button
                  className="border-2 border-[#E9B35F] bg-transparent text-[#E9B35F] hover:bg-[#E9B35F] hover:text-white"
                  size="sm"
                >
                  {t("common.getQuote", lang)}
                </Button>
              </a>
>>>>>>> 2bd17698e421a88bfe1acd84bdbe85b330dccc2e
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
