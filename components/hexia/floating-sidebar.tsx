"use client"

import { useState, useRef } from "react"
import type { CSSProperties } from "react"
import { Phone, MessageCircle, Mail, ArrowUp } from "lucide-react"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { contactEmail, contactPhone, contactWhatsapp, telHref, whatsappHref } from "@/lib/site-profile"

type HoveredIcon = "phone" | "whatsapp" | "email" | null

export function FloatingSidebar() {
  const siteSettings = useSiteSettings()
  const phone = contactPhone(siteSettings)
  const whatsapp = contactWhatsapp(siteSettings)
  const email = contactEmail(siteSettings)
  const [hoveredIcon, setHoveredIcon] = useState<HoveredIcon>(null)
  const [isInSidebar, setIsInSidebar] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMouseEnter = (icon: HoveredIcon) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsInSidebar(true)
    setHoveredIcon(icon)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!isInSidebar) {
        setHoveredIcon(null)
      }
    }, 100)
  }

  const handleContentMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsInSidebar(true)
  }

  const handleContentMouseLeave = () => {
    setIsInSidebar(false)
    timeoutRef.current = setTimeout(() => {
      setHoveredIcon(null)
    }, 100)
  }

  return (
    <div
      className="fixed right-0 top-1/2 z-[100] -translate-y-1/2 transition-all duration-300"
    >
      <div
        className="flex items-center gap-0"
        style={{
          "--sidebar-bg": "rgba(45, 106, 79, 0.1)",
          "--text-bg": "rgba(51, 51, 51, 0.85)",
          "--icon-color": "#2D6A4F",
          "--icon-hover-color": "#1B4D3E",
          "--text-color": "#ffffff",
          "--border-radius": "12px 0 0 12px",
          "--shadow": "0 4px 20px rgba(0, 0, 0, 0.1)",
        } as CSSProperties}
      >
        {/* 左侧文字容器 */}
        <div
          className={`flex flex-col items-center justify-center px-3 py-4 transition-all duration-300 ${
            hoveredIcon ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundColor: "var(--text-bg)",
            borderRadius: "8px 0 0 8px",
            height: "100%",
            minHeight: "180px",
          }}
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleContentMouseLeave}
        >
          {hoveredIcon === "phone" && (
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                Sales
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              >
                {phone}
              </span>
            </div>
          )}

          {hoveredIcon === "whatsapp" && (
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                WhatsApp
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              >
                {whatsapp}
              </span>
            </div>
          )}

          {hoveredIcon === "email" && (
            <div className="flex flex-col items-center gap-1 text-center">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                Email
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-color)" }}
              >
                {email}
              </span>
            </div>
          )}
        </div>

        {/* 右侧图标栏 */}
        <div
          className="flex flex-col gap-1 p-2"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "var(--border-radius)",
            boxShadow: "var(--shadow)",
            borderLeft: "1px solid rgba(45, 106, 79, 0.1)",
          }}
          onMouseEnter={() => handleMouseEnter(hoveredIcon)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Phone */}
          <a
            href={telHref(phone)}
            className="flex items-center justify-center size-10 rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/50"
            title="Phone"
            onMouseEnter={() => handleMouseEnter("phone")}
            onMouseLeave={handleMouseLeave}
          >
            <Phone
              size={20}
              style={{ color: "var(--icon-color)" }}
              className="transition-colors"
            />
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappHref(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center size-10 rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/50"
            title="WhatsApp"
            onMouseEnter={() => handleMouseEnter("whatsapp")}
            onMouseLeave={handleMouseLeave}
          >
            <MessageCircle
              size={20}
              style={{ color: "var(--icon-color)" }}
              className="transition-colors"
            />
          </a>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center size-10 rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/50"
            title="Email"
            onMouseEnter={() => handleMouseEnter("email")}
            onMouseLeave={handleMouseLeave}
          >
            <Mail
              size={20}
              style={{ color: "var(--icon-color)" }}
              className="transition-colors"
            />
          </a>

          <div className="my-1 w-6 h-px mx-auto bg-[var(--icon-color)]/20" />

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center size-10 rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/50"
            title="Back to Top"
          >
            <ArrowUp
              size={20}
              style={{ color: "var(--icon-color)" }}
              className="transition-colors"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
