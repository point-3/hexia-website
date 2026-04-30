"use client"

import { Clock, Package, Globe } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "10+ Years Experience",
    description: "Professional team with deep market insight and industry expertise.",
  },
  {
    icon: Package,
    title: "One-Stop Sourcing",
    description: "From feed additives to food ingredients, we cover all your needs.",
  },
  {
    icon: Globe,
    title: "Global Logistics",
    description: "Covering major ports with flexible shipping options worldwide.",
  },
]

export function WhyChooseSection() {
  return (
    <section className="bg-[#FDFBF7] py-20 lg:py-28">
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
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-[var(--hexia-sage)] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex rounded-xl bg-[var(--hexia-forest)] p-4 text-white transition-colors group-hover:bg-[var(--hexia-gold)]">
                <feature.icon className="size-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[var(--hexia-forest-dark)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-pretty text-[#636E72]">
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
