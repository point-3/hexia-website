"use client"

import { useState } from 'react'
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="bg-[#FDFBF7] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B4D3E]">
            Why Choose <span className="text-[#E9B35F]">Hexia</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#636E72]">
            We deliver excellence through experience, comprehensive solutions, and global reach.
          </p>
        </div>

        {/* PC Layout - 2 rows with flex for hover expansion */}
        <div className="hidden lg:block">
          {/* Row 1: Cards 0-3 */}
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
                  {/* Hover Background - Dark Green - Place before content so it shows underneath */}
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

                  {/* Card Content - Higher z-index to stay above background */}
                  <div className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center z-10">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                      style={{
                        backgroundColor: isHovered ? '#E9B35F' : 'rgba(45, 106, 79, 0.1)',
                        color: isHovered ? '#ffffff' : '#2D6A4F'
                      }}
                    >
                      <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-base font-semibold text-center mb-3 uppercase tracking-wide"
                      style={{
                        color: isHovered ? '#ffffff' : '#1B4D3E',
                        transition: 'color 0.5s ease-out'
                      }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
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

          {/* Row 2: Cards 4-7 */}
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
                  {/* Hover Background - Dark Green - Place before content so it shows underneath */}
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

                  {/* Card Content - Higher z-index to stay above background */}
                  <div className="relative min-h-[260px] p-6 lg:p-8 flex flex-col items-center justify-center z-10">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                      style={{
                        backgroundColor: isHovered ? '#E9B35F' : 'rgba(45, 106, 79, 0.1)',
                        color: isHovered ? '#ffffff' : '#2D6A4F'
                      }}
                    >
                      <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-base font-semibold text-center mb-3 uppercase tracking-wide"
                      style={{
                        color: isHovered ? '#ffffff' : '#1B4D3E',
                        transition: 'color 0.5s ease-out'
                      }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
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

        {/* Mobile/Tablet Layout - Grid */}
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
                {/* Icon */}
                <div 
                  className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-colors duration-500"
                  style={{
                    backgroundColor: isHovered ? '#E9B35F' : 'rgba(45, 106, 79, 0.1)',
                    color: isHovered ? '#ffffff' : '#2D6A4F'
                  }}
                >
                  <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-center text-[#1B4D3E] mb-3 uppercase tracking-wide">
                  {feature.title}
                </h3>

                {/* Description */}
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