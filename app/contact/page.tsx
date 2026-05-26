"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Mail, Clock, Building2, Headphones, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"
import { t, getHrefWithLang } from "@/lib/i18n"

function ContactContent() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

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
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Success Message Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-xl bg-[#2D6A4F]/20 px-8 py-6 text-center backdrop-blur-sm">
            <p className="text-base font-medium text-[#2D6A4F]">
              {t("inquiry.successToast", lang)}
            </p>
          </div>
        </div>
      )}

      <Navbar />

      <main className="pt-20 lg:pt-24">
        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-[#1B4D3E]">{t("inquiry.title", lang)}</h2>
                <p className="mt-2 text-sm text-[#636E72]">
                  {t("inquiry.subtitle", lang)}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#2D3436]">
                      {t("inquiry.name", lang)} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                      placeholder={t("home.placeholderName", lang)}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#2D3436]">
                      {t("inquiry.email", lang)} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                      placeholder={t("home.placeholderEmail", lang)}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-[#2D3436]">
                      {t("inquiry.country", lang)}
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                      placeholder={t("home.placeholderCountry", lang)}
                    />
                  </div>

                  <div>
                    <label htmlFor="productInterest" className="block text-sm font-medium text-[#2D3436]">
                      {t("inquiry.product", lang)}
                    </label>
                    <input
                      type="text"
                      id="productInterest"
                      value={formData.productInterest}
                      onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                      placeholder={t("home.placeholderProduct", lang)}
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-[#2D3436]">
                      {t("inquiry.quantity", lang)}
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                      placeholder={t("home.placeholderQuantity", lang)}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#2D3436]">
                      {t("inquiry.message", lang)} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-2 w-full resize-none rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                      placeholder={t("home.placeholderMessage", lang)}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-[#E9B35F] py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:bg-[#2D6A4F] hover:text-white disabled:opacity-50"
                  >
                    {isSubmitting ? t("inquiry.submitting", lang) : t("inquiry.submit", lang)}
                  </Button>
                </form>

                {/* Response time notice */}
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#2D6A4F]/5 p-4">
                  <Clock className="size-5 text-[#2D6A4F]" />
                  <span className="text-sm text-[#2D6A4F] font-medium">{t("inquiry.replyNotice", lang)}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Suzhou HQ */}
                <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#2D6A4F]">
                      <Building2 className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">
                        {lang === "zh" ? "苏州总部" : "Suzhou HQ"}
                      </h3>
                      <p className="text-sm text-[#636E72]">{lang === "zh" ? "中国" : "China"}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-[#A3B18A]" />
                    <p className="text-[#636E72]">
                      {lang === "zh" ? (
                        <>
                          中国 (江苏) 自由贸易试验区苏州片区<br />
                          苏州工业园区苏虹东路188号A幢232A室
                        </>
                      ) : (
                        <>
                          ROOM 232A, BUILDING A, NO. 188 SUHONG EAST ROAD,<br />
                          SUZHOU INDUSTRIAL PARK, SUZHOU AREA,<br />
                          CHINA (JIANGSU) PILOT FREE TRADE ZONE
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#E9B35F]">
                      <Mail className="size-6 text-[#1B4D3E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">{lang === "zh" ? "电子邮箱" : "Email"}</h3>
                      <div className="mt-1 space-y-1">
                        <a
                          href="mailto:justin@hexiabio.com"
                          className="block text-[#2D6A4F] hover:text-[#E9B35F] transition-colors"
                        >
                          justin@hexiabio.com
                        </a>
                        <a
                          href="mailto:morehope.justin@gmail.com"
                          className="block text-[#2D6A4F] hover:text-[#E9B35F] transition-colors"
                        >
                          morehope.justin@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WeChat/WhatsApp */}
                <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#25D366]">
                      <MessageCircle className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">{lang === "zh" ? "微信 / WhatsApp" : "WeChat/WhatsApp"}</h3>
                      <span className="text-[#2D6A4F]">+86 138 6232 0011</span>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
                      <Headphones className="size-6" />
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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-[#636E72]">Loading...</div>
      </div>
    }>
      <ContactContent />
    </Suspense>
  )
}
