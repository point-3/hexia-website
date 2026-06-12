"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BarChart3, ChevronRight, GraduationCap, Headphones, Package, Shield, Truck, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { CustomContentSection } from "@/components/hexia/custom-content-section"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import type { PageLayout, PageSection } from "@/lib/directus"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"
import { t, getHrefWithLang } from "@/lib/i18n"
import { fallbackSection, isCustomSection, sectionsForPage } from "@/lib/page-layout"
import { trackInquiryConversion } from "@/lib/marketing-analytics"
import {
  asJsonArray,
  fieldText,
  getSectionConfig,
  getSectionTranslation,
  localizedText,
  themeColor,
} from "@/lib/page-section-content"
import { sectionTitleWithSuffix } from "@/lib/section-title"

type Locale = "en" | "zh"

type ServiceCard = {
  icon: LucideIcon
  title: string
  description: string
  details: string[]
  ctaLabel?: string
  ctaHref?: string
}

type ServiceStat = {
  value: string
  label: string
}

const serviceIconMap: Record<string, LucideIcon> = {
  package: Package,
  supply: Package,
  logistics: Package,
  truck: Truck,
  shield: Shield,
  quality: Shield,
  market: BarChart3,
  chart: BarChart3,
  trendingup: BarChart3,
  intelligence: BarChart3,
  service: Headphones,
  academy: GraduationCap,
  education: GraduationCap,
  training: GraduationCap,
}

function iconByName(value: unknown): LucideIcon {
  if (typeof value !== "string") return Package
  return serviceIconMap[value.trim().toLowerCase()] ?? Package
}

function textValue(value: unknown, lang: Locale): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return localizedText(value, lang)
}

function hrefWithLocale(href: string, lang: Locale): string {
  const trimmed = href.trim()
  if (!trimmed || trimmed === "#" || trimmed.startsWith("#")) return trimmed || "#"
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(trimmed)) return trimmed
  return getHrefWithLang(trimmed.startsWith("/") ? trimmed : `/${trimmed}`, lang)
}

function localizedStringList(value: unknown, lang: Locale): string[] {
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [item.trim()]
    if (!item || typeof item !== "object" || Array.isArray(item)) return []
    const row = item as Record<string, unknown>
    const text =
      fieldText(row, "label", lang) ||
      fieldText(row, "title", lang) ||
      fieldText(row, "text", lang) ||
      textValue(row.value, lang)
    return text ? [text] : []
  })
}

function fallbackServices(lang: Locale): ServiceCard[] {
  return lang === "zh" ? [
    {
      icon: Package,
      title: "供应链管理",
      description: "一站式解决您的采购和物流需求",
      details: ["精细的供应链管理", "高效的拼箱配舱装载", "灵活的国际物流服务", "门到门送货服务", "实时货物追踪"],
    },
    {
      icon: BarChart3,
      title: "实时市场动态",
      description: "为您提供最新的行业市场行情趋势",
      details: ["氨基酸月度价格走势报告", "维生素市场动态分析", "LinkedIn 定期动态分享", "行业新闻与深度见解", "可根据需求定制市场报告"],
    },
    {
      icon: GraduationCap,
      title: "和夏商学院",
      description: "专业的人才发展与知识共享平台",
      details: ["行业技能培训计划", "技术研讨与分享会", "优秀实践案例交流", "合规与监管政策指南", "新产品开发技术支持"],
    },
  ] : [
    {
      icon: Package,
      title: "Supply Chain Management",
      description: "One-stop solution for all your sourcing needs",
      details: ["Refined supply-chain management", "Mixed container loading for cost efficiency", "Flexible logistics options", "Door-to-door delivery service", "Real-time shipment tracking"],
    },
    {
      icon: BarChart3,
      title: "Market Intelligence",
      description: "Stay informed with the latest industry trends",
      details: ["Monthly Amino Acid price trend reports", "Vitamin market analysis", "Regular LinkedIn updates", "Industry news and insights", "Customized market reports on request"],
    },
    {
      icon: GraduationCap,
      title: "Hexia Business Academy",
      description: "Professional development and knowledge sharing",
      details: ["Industry training programs", "Technical workshops", "Best practices sharing", "Regulatory compliance guidance", "New product development support"],
    },
  ]
}

function configuredServices(section: PageSection, lang: Locale): ServiceCard[] {
  const config = getSectionConfig(section, lang)
  const sectionItems = asJsonArray(lang === "zh" ? section.service_overview_cards_zh : section.service_overview_cards_en)
  const items = sectionItems.length > 0 ? sectionItems : asJsonArray(config.services || config.items || config.cards)
  return items.flatMap((item) => {
    const title = fieldText(item, "title", lang)
    const description = fieldText(item, "description", lang) || fieldText(item, "desc", lang)
    const details = localizedStringList(item.details || item.list || item.bullets, lang)
    if (!title && !description && details.length === 0) return []
    return [{
      icon: iconByName(item.icon),
      title,
      description,
      details,
      ctaLabel: fieldText(item, "cta_label", lang) || fieldText(item, "button_label", lang),
      ctaHref: localizedText(item.cta_href || item.button_href || item.href, lang),
    }]
  })
}

function configuredStats(section: PageSection, lang: Locale): ServiceStat[] {
  const config = getSectionConfig(section, lang)
  const sectionStats = asJsonArray(lang === "zh" ? section.stat_cards_zh : section.stat_cards_en)
  const items = sectionStats.length > 0 ? sectionStats : asJsonArray(config.stats || config.items || config.cards)
  return items.flatMap((item) => {
    const value = textValue(item.value ?? item.number, lang)
    const label = fieldText(item, "label", lang) || fieldText(item, "title", lang)
    return value && label ? [{ value, label }] : []
  })
}

function ServiceOverviewSection({ section, lang }: { section: PageSection; lang: Locale }) {
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const services = configuredServices(section, lang)
  const displayServices = services.length > 0 ? services : fallbackServices(lang)
  const title = translation?.title || localizedText(config.title, lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang)
  const backgroundColor = themeColor(section.background_color || localizedText(config.background_color, lang))

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title || subtitle ? (
          <div className="mb-12 text-center">
            {title ? <h2 className="text-2xl font-bold text-[var(--primary-dark)] sm:text-3xl">{sectionTitleWithSuffix(section, title, lang)}</h2> : null}
            {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-[var(--text-body)]">{subtitle}</p> : null}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-3">
          {displayServices.map((service) => {
            const ctaLabel = service.ctaLabel || (lang === "zh" ? "联系我们" : "Contact Us")
            const ctaHref = service.ctaHref || "/contact"
            return (
              <div
                key={service.title}
                className="group rounded-2xl border-l-4 border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg lg:p-8"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-[var(--primary)]">
                  <service.icon className="size-7 text-white" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[var(--primary-dark)]">{service.title}</h3>
                {service.description ? <p className="mt-2 text-[var(--text-body)]">{service.description}</p> : null}

                {service.details.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm text-[var(--text-body)]">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--accent)]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <Link
                  href={hrefWithLocale(ctaHref, lang)}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
                >
                  {ctaLabel}
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ServiceWhyChooseSection({ section, lang }: { section: PageSection; lang: Locale }) {
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const stats = configuredStats(section, lang)
  const displayStats = stats.length > 0 ? stats : [
    { value: "20+", label: lang === "zh" ? "年行业深耕经验" : "Years of Industry Experience" },
    { value: "99%", label: lang === "zh" ? "客户满意率" : "Customer Satisfaction Rate" },
    { value: "48h", label: lang === "zh" ? "平均响应时间" : "Average Response Time" },
    { value: "24/7", label: t("home.statsSupport", lang) },
  ]
  const title = translation?.title || localizedText(config.title, lang) || (lang === "zh" ? "为什么选择我们的服务" : "Why Choose Our Services")
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang) || t("service.whyChooseDesc", lang)
  const backgroundColor = themeColor(section.background_color || localizedText(config.background_color, lang), "var(--bg-muted)")

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--primary-dark)] sm:text-3xl">{sectionTitleWithSuffix(section, title, lang)}</h2>
          {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-[var(--text-body)]">{subtitle}</p> : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-[var(--bg-card)] p-6 text-center shadow-sm transition-all hover:shadow-lg"
            >
              <div className="text-3xl font-bold text-[var(--primary)]">{stat.value}</div>
              <div className="mt-2 text-sm text-[var(--text-body)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceContent({ pageLayout }: { pageLayout: PageLayout }) {
  const searchParams = useSearchParams()
  const lang: Locale = searchParams.get("lang") === "zh" ? "zh" : "en"
  const siteSettings = useSiteSettings()
  const sections = sectionsForPage(pageLayout, [
    fallbackSection("service_overview", "services", 1),
    fallbackSection("service_why_choose", "why_choose", 2),
    fallbackSection("contact_form", "system", 3),
  ])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    productInterest: "",
    quantity: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        country: formData.country || undefined,
        product_interest: formData.productInterest || undefined,
        quantity: formData.quantity || undefined,
        message: formData.message,
        source_page: `Service Page Quote Section [${lang}]`,
      })
      toast.success(t("inquiry.successToast", lang))
      trackInquiryConversion(siteSettings, { source: "service_quote_form", language: lang })
      setShowSuccess(true)
      setFormData({
        name: "",
        email: "",
        country: "",
        productInterest: "",
        quantity: "",
        message: "",
      })
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err: any) {
      console.error(err)
      toast.error(t("inquiry.errorToast", lang))
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderContactForm(section: PageSection) {
    const translation = getSectionTranslation(section, lang)
    const config = getSectionConfig(section, lang)
    const title = translation?.title || localizedText(config.title, lang) || t("inquiry.formTitle", lang)
    const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang) || t("inquiry.formSubtitle", lang)
    const backgroundColor = themeColor(section.background_color || localizedText(config.background_color, lang))

    return (
      <section key={section.id} className="py-16 lg:py-24" style={{ backgroundColor: backgroundColor || undefined }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[var(--bg-card)] p-8 shadow-lg sm:p-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--primary-dark)] sm:text-3xl">{sectionTitleWithSuffix(section, title, lang)}</h2>
              {subtitle ? <p className="mt-4 text-[var(--text-body)]">{subtitle}</p> : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-body)]">
                  {t("inquiry.name", lang)} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderName", lang)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-body)]">
                  {t("inquiry.email", lang)} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderEmail", lang)}
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-[var(--text-body)]">
                  {t("inquiry.country", lang)}
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderCountry", lang)}
                />
              </div>

              <div>
                <label htmlFor="productInterest" className="block text-sm font-medium text-[var(--text-body)]">
                  {t("inquiry.product", lang)}
                </label>
                <input
                  type="text"
                  id="productInterest"
                  value={formData.productInterest}
                  onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderProduct", lang)}
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-[var(--text-body)]">
                  {t("inquiry.quantity", lang)}
                </label>
                <input
                  type="text"
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderQuantity", lang)}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-body)]">
                  {t("inquiry.message", lang)} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderMessage", lang)}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-[var(--accent)] py-6 text-base font-semibold text-[var(--primary-dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white disabled:opacity-50"
              >
                {isSubmitting ? t("inquiry.submitting", lang) : t("inquiry.submit", lang)}
              </Button>
            </form>

            {showSuccess ? (
              <div className="mt-4 rounded-xl bg-[var(--primary)]/20 p-4 text-center">
                <p className="text-sm font-medium text-[var(--primary)]">
                  {t("inquiry.successToast", lang)}
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--text-body)]">
              <Headphones className="size-5 text-[var(--primary)]" />
              <span>{t("home.onlineSupport", lang)}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {sections.map((section) => {
          if (isCustomSection(section)) return <CustomContentSection key={section.id} section={section} />
          if (section.section_key === "service_overview") return <ServiceOverviewSection key={section.id} section={section} lang={lang} />
          if (section.section_key === "service_why_choose") return <ServiceWhyChooseSection key={section.id} section={section} lang={lang} />
          if (section.section_key === "contact_form") return renderContactForm(section)
          return null
        })}
      </main>

      <Footer />
    </div>
  )
}

export default function ServicePage({ pageLayout }: { pageLayout: PageLayout }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-[var(--text-body)]">Loading...</div>
      </div>
    }>
      <ServiceContent pageLayout={pageLayout} />
    </Suspense>
  )
}
