"use client"

import { useState } from 'react'
import { Users, Building2, Package, Factory, Shield, Globe, Sparkles, Wrench } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { t } from "@/lib/i18n"

export function WhyChooseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
    <section className="bg-[#FDFBF7] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--hexia-forest-dark)] sm:text-4xl">
            {lang === "zh" ? (
              <>
                为什么选择 <span className="text-[var(--hexia-gold)]">和夏</span>
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

        <div className="hidden lg:block">
          <div className="flex gap-8 mb-8">
            {features.slice(0, 4).map((feature, index) => {
              const isHovered = hoveredIndex === index
              const isOtherInRow = hoveredIndex !== null && hoveredIndex !== index && hoveredIndex < 4
              
              return (
                <div
                  key={index}
                  className="relative"
                  style={{
                    flex: isHovered ? '0 0 calc(25% + 80px)' : isOtherInRow ? '1' : '1',
                    transition: 'flex 0.5s ease-out'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className="absolute top-0 left-0 right-0 bottom-0 rounded-none shadow-xl"
                    style={{
                      backgroundColor: '#2D6A4F',
                      opacity: isHovered ? 1 : 0,
                      zIndex: 0,
                      transition: 'opacity 0.5s ease-out',
                      marginLeft: isHovered ? '-40px' : '0',
                      marginRight: isHovered ? '-40px' : '0'
                    }}
                  />

                  <div className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center z-10">
                    <div 
                      className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                      style={{
                        backgroundColor: isHovered ? '#E9B35F' : 'rgba(45, 106, 79, 0.1)',
                        color: isHovered ? '#ffffff' : '#2D6A4F'
                      }}
                    >
                      <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    <h3 
                      className="text-base font-semibold text-center mb-3 uppercase tracking-wide"
                      style={{
                        color: isHovered ? '#ffffff' : '#1B4D3E',
                        transition: 'color 0.5s ease-out'
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p 
                      className="text-sm text-center leading-relaxed"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        color: isHovered ? 'rgba(255,255,255,0.9)' : '#636E72',
                        transition: 'opacity 0.5s ease-out, color 0.5s ease-out'
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-8">
            {features.slice(4, 8).map((feature, index) => {
              const actualIndex = index + 4
              const isHovered = hoveredIndex === actualIndex
              const isOtherInRow = hoveredIndex !== null && hoveredIndex >= 4 && hoveredIndex !== actualIndex
              
              return (
                <div
                  key={actualIndex}
                  className="relative"
                  style={{
                    flex: isHovered ? '0 0 calc(25% + 80px)' : isOtherInRow ? '1' : '1',
                    transition: 'flex 0.5s ease-out'
                  }}
                  onMouseEnter={() => setHoveredIndex(actualIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className="absolute top-0 left-0 right-0 bottom-0 rounded-none shadow-xl"
                    style={{
                      backgroundColor: '#2D6A4F',
                      opacity: isHovered ? 1 : 0,
                      zIndex: 0,
                      transition: 'opacity 0.5s ease-out',
                      marginLeft: isHovered ? '-40px' : '0',
                      marginRight: isHovered ? '-40px' : '0'
                    }}
                  />

                  <div className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center z-10">
                    <div 
                      className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                      style={{
                        backgroundColor: isHovered ? '#E9B35F' : 'rgba(45, 106, 79, 0.1)',
                        color: isHovered ? '#ffffff' : '#2D6A4F'
                      }}
                    >
                      <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    <h3 
                      className="text-base font-semibold text-center mb-3 uppercase tracking-wide"
                      style={{
                        color: isHovered ? '#ffffff' : '#1B4D3E',
                        transition: 'color 0.5s ease-out'
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p 
                      className="text-sm text-center leading-relaxed"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        color: isHovered ? 'rgba(255,255,255,0.9)' : '#636E72',
                        transition: 'opacity 0.5s ease-out, color 0.5s ease-out'
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
          {features.map((feature, index) => {
            const isHovered = hoveredIndex === index
            
            return (
              <div
                key={index}
                className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div 
                  className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                  style={{
                    backgroundColor: isHovered ? '#E9B35F' : 'rgba(45, 106, 79, 0.1)',
                    color: isHovered ? '#ffffff' : '#2D6A4F'
                  }}
                >
                  <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                <h3 className="text-base font-semibold text-center text-[#1B4D3E] mb-3 uppercase tracking-wide">
                  {feature.title}
                </h3>

                <p 
                  className="text-sm text-center text-[#636E72] leading-relaxed"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.5s ease-out'
                  }}
                >
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}