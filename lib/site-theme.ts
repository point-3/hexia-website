import type { CSSProperties } from "react"
import type { SiteSettings } from "@/lib/directus"

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function colorValue(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (!trimmed) return fallback
  return HEX_COLOR_PATTERN.test(trimmed) ? trimmed : fallback
}

export function hexToRgba(hex: string, opacity: number): string {
  const normalized = colorValue(hex, "#2D6A4F").replace("#", "")
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
  const primary = colorValue(settings.theme_primary, colorValue(settings.header_background_color, "#2D6A4F"))
  const primaryDark = colorValue(
    settings.theme_primary_dark,
    colorValue(settings.heading_text_color, colorValue(settings.primary_color, "#1B4D3E")),
  )
  const accent = colorValue(settings.theme_accent, colorValue(settings.cta_color, "#E9B35F"))
  const background = colorValue(settings.theme_bg_page, colorValue(settings.body_background, "#FDFBF7"))
  const cardBackground = colorValue(settings.theme_bg_card, "#FFFFFF")
  const bodyText = colorValue(settings.theme_text_body, colorValue(settings.body_text_color, "#636E72"))
  const border = colorValue(settings.theme_border, "#A3B18A")
  const mutedBackground = colorValue(settings.theme_bg_muted, "#F5F3EF")
  const fontFamily = siteFontFamily(settings.font_family)
  const headerText = "#FFFFFF"
  const headerHoverText = accent
  const footerBackground = primary
  const footerText = "#FFFFFF"
  const footerLink = accent

  return {
    "--background": background,
    "--foreground": bodyText,
    "--card": cardBackground,
    "--card-foreground": bodyText,
    "--primary": primary,
    "--primary-dark": primaryDark,
    "--primary-foreground": "#FFFFFF",
    "--accent": accent,
    "--accent-foreground": primaryDark,
    "--border": border,
    "--input": border,
    "--ring": primary,
    "--bg-page": background,
    "--bg-card": cardBackground,
    "--text-body": bodyText,
    "--bg-muted": mutedBackground,
    "--hexia-forest": primary,
    "--hexia-forest-dark": primaryDark,
    "--hexia-gold": accent,
    "--hexia-gold-dark": accent,
    "--hexia-sage": border,
    "--site-primary-color": primary,
    "--site-primary-dark-color": primaryDark,
    "--site-cta-color": accent,
    "--site-body-background": background,
    "--site-heading-color": primaryDark,
    "--site-body-text-color": bodyText,
    "--site-card-background": cardBackground,
    "--site-border-color": border,
    "--site-muted-background": mutedBackground,
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
