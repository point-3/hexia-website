import type { JsonValue, SiteSettings } from "@/lib/directus"

export type MarketingAnalyticsConfig = {
  ga4MeasurementId: string
  gtmId: string
  inquiryConversionEnabled: boolean
  inquiryConversionEventName: string
}

type ConversionContext = {
  source?: string
  productSlug?: string
  language?: string
}

type TrackingWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

function asObject(value: JsonValue | undefined): Record<string, unknown> {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.flatMap((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return []
        if ("enabled" in item && item.enabled === false) return []

        const key = typeof item.key === "string" ? item.key.trim() : ""
        if (!key) return []

        if (typeof item.value === "boolean") return [[key, item.value]]
        const rawValue = typeof item.value === "string" ? item.value.trim() : ""
        if (rawValue === "") return []
        if (["true", "1", "yes", "on"].includes(rawValue.toLowerCase())) return [[key, true]]
        if (["false", "0", "no", "off"].includes(rawValue.toLowerCase())) return [[key, false]]
        return [[key, rawValue]]
      }),
    )
  }

  return value && typeof value === "object" && !Array.isArray(value) ? value : {}
}

function stringValue(settings: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = settings[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return ""
}

function booleanValue(settings: Record<string, unknown>, keys: string[], fallback = false): boolean {
  for (const key of keys) {
    const value = settings[key]
    if (typeof value === "boolean") return value
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase()
      if (["true", "1", "yes", "on"].includes(normalized)) return true
      if (["false", "0", "no", "off"].includes(normalized)) return false
    }
  }
  return fallback
}

function safeId(value: string): string {
  return /^[A-Za-z0-9_-]+$/.test(value) ? value : ""
}

function safeEventName(value: string): string {
  return /^[A-Za-z0-9_:-]+$/.test(value) ? value : "generate_lead"
}

export function getMarketingAnalyticsConfig(siteSettings: SiteSettings): MarketingAnalyticsConfig {
  const settings = asObject(siteSettings.analytics_settings)
  return {
    ga4MeasurementId: safeId(stringValue(settings, [
      "ga4_measurement_id",
      "ga4MeasurementId",
      "google_analytics_id",
      "googleAnalyticsId",
      "measurement_id",
    ])),
    gtmId: safeId(stringValue(settings, [
      "gtm_id",
      "gtmId",
      "google_tag_manager_id",
      "googleTagManagerId",
    ])),
    inquiryConversionEnabled: booleanValue(settings, [
      "enable_inquiry_conversion",
      "inquiry_conversion_enabled",
      "track_inquiry_conversion",
      "conversion_enabled",
    ]),
    inquiryConversionEventName: safeEventName(stringValue(settings, [
      "inquiry_conversion_event_name",
      "conversion_event_name",
      "conversionEventName",
    ]) || "generate_lead"),
  }
}

export function shouldLoadMarketingAnalytics(siteSettings: SiteSettings): boolean {
  if (process.env.NODE_ENV !== "production") return false
  const config = getMarketingAnalyticsConfig(siteSettings)
  return Boolean(config.ga4MeasurementId || config.gtmId)
}

export function trackInquiryConversion(siteSettings: SiteSettings, context: ConversionContext = {}): void {
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined") return

  const config = getMarketingAnalyticsConfig(siteSettings)
  if (!config.inquiryConversionEnabled) return

  const payload = {
    event_category: "inquiry",
    event_label: context.source || "inquiry",
    form_source: context.source || "inquiry",
    product_slug: context.productSlug,
    language: context.language,
  }
  const trackingWindow = window as TrackingWindow
  trackingWindow.dataLayer = trackingWindow.dataLayer || []
  trackingWindow.dataLayer.push({
    event: config.inquiryConversionEventName,
    ...payload,
  })

  if (typeof trackingWindow.gtag === "function") {
    trackingWindow.gtag("event", config.inquiryConversionEventName, payload)
  }
}
