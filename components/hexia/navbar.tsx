"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { t, getHrefWithLang } from "@/lib/i18n"

interface NavbarProps {
  variant?: "transparent" | "solid"
}

export function Navbar({ variant = "solid" }: NavbarProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const lang = searchParams.get("lang") || "en"

  const navItems = [
    { label: t("nav.home", lang), href: getHrefWithLang("/", lang) },
    { label: t("nav.products", lang), href: getHrefWithLang("/products", lang) },
    { label: t("nav.service", lang), href: getHrefWithLang("/service", lang) },
    { label: t("nav.about", lang), href: getHrefWithLang("/about", lang) },
    { label: t("nav.news", lang), href: getHrefWithLang("/news", lang) },
    { label: t("nav.contact", lang), href: getHrefWithLang("/contact", lang) },
  ]

  const handleLanguageToggle = () => {
    const newLang = lang === "en" ? "zh" : "en"
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", newLang)
    router.push(`${pathname}?${params.toString()}`)
  }

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isSticky ? "h-[60px]" : "h-16 lg:h-20"}`}>
          {/* Logo */}
          <a href={getHrefWithLang("/", lang)} className="flex items-center gap-2">
            <span className="text-xl font-bold leading-tight text-white lg:text-2xl">
              HEXIA
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-base text-white transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-[#E9B35F] after:transition-all after:duration-300 hover:text-[#63AE30] hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <button
                onClick={handleLanguageToggle}
                className="hidden items-center gap-1.5 text-base font-medium text-white transition-colors hover:text-[#63AE30] sm:flex"
              >
                <Globe className="size-4" />
                <span>{lang === "en" ? "中文" : "EN"}</span>
              </button>

            {/* Get a Quote Button */}
            <a href={getHrefWithLang("/contact", lang)}>
              <Button
                className="hidden border-2 border-[#E9B35F] bg-transparent text-sm font-semibold text-[#E9B35F] transition-all duration-300 hover:scale-105 hover:text-white hover:border-white sm:inline-flex"
                size="sm"
              >
                {t("common.getQuote", lang)}
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center text-white transition-colors lg:hidden"
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
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-[#63AE30]/10 hover:text-[#63AE30]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3 px-4">
              <button
                onClick={handleLanguageToggle}
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
