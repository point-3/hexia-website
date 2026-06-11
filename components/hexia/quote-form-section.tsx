"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { t } from "@/lib/i18n"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { trackInquiryConversion } from "@/lib/marketing-analytics"

export function QuoteFormSection() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"
  const siteSettings = useSiteSettings()
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
        source_page: "Home Page Quote Section",
      })
      toast.success(t("inquiry.successToast", lang))
      trackInquiryConversion(siteSettings, { source: "home_quote_form", language: lang })
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
      toast.error(`${t("inquiry.errorToast", lang)}: ${err.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="quote" className="bg-[var(--bg-page)] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[var(--bg-card)] p-8 shadow-lg sm:p-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--primary-dark)] sm:text-4xl">
              {lang === "zh" ? (
                <>
                  获取专属 <span className="text-[var(--accent)]">报价询盘</span>
                </>
              ) : (
                <>
                  Request a <span className="text-[var(--accent)]">Quote</span>
                </>
              )}
            </h2>
            <p className="mt-4 text-[var(--text-body)]">
              {t("home.quoteDesc", lang)}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--text-body)]"
              >
                {t("home.formName", lang)} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                placeholder={t("home.placeholderName", lang)}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text-body)]"
              >
                {t("home.formEmail", lang)} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                placeholder={t("home.placeholderEmail", lang)}
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-[var(--text-body)]"
              >
                {t("home.formCountry", lang)}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                placeholder={t("home.placeholderCountry", lang)}
              />
            </div>

            {/* Interested Product */}
            <div>
              <label
                htmlFor="productInterest"
                className="block text-sm font-medium text-[var(--text-body)]"
              >
                {t("home.formProduct", lang)}
              </label>
              <input
                type="text"
                id="productInterest"
                name="productInterest"
                value={formData.productInterest}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                placeholder={t("home.placeholderProduct", lang)}
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-[var(--text-body)]"
              >
                {t("home.formQuantity", lang)}
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                placeholder={t("home.placeholderQuantity", lang)}
              />
            </div>

            {/* Message / Requirement */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[var(--text-body)]"
              >
                {t("home.formMessage", lang)} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                disabled={isSubmitting}
                className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/60 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                placeholder={t("home.placeholderMessage", lang)}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-[var(--accent)] py-6 text-base font-semibold text-[var(--primary-dark)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white disabled:opacity-50"
            >
              {isSubmitting ? t("inquiry.submitting", lang) : t("home.formSubmit", lang)}
            </Button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 rounded-xl bg-[var(--primary)]/20 p-4 text-center">
              <p className="text-sm font-medium text-[var(--primary)]">
                {t("home.formSuccess", lang)}
              </p>
            </div>
          )}

          {/* Support Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--text-body)]">
            <Headphones className="size-5 text-[var(--primary)]" />
            <span>{t("home.onlineSupport", lang)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
