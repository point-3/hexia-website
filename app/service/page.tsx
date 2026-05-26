"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Package, BarChart3, GraduationCap, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"
import { t, getHrefWithLang } from "@/lib/i18n"

function ServiceContent() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const services = lang === "zh" ? [
    {
      icon: Package,
      title: "供应链管理",
      description: "一站式解决您的采购和物流需求",
      details: [
        "精细的供应链管理",
        "高效的拼箱配舱装载",
        "灵活的国际物流服务",
        "门到门送货服务",
        "实时货物追踪",
      ],
    },
    {
      icon: BarChart3,
      title: "实时市场动态",
      description: "为您提供最新的行业市场行情趋势",
      details: [
        "氨基酸月度价格走势报告",
        "维生素市场动态分析",
        "LinkedIn 定期动态分享",
        "行业新闻与深度见解",
        "可根据需求定制市场报告",
      ],
    },
    {
      icon: GraduationCap,
      title: "赫夏商学院",
      description: "专业的人才发展与知识共享平台",
      details: [
        "行业技能培训计划",
        "技术研讨与分享会",
        "优秀实践案例交流",
        "合规与监管政策指南",
        "新产品开发技术支持",
      ],
    },
  ] : [
    {
      icon: Package,
      title: "Supply Chain Management",
      description: "One-stop solution for all your sourcing needs",
      details: [
        "Refined supply-chain management",
        "Mixed container loading for cost efficiency",
        "Flexible logistics options",
        "Door-to-door delivery service",
        "Real-time shipment tracking",
      ],
    },
    {
      icon: BarChart3,
      title: "Market Intelligence",
      description: "Stay informed with the latest industry trends",
      details: [
        "Monthly Amino Acid price trend reports",
        "Vitamin market analysis",
        "Regular LinkedIn updates",
        "Industry news and insights",
        "Customized market reports on request",
      ],
    },
    {
      icon: GraduationCap,
      title: "Hexia Business Academy",
      description: "Professional development and knowledge sharing",
      details: [
        "Industry training programs",
        "Technical workshops",
        "Best practices sharing",
        "Regulatory compliance guidance",
        "New product development support",
      ],
    },
  ]
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
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {/* Services Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group rounded-2xl border-l-4 border-[#A3B18A] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#2D6A4F] hover:shadow-lg lg:p-8"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#2D6A4F]">
                    <service.icon className="size-7 text-white" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#1B4D3E]">{service.title}</h3>
                  <p className="mt-2 text-[#636E72]">{service.description}</p>

                  <ul className="mt-6 space-y-3">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm text-[#636E72]">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#E9B35F]" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={getHrefWithLang("/contact", lang)}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                  >
                    {lang === "zh" ? "联系我们" : "Contact Us"}
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="bg-[#F5F3EF] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                {lang === "zh" ? <>为什么选择我们的<span className="text-[#E9B35F]">服务</span></> : <>Why Choose Our <span className="text-[#E9B35F]">Services</span></>}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                {t("service.whyChooseDesc", lang)}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "20+", label: lang === "zh" ? "年行业深耕经验" : "Years of Industry Experience" },
                { value: "99%", label: lang === "zh" ? "客户满意率" : "Customer Satisfaction Rate" },
                { value: "48h", label: lang === "zh" ? "平均响应时间" : "Average Response Time" },
                { value: "24/7", label: t("home.statsSupport", lang) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="text-3xl font-bold text-[#2D6A4F]">{stat.value}</div>
                  <div className="mt-2 text-sm text-[#636E72]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                  {t("inquiry.formTitle", lang)}
                </h2>
                <p className="mt-4 text-[#636E72]">
                  {t("inquiry.formSubtitle", lang)}
                </p>
              </div>

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

              {/* Success Message */}
              {showSuccess && (
                <div className="mt-4 rounded-xl bg-[#2D6A4F]/20 p-4 text-center">
                  <p className="text-sm font-medium text-[#2D6A4F]">
                    {t("inquiry.successToast", lang)}
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#636E72]">
                <Headphones className="size-5 text-[#2D6A4F]" />
                <span>{t("home.onlineSupport", lang)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ServicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-[#636E72]">Loading...</div>
      </div>
    }>
      <ServiceContent />
    </Suspense>
  )
}
