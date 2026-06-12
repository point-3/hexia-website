"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Mail, Clock, Building2, Headphones, MapPin, MessageCircle, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { CustomContentSection } from "@/components/hexia/custom-content-section"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import type { PageLayout, PageSection } from "@/lib/directus"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"
import { t } from "@/lib/i18n"
import { fallbackSection, findSection, hasSection, isCustomSection, sectionsForPage } from "@/lib/page-layout"
import { asJsonArray, fieldText, getSectionConfig, localizedText, themeColor } from "@/lib/page-section-content"
import { trackInquiryConversion } from "@/lib/marketing-analytics"
import {
  companyAddress,
  companyName,
  contactEmail,
  contactWhatsapp,
  whatsappHref,
} from "@/lib/site-profile"

type ContactInfoCard = {
  icon: LucideIcon
  iconName: string
  title: string
  subtitle: string
  body: string
  href: string
  backgroundColor: string
  textColor: string
}

const defaultContactIconNames = ["building", "mail", "message-circle", "headphones"]

const contactIconMap: Record<string, LucideIcon> = {
  building: Building2,
  building2: Building2,
  office: Building2,
  address: Building2,
  location: MapPin,
  "map-pin": MapPin,
  mappin: MapPin,
  mail: Mail,
  email: Mail,
  message: MessageCircle,
  chat: MessageCircle,
  "message-circle": MessageCircle,
  messagecircle: MessageCircle,
  whatsapp: MessageCircle,
  wechat: MessageCircle,
  headphones: Headphones,
  support: Headphones,
  service: Headphones,
  clock: Clock,
}

function inferContactIconName(item: Record<string, unknown>, index: number, lang: "en" | "zh"): string {
  const explicitIcon = fieldText(item, "icon", lang) || localizedText(item.icon, lang)
  if (explicitIcon) return explicitIcon

  const searchable = [
    fieldText(item, "title", lang),
    fieldText(item, "subtitle", lang),
    fieldText(item, "body", lang),
    localizedText(item.href, lang),
  ].join(" ").toLowerCase()

  if (/mail|email|邮箱|電子郵箱/.test(searchable)) return "mail"
  if (/whatsapp|wechat|微信|phone|tel|电话|電話/.test(searchable)) return "message-circle"
  if (/support|客服|客户支持|客戶支持|服务承诺|服務承諾|24/.test(searchable)) return "headphones"
  if (/address|location|office|factory|地址|定位|公司地址/.test(searchable)) return "building"
  return defaultContactIconNames[index] || "building"
}

function contactIconByName(value: unknown): LucideIcon {
  if (typeof value !== "string" || !value.trim()) return Building2
  return contactIconMap[value.trim().toLowerCase()] ?? Building2
}

function contactIconColors(iconName: string, isDarkCard: boolean) {
  const normalizedIconName = iconName.trim().toLowerCase()
  if (isDarkCard) return { backgroundColor: "rgb(255 255 255 / 0.2)", color: "var(--bg-card)" }
  if (normalizedIconName === "mail" || normalizedIconName === "email") {
    return { backgroundColor: "var(--accent)", color: "var(--primary-dark)" }
  }
  if (normalizedIconName === "message-circle" || normalizedIconName === "messagecircle" || normalizedIconName === "whatsapp" || normalizedIconName === "wechat") {
    return { backgroundColor: "#25D366", color: "var(--bg-card)" }
  }
  return { backgroundColor: "var(--primary)", color: "var(--bg-card)" }
}

function isAddressContactIcon(iconName: string): boolean {
  const normalizedIconName = iconName.trim().toLowerCase()
  return normalizedIconName === "building" || normalizedIconName === "building2" || normalizedIconName === "office" || normalizedIconName === "address"
}

function configuredContactCards(section: PageSection | null | undefined, lang: "en" | "zh"): ContactInfoCard[] {
  const contactInfo = section
  const config = getSectionConfig(contactInfo, lang)
  const sectionItems = asJsonArray(lang === "zh" ? contactInfo?.contact_cards_zh : contactInfo?.contact_cards_en)
  const items = sectionItems.length > 0 ? sectionItems : asJsonArray(config.cards || config.items || config.blocks)
  return items.flatMap((item, index) => {
    const title = fieldText(item, "title", lang)
    const body = fieldText(item, "body", lang) || fieldText(item, "content", lang) || fieldText(item, "value", lang)
    if (!title && !body) return []
    const iconName = inferContactIconName(item, index, lang)
    return [{
      icon: contactIconByName(iconName),
      iconName,
      title,
      subtitle: fieldText(item, "subtitle", lang),
      body,
      href: localizedText(item.href, lang),
      backgroundColor: themeColor(localizedText(item.background_color, lang), "var(--bg-card)"),
      textColor: themeColor(localizedText(item.text_color, lang), "var(--text-body)"),
    }]
  })
}

function ContactContent({ pageLayout }: { pageLayout: PageLayout }) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const siteSettings = useSiteSettings()
  const email = contactEmail(siteSettings)
  const whatsapp = contactWhatsapp(siteSettings)
  const sections = sectionsForPage(pageLayout, [
    fallbackSection("contact_info", "contact_cards", 1),
    fallbackSection("contact_form", "system", 2),
  ])
  const showContactInfo = hasSection(sections, "contact_info")
  const showContactForm = hasSection(sections, "contact_form")
  const contactInfoSection = findSection(sections, "contact_info")
  const contactFormSection = findSection(sections, "contact_form")
  const hasContactPanel = showContactInfo || showContactForm
  const contactPanelSort = hasContactPanel
    ? Math.min(contactInfoSection?.sort ?? Number.POSITIVE_INFINITY, contactFormSection?.sort ?? Number.POSITIVE_INFINITY)
    : Number.POSITIVE_INFINITY
  const contactPanelBackgroundColor = themeColor(contactFormSection?.background_color || contactInfoSection?.background_color)
  const customSections = sections.filter(isCustomSection)
  const customSectionsBeforePanel = hasContactPanel
    ? customSections.filter((section) => (section.sort ?? 0) < contactPanelSort)
    : customSections
  const customSectionsAfterPanel = hasContactPanel
    ? customSections.filter((section) => (section.sort ?? 0) >= contactPanelSort)
    : []
  const configuredCards = configuredContactCards(contactInfoSection, lang)

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
        source_page: `Contact Page [${lang}]`,
      })
      toast.success(t("inquiry.successToast", lang))
      trackInquiryConversion(siteSettings, { source: "contact_form", language: lang })
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

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Success Message Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="max-w-sm w-full rounded-xl bg-[var(--primary)]/20 px-6 py-5 text-center backdrop-blur-sm">
            <p className="text-base font-medium text-[var(--primary)]">
              {t("inquiry.successToast", lang)}
            </p>
          </div>
        </div>
      )}

      <Navbar />

      <main className="pt-20 lg:pt-24">
        {customSectionsBeforePanel.map((section) => (
          <CustomContentSection key={section.id} section={section} />
        ))}
        {hasContactPanel ? (
        <section className="py-8 lg:py-12" style={{ backgroundColor: contactPanelBackgroundColor || undefined }}>
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <div className={`grid gap-6 ${showContactForm && showContactInfo ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
              {/* Contact Form */}
              {showContactForm ? (
              <div className="rounded-2xl bg-[var(--bg-card)] p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-[var(--primary-dark)]">{t("inquiry.title", lang)}</h2>
                <p className="mt-2 text-sm text-[var(--text-body)]">
                  {t("inquiry.subtitle", lang)}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                      rows={4}
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

                {/* Response time notice */}
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)]/5 p-4">
                  <Clock className="size-5 text-[var(--primary)]" />
                  <span className="text-sm text-[var(--primary)] font-medium">{t("inquiry.replyNotice", lang)}</span>
                </div>
              </div>
              ) : null}

              {/* Contact Info */}
              {showContactInfo ? (
              <div className="space-y-4">
                {configuredCards.length > 0 ? (
                  configuredCards.map((card) => {
                    const Icon = card.icon
                    const isDarkCard = card.textColor === "var(--bg-card)" || card.textColor.toLowerCase() === "#ffffff"
                    const iconColors = contactIconColors(card.iconName, isDarkCard)
                    const content = (
                      <div
                        className="rounded-xl border border-[var(--border)] p-4 sm:p-6"
                        style={{ backgroundColor: card.backgroundColor, color: card.textColor }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-11 shrink-0 items-center justify-center rounded-full"
                            style={iconColors}
                          >
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <h3
                              className="font-semibold"
                              style={{ color: isDarkCard ? card.textColor : "var(--primary-dark)" }}
                            >
                              {card.title}
                            </h3>
                            {card.subtitle ? <p className="mt-1 text-sm opacity-75">{card.subtitle}</p> : null}
                          </div>
                        </div>
                        {card.body ? (
                          isAddressContactIcon(card.iconName) ? (
                            <div className="mt-4 flex items-start gap-3">
                              <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--border)]" />
                              <p className="whitespace-pre-line text-sm leading-relaxed">{card.body}</p>
                            </div>
                          ) : (
                            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{card.body}</p>
                          )
                        ) : null}
                      </div>
                    )
                    return card.href ? (
                      <a key={`${card.iconName}-${card.title}-${card.body}`} href={card.href} className="block">
                        {content}
                      </a>
                    ) : (
                      <div key={`${card.iconName}-${card.title}-${card.body}`}>{content}</div>
                    )
                  })
                ) : (
                <>
                {/* Company Address */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[var(--primary)]">
                      <Building2 className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--primary-dark)]">
                        {companyName(siteSettings, lang)}
                      </h3>
                      <p className="text-sm text-[var(--text-body)]">{lang === "zh" ? "公司地址" : "Company Address"}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--border)]" />
                    <p className="text-[var(--text-body)]">
                      {companyAddress(siteSettings, lang).split("\n").map((line, index, lines) => (
                        <span key={line}>
                          {line}
                          {index < lines.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[var(--accent)]">
                      <Mail className="size-5 text-[var(--primary-dark)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--primary-dark)]">{lang === "zh" ? "电子邮箱" : "Email"}</h3>
                      <div className="mt-1 space-y-1">
                        <a
                          href={`mailto:${email}`}
                          className="block text-xs text-[var(--primary)] hover:text-[var(--accent)] transition-colors sm:text-sm"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WeChat/WhatsApp */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#25D366]">
                      <MessageCircle className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--primary-dark)]">{lang === "zh" ? "微信 / WhatsApp" : "WeChat/WhatsApp"}</h3>
                      <a
                        href={whatsappHref(whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
                      >
                        {whatsapp}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white/20">
                      <Headphones className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("home.onlineSupport", lang)}</h3>
                      <p className="text-sm text-white/80">{lang === "zh" ? "随时为您提供帮助" : "We are always here to help"}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/70">
                    {lang === "zh"
                      ? "我们的团队全天候为您服务，协助您进行任何查询、技术问题或紧急订单处理。"
                      : "Our team is available around the clock to assist you with any inquiries, technical questions, or urgent orders."}
                  </p>
                </div>
                </>
                )}
              </div>
              ) : null}
            </div>
          </div>
        </section>
        ) : null}
        {customSectionsAfterPanel.map((section) => (
          <CustomContentSection key={section.id} section={section} />
        ))}
      </main>

      <Footer />
    </div>
  )
}

export default function ContactPage({ pageLayout }: { pageLayout: PageLayout }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-[var(--text-body)]">Loading...</div>
      </div>
    }>
      <ContactContent pageLayout={pageLayout} />
    </Suspense>
  )
}
