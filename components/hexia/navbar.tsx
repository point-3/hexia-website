"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Service", href: "/service" },
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact Us", href: "/contact" },
]

interface NavbarProps {
  variant?: "transparent" | "solid"
}

export function Navbar({ variant = "solid" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<"EN" | "中">("EN")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // In "solid" mode, always use the scrolled (dark-text) style
  const useDarkText = variant === "solid" || isScrolled

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        useDarkText
          ? "bg-white/80 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Leaf className={cn(
              "size-7 transition-colors",
              useDarkText ? "text-[#2D6A4F]" : "text-[#E9B35F]"
            )} />
            <div className="flex flex-col">
              <span className={cn(
                "text-lg font-bold leading-tight transition-colors lg:text-xl",
                useDarkText ? "text-[#2D3436]" : "text-white"
              )}>
                HEXIA BIOTECH
              </span>
              <span className={cn(
                "text-xs font-medium transition-colors",
                useDarkText ? "text-[#636E72]" : "text-white/70"
              )}>
                和夏生物
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-[#2D6A4F] after:transition-all after:duration-300 hover:after:w-full",
                  useDarkText
                    ? "text-[#636E72] hover:text-[#2D6A4F]"
                    : "text-white/80 hover:text-white after:bg-[#E9B35F]"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === "EN" ? "中" : "EN")}
              className={cn(
                "hidden items-center gap-1.5 text-sm font-medium transition-colors sm:flex",
                useDarkText
                  ? "text-[#636E72] hover:text-[#2D6A4F]"
                  : "text-white/80 hover:text-white"
              )}
            >
              <Globe className="size-4" />
              <span>{language}</span>
            </button>

            {/* Get a Quote Button */}
            <a href="/contact">
              <Button
                className="hidden border-2 border-[#E9B35F] bg-transparent text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#E9B35F] sm:inline-flex"
                style={{
                  color: useDarkText ? "#E9B35F" : "#E9B35F",
                }}
                size="sm"
              >
                Get a Quote
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "flex items-center justify-center transition-colors lg:hidden",
                useDarkText ? "text-[#2D3436]" : "text-white"
              )}
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
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  useDarkText
                    ? "text-[#636E72] hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3 px-4">
              <button
                onClick={() => setLanguage(language === "EN" ? "中" : "EN")}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  useDarkText ? "text-[#636E72]" : "text-white/80"
                )}
              >
                <Globe className="size-4" />
                <span>{language}</span>
              </button>
              <a href="/contact">
                <Button
                  className="border-2 border-[#E9B35F] bg-transparent text-[#E9B35F] hover:bg-[#E9B35F] hover:text-white"
                  size="sm"
                >
                  Get a Quote
                </Button>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
