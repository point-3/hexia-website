"use client"

import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { t, getHrefWithLang } from "@/lib/i18n"

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const startTime = Date.now()
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(value * easeOut))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  )
}

export function AboutSection() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const stats = [
    { value: 20, suffix: "+", label: t("home.statsExp", lang) },
    { value: 642, suffix: "+", label: t("home.statsPartners", lang) },
    { value: 175, suffix: "+", label: t("home.statsCountries", lang) },
    { value: 24, suffix: "/7", label: t("home.statsSupport", lang) },
  ]

  return (
    <section id="about" className="bg-[#FDFBF7] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#1B4D3E] sm:text-4xl">
              {lang === "zh" ? (
                <>
                  关于 <span className="text-[#E9B35F]">赫夏</span> (苏州) 生物科技
                </>
              ) : (
                <>
                  About <span className="text-[#E9B35F]">Hexia</span> (Suzhou) Biotech
                </>
              )}
            </h2>
            
            <div className="mt-6 space-y-4 text-pretty text-[#636E72] leading-relaxed">
              <p>
                {t("home.aboutP1", lang)}
              </p>
              <p>
                {t("home.aboutP2", lang)}
              </p>
            </div>

            <a
              href={getHrefWithLang("/about", lang)}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
            >
              {t("news.readMore", lang)}
              <ArrowRight className="size-4" />
            </a>
          </div>

          {/* Right Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-2xl bg-[#1B4D3E] p-6 text-center transition-all duration-300 hover:bg-[#2D6A4F]"
              >
                <span className="text-3xl font-bold text-white sm:text-4xl">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-2 text-sm text-white/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
