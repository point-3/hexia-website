"use client"

import { Users, Building2, Package, Factory, Shield, Globe, Sparkles, Wrench } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { t } from "@/lib/i18n"

export function WhyChooseSection() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const features = [
    {
      icon: Users,
      title: t("home.teamTitle", lang),
      description: t("home.teamDesc", lang),
    },
    {
      icon: Building2,
      title: t("home.layoutTitle", lang),
      description: t("home.layoutDesc", lang),
    },
    {
      icon: Package,
      title: t("home.rangeTitle", lang),
      description: t("home.rangeDesc", lang),
    },
    {
      icon: Factory,
      title: t("home.capacityTitle", lang),
      description: t("home.capacityDesc", lang),
    },
    {
      icon: Shield,
      title: t("home.qcTitle", lang),
      description: t("home.qcDesc", lang),
    },
    {
      icon: Globe,
      title: t("home.marketTitle", lang),
      description: t("home.marketDesc", lang),
    },
    {
      icon: Sparkles,
      title: t("home.solutionTitle", lang),
      description: t("home.solutionDesc", lang),
    },
    {
      icon: Wrench,
      title: t("home.customTitle", lang),
      description: t("home.customDesc", lang),
    },
  ]
  return (
    <section className="bg-[#FDFBF7] pt-8 pb-20 lg:pt-12 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--hexia-forest-dark)] sm:text-4xl">
            {lang === "zh" ? (
              <>
                为什么选择 <span className="text-[var(--hexia-gold)]">赫夏</span>
              </>
            ) : (
              <>
                Why Choose <span className="text-[var(--hexia-gold)]">Hexia</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
            {t("home.whyChooseDesc", lang)}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-[var(--hexia-sage)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex rounded-xl bg-[var(--hexia-forest)] p-3 text-white transition-colors group-hover:bg-[var(--hexia-gold)]">
                <feature.icon className="size-5" />
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-[var(--hexia-forest-dark)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-pretty text-[#636E72]">
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 h-1 w-0 rounded-b-2xl bg-[var(--hexia-gold)] transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}