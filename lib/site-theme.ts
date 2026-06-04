import type { CSSProperties } from "react"
import type { SiteSettings } from "@/lib/directus"

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function colorValue(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (!trimmed) return fallback
  return HEX_COLOR_PATTERN.test(trimmed) ? trimmed : fallback
}

export function hexToRgba(hex: string, opacity: number): string {
  const normalized = colorValue(hex, "#1B4D3E").replace("#", "")
  const full = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized
  const alpha = Math.max(0, Math.min(1, opacity))
  const red = Number.parseInt(full.slice(0, 2), 16)
  const green = Number.parseInt(full.slice(2, 4), 16)
  const blue = Number.parseInt(full.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function siteFontFamily(fontFamily: string | null | undefined): string {
  const font = fontFamily?.trim() || "Inter"
  if (font === "Arial" || font === "Helvetica") {
    return `${font}, sans-serif`
  }
  return `"${font}", Arial, sans-serif`
}

export function createSiteThemeStyle(settings: SiteSettings): CSSProperties {
  const primary = colorValue(settings.primary_color, "#1B4D3E")
  const cta = colorValue(settings.cta_color, "#E9B35F")
  const background = colorValue(settings.body_background, "#FDFBF7")
  const headingText = colorValue(settings.heading_text_color, primary)
  const bodyText = colorValue(settings.body_text_color, "#2D3436")
  const fontFamily = siteFontFamily(settings.font_family)
  const headerText = colorValue(settings.header_text_color, "#FFFFFF")
  const headerHoverText = colorValue(settings.header_hover_text_color, cta)
  const footerBackground = colorValue(settings.footer_background_color, primary)
  const footerText = colorValue(settings.footer_text_color, "#FFFFFF")
  const footerLink = colorValue(settings.footer_link_color, cta)

  return {
    "--background": background,
    "--foreground": bodyText,
    "--primary": primary,
    "--accent": cta,
    "--hexia-forest": primary,
    "--hexia-forest-dark": primary,
    "--hexia-gold": cta,
    "--hexia-gold-dark": cta,
    "--site-primary-color": primary,
    "--site-cta-color": cta,
    "--site-body-background": background,
    "--site-heading-color": headingText,
    "--site-body-text-color": bodyText,
    "--site-header-text-color": headerText,
    "--site-header-hover-text-color": headerHoverText,
    "--site-footer-background-color": footerBackground,
    "--site-footer-text-color": footerText,
    "--site-footer-link-color": footerLink,
    "--font-sans": fontFamily,
    "--site-font-family": fontFamily,
    fontFamily,
  } as CSSProperties
}
