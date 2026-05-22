"use client"

import { Users, Building2, Package, Factory, Shield, Globe, Sparkles, Wrench } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Professional Team",
    description: "Core team with over 20 years of experience in nutrition raw material export industry.",
  },
  {
    icon: Building2,
    title: "Company Layout",
    description: "Headquartered in Suzhou Free Trade Zone, with independent subsidiaries in Hong Kong and the UK.",
  },
  {
    icon: Package,
    title: "Complete Product Range",
    description: "Cover amino acids, vitamins, minerals, pigments, enzyme preparations and special nutritional raw materials.",
  },
  {
    icon: Factory,
    title: "Independent Production Capacity",
    description: "Self-owned production lines, supporting OEM & ODM for vitamin and mineral premix feed.",
  },
  {
    icon: Shield,
    title: "Strict Quality Control",
    description: "Standard quality inspection system, stable batch purity and consistent quality.",
  },
  {
    icon: Globe,
    title: "Global Market Coverage",
    description: "Serving Europe, America, Southeast Asia and other international markets.",
  },
  {
    icon: Sparkles,
    title: "One-stop Solution",
    description: "Provide overall supply chain solutions for animal nutrition and food nutrition.",
  },
  {
    icon: Wrench,
    title: "Customized Service",
    description: "Flexible packaging, formula customization and professional technical support.",
  },
]

export function WhyChooseSection() {
  return (
    <section className="bg-[#FDFBF7] pt-8 pb-20 lg:pt-12 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--hexia-forest-dark)] sm:text-4xl">
            Why Choose <span className="text-[var(--hexia-gold)]">Hexia</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
            We deliver excellence through experience, comprehensive solutions, and global reach.
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