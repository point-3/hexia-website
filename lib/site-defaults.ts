import type { SiteSettings, SiteSettingsTranslation } from "@/lib/directus"

export const DEFAULT_COMPANY_NAME = "Your Company"
export const DEFAULT_SITE_NAME = "Company"
export const DEFAULT_BROWSER_TITLE_PREFIX = "Company"
export const DEFAULT_COMPANY_DESCRIPTION =
  "Replace this text with the company introduction and business scope."
export const DEFAULT_COMPANY_ADDRESS = ""
export const DEFAULT_CONTACT_EMAIL = ""
export const DEFAULT_CONTACT_PHONE = ""

export const DEFAULT_SITE_TRANSLATIONS: SiteSettingsTranslation[] = [
  {
    id: 0,
    site_settings_id: 0,
    languages_code: "en-US",
    site_name: DEFAULT_SITE_NAME,
    browser_title_prefix: DEFAULT_BROWSER_TITLE_PREFIX,
    brand_highlight_name: DEFAULT_SITE_NAME,
    why_choose_title_suffix: "",
    company_name: DEFAULT_COMPANY_NAME,
    company_short_description: DEFAULT_COMPANY_DESCRIPTION,
    company_address: DEFAULT_COMPANY_ADDRESS,
    quote_button_text: "Get a Quote",
    footer_copyright: `Copyright © 2026 ${DEFAULT_COMPANY_NAME}. All Rights Reserved.`,
    default_meta_title: DEFAULT_SITE_NAME,
    default_meta_keywords: "",
    default_meta_description: DEFAULT_COMPANY_DESCRIPTION,
  },
  {
    id: 0,
    site_settings_id: 0,
    languages_code: "zh-CN",
    site_name: DEFAULT_SITE_NAME,
    browser_title_prefix: DEFAULT_BROWSER_TITLE_PREFIX,
    brand_highlight_name: DEFAULT_SITE_NAME,
    why_choose_title_suffix: "",
    company_name: DEFAULT_COMPANY_NAME,
    company_short_description: DEFAULT_COMPANY_DESCRIPTION,
    company_address: DEFAULT_COMPANY_ADDRESS,
    quote_button_text: "获取报价",
    footer_copyright: `Copyright © 2026 ${DEFAULT_COMPANY_NAME}. All Rights Reserved.`,
    default_meta_title: DEFAULT_SITE_NAME,
    default_meta_keywords: "",
    default_meta_description: DEFAULT_COMPANY_DESCRIPTION,
  },
]

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 0,
  status: "published",
  site_title: DEFAULT_SITE_NAME,
  theme_primary: "#2D6A4F",
  theme_primary_dark: "#1B4D3E",
  theme_accent: "#E9B35F",
  theme_bg_page: "#FDFBF7",
  theme_bg_card: "#FFFFFF",
  theme_text_body: "#636E72",
  theme_border: "#A3B18A",
  theme_bg_muted: "#F5F3EF",
  primary_color: "#1B4D3E",
  cta_color: "#E9B35F",
  body_background: "#FDFBF7",
  heading_text_color: "#1B4D3E",
  body_text_color: "#636E72",
  font_family: "Inter",
  header_background_color: "#2D6A4F",
  header_background_opacity: 100,
  header_text_color: "#1B4D3E",
  header_hover_text_color: "#E9B35F",
  quote_button_enabled: true,
  language_switch_enabled: true,
  footer_background_color: "#1B4D3E",
  footer_text_color: "#FFFFFF",
  footer_link_color: "#E9B35F",
  email: DEFAULT_CONTACT_EMAIL,
  phone: DEFAULT_CONTACT_PHONE,
  whatsapp: DEFAULT_CONTACT_PHONE,
  social_links: {},
  quick_links: [
    { label: "Home", href: "/", enabled: true },
    { label: "Products", href: "/products", enabled: true },
    { label: "Service", href: "/service", enabled: true },
    { label: "About Us", href: "/about", enabled: true },
    { label: "Contact Us", href: "/contact", enabled: true },
  ],
  analytics_settings: {},
  translations: DEFAULT_SITE_TRANSLATIONS,
}
