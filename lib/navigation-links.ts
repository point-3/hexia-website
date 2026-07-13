import { getHrefWithLang } from "@/lib/i18n"

type JsonObject = Record<string, unknown>

export type NavigationLink = {
  label: string
  href: string
}

const defaultNavigationDefinitions = [
  { key: "home", href: "/", label_en: "Home", label_zh: "首页" },
  { key: "products", href: "/products", label_en: "Products", label_zh: "产品中心" },
  { key: "service", href: "/service", label_en: "Service", label_zh: "服务" },
  { key: "about", href: "/about", label_en: "About Us", label_zh: "关于我们" },
  { key: "news", href: "/news", label_en: "News", label_zh: "资讯" },
  { key: "contact", href: "/contact", label_en: "Contact Us", label_zh: "联系我们" },
] as const

function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function localizedText(value: unknown, lang: string): string {
  if (typeof value === "string") return value.trim()
  if (!isJsonObject(value)) return ""

  const candidates = lang === "zh"
    ? [value.zh, value["zh-CN"], value.cn, value.label_zh, value.en, value["en-US"], value.label_en]
    : [value.en, value["en-US"], value.label_en, value.zh, value["zh-CN"], value.cn, value.label_zh]

  for (const candidate of candidates) {
    const text = stringValue(candidate)
    if (text) return text
  }
  return ""
}

function applyLocaleToHref(href: string, lang: string): string {
  const trimmed = href.trim()
  if (!trimmed || trimmed === "#" || trimmed.startsWith("#")) return trimmed || "#"
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(trimmed)) return trimmed

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  const hashIndex = normalized.indexOf("#")
  if (hashIndex === -1) return getHrefWithLang(normalized, lang)

  const path = normalized.slice(0, hashIndex) || "/"
  const hash = normalized.slice(hashIndex)
  return `${getHrefWithLang(path, lang)}${hash}`
}

export function defaultNavigationLinks(lang: string): NavigationLink[] {
  return defaultNavigationDefinitions.map((item) => ({
    label: lang === "zh" ? item.label_zh : item.label_en,
    href: applyLocaleToHref(item.href, lang),
  }))
}

export function navigationLinksFromConfig(value: unknown, lang: string): NavigationLink[] {
  if (!Array.isArray(value)) return defaultNavigationLinks(lang)

  const links = value
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => isJsonObject(item) && item.enabled !== false && item.hidden !== true)
    .sort((a, b) => {
      const sortA = Number((a.item as JsonObject).sort)
      const sortB = Number((b.item as JsonObject).sort)
      if (Number.isFinite(sortA) && Number.isFinite(sortB) && sortA !== sortB) return sortA - sortB
      if (Number.isFinite(sortA) && !Number.isFinite(sortB)) return -1
      if (!Number.isFinite(sortA) && Number.isFinite(sortB)) return 1
      return a.index - b.index
    })
    .flatMap(({ item }) => {
      if (!isJsonObject(item)) return []

      const key = stringValue(item.key).toLowerCase()
      const href = stringValue(item.href) || stringValue(item.url)
      const definition = defaultNavigationDefinitions.find((entry) => entry.key === key || entry.href === href)
      const label =
        localizedText(item.label, lang) ||
        (lang === "zh"
          ? stringValue(item.label_zh) || stringValue(item.name_cn)
          : stringValue(item.label_en) || stringValue(item.name)) ||
        (definition ? (lang === "zh" ? definition.label_zh : definition.label_en) : "")
      const linkHref = href || definition?.href || ""

      if (!label || !linkHref) return []
      return [{ label, href: applyLocaleToHref(linkHref, lang) }]
    })

  return links
}
