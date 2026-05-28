"use client"

import { Truck, Shield, TrendingUp } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { t } from "@/lib/i18n"

export function ServicesSection() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const services = [
    {
      icon: Truck,
      title: t("home.serviceScmTitle", lang),
      description: t("home.serviceScmDesc", lang),
    },
    {
      icon: Shield,
      title: t("home.serviceQaTitle", lang),
      description: t("home.serviceQaDesc", lang),
    },
    {
      icon: TrendingUp,
      title: t("home.serviceMarketTitle", lang),
      description: t("home.serviceMarketDesc", lang),
    },
  ]
  return (
    <section id="service" className="bg-[#FDFBF7] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1B4D3E] sm:text-4xl">
            {lang === "zh" ? (
              <>
                我们的 <span className="text-[#E9B35F]">专属服务</span>
              </>
            ) : (
              <>
                Our <span className="text-[#E9B35F]">Services</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
            {t("home.servicesDesc", lang)}
          </p>
        </div>

        {/* Service Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-2xl border-l-4 border-[#A3B18A] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2D6A4F] hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex rounded-xl bg-[#2D6A4F]/10 p-4 text-[#2D6A4F] transition-colors group-hover:bg-[#2D6A4F] group-hover:text-white">
                <service.icon className="size-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#1B4D3E]">
                {service.title}
              </h3>
              <p className="mt-3 text-pretty text-[#636E72] leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
