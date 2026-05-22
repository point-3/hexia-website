"use client"

import { Truck, Shield, TrendingUp } from "lucide-react"

const services = [
  {
    icon: Truck,
    title: "Supply Chain Management",
    description: "One-stop solution: refined supply-chain management, mixed container loading, flexible logistics.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Our partner factories adhere to HACCP, ISO, FAMI-QS, FDA, and GMP standards. Quality is our core value.",
  },
  {
    icon: TrendingUp,
    title: "Live Market Information",
    description: "We share the latest market trends and intelligence via our website and LinkedIn to keep our customers updated. Monthly reports on Amino Acid and Vitamin price trends.",
  },
]

export function ServicesSection() {
  return (
    <section id="service" className="bg-[#FDFBF7] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1B4D3E] sm:text-4xl">
            Our <span className="text-[#E9B35F]">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
            Comprehensive solutions tailored to your business needs.
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
