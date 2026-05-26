"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Target, Award, GraduationCap, MapPin, Users } from "lucide-react"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { PartnersSection } from "@/components/hexia/partners-section"
import { AboutHeroSection } from "@/components/hexia/about-hero-section"
import { t } from "@/lib/i18n"

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0
          const duration = 2000
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return <span ref={ref}>{count}{suffix}</span>
}

function AboutContent() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const teamActivities = lang === "zh" ? [
    { title: "团队建设", image: "/images/hexia-team.jpg" },
    { title: "年会庆典", image: "/images/hexia-team.jpg" },
    { title: "培训交流", image: "/images/hexia-team.jpg" },
  ] : [
    { title: "Team Building", image: "/images/hexia-team.jpg" },
    { title: "Annual Meetings", image: "/images/hexia-team.jpg" },
    { title: "Training Programs", image: "/images/hexia-team.jpg" },
  ]
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar variant="transparent" />

      <main>
        {/* Hero Banner */}
        <AboutHeroSection />

        {/* Company Introduction */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-[#FDFBF7] via-[#F7FAF8] to-[#EDF7F1] bg-[radial-gradient(circle_at_top_left,rgba(64,145,108,0.08),transparent_35%)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                  {lang === "zh" ? "关于赫夏" : <>About <span className="text-[#E9B35F]">Hexia</span></>}
                </h2>
                <div className="mt-6 space-y-4 text-[#636E72] leading-relaxed">
                  {lang === "zh" ? (
                    <>
                      <p>{t("home.aboutP1", lang)}</p>
                      <p>
                        我们致力于从中国获得认证的优质生产商处，采购高品质的氨基酸、维生素、矿物质和特种原料，为欧洲、美洲、东南亚及全球的客户提供服务。
                      </p>
                      <p>
                        我们对质量、可靠性和优质服务的承诺，使我们成为在动物和人类营养领域寻求高效供应链解决方案的企业值得信赖的合作伙伴。
                      </p>
                    </>
                  ) : (
                    <>
                      <p>{t("home.aboutP1", lang)}</p>
                      <p>
                        We specialize in sourcing high-quality amino acids, vitamins, minerals, and specialty ingredients
                        from certified manufacturers in China, serving customers across Europe, Americas, Southeast Asia,
                        and beyond.
                      </p>
                      <p>
                        Our commitment to quality, reliability, and customer service has made us a trusted partner for
                        businesses seeking efficient supply chain solutions in animal and human nutrition.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#2D6A4F] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl"><Counter end={20} suffix="+" /></div>
                  <div className="mt-2 text-sm text-white/80">{t("home.statsExp", lang)}</div>
                </div>
                <div className="rounded-2xl bg-[#1B4D3E] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl"><Counter end={642} suffix="+" /></div>
                  <div className="mt-2 text-sm text-white/80">{t("home.statsPartners", lang)}</div>
                </div>
                <div className="rounded-2xl bg-[#1B4D3E] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl"><Counter end={175} suffix="+" /></div>
                  <div className="mt-2 text-sm text-white/80">{t("home.statsCountries", lang)}</div>
                </div>
                <div className="rounded-2xl bg-[#2D6A4F] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl">24/7</div>
                  <div className="mt-2 text-sm text-white/80">{t("home.statsSupport", lang)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Hero */}
        <section className="relative z-0 bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] py-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#leaf-pattern)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {lang === "zh" ? "赫夏 (苏州) 生物科技有限公司" : "Hexia (Suzhou) Biotechnology Co., Ltd."}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg text-white/80">
                {lang === "zh"
                  ? "总部位于苏州自贸区，并在香港和英国设有独立子公司。我们专注于动物营养和人类食品原料领域，致力于为全球客户提供全面的一站式解决方案。"
                  : "Headquartered in Suzhou Free Trade Zone, the company has established subsidiaries in Hong Kong and the United Kingdom. Dedicated to the fields of animal nutrition and food nutrition, we strive to deliver comprehensive one-stop solutions for global clients."}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#F5F3EF] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#2D6A4F]">
                <Target className="size-8 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                {lang === "zh" ? "我们的使命" : "Our Mission"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[#636E72]">
                {lang === "zh" ? (
                  <>
                    成为您在动物和人类营养领域需求的<span className="font-semibold text-[#2D6A4F]">一站式解决方案</span>，提供可靠的采购、高效的物流和卓越的客户服务。
                  </>
                ) : (
                  <>
                    To become a <span className="font-semibold text-[#2D6A4F]">one-stop solution</span> for your demand
                    in animal and human nutrition, providing reliable sourcing, efficient logistics, and outstanding
                    customer service.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Global Presence */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#2D6A4F]">
                <MapPin className="size-8 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                {lang === "zh" ? "全球化布局" : "Global Presence"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                {lang === "zh"
                  ? "总部位于苏州，并在香港和英国设有子公司，服务全球市场"
                  : "Headquartered in Suzhou with subsidiaries in Hong Kong and the UK, serving global markets"}
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
                <h3 className="font-semibold text-[#1B4D3E]">
                  {lang === "zh" ? "苏州总部地址" : "Suzhou HQ Address"}
                </h3>
                <p className="mt-2 text-[#636E72]">
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
              <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
                <h3 className="font-semibold text-[#1B4D3E]">
                  {lang === "zh" ? "服务区域" : "Service Areas"}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(lang === "zh" ? ["欧洲", "美洲", "东南亚", "全球"] : ["Europe", "Americas", "Southeast Asia", "Global"]).map((area) => (
                    <span key={area} className="rounded-full bg-[#2D6A4F]/10 px-4 py-2 text-sm font-medium text-[#2D6A4F]">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <PartnersSection />

        {/* Team Activities */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E9B35F]">
                <Users className="size-8 text-[#1B4D3E]" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                {lang === "zh" ? "团队活动" : "Team Activities"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                {lang === "zh"
                  ? "通过丰富多彩的团队建设和活动构建强有力的企业文化"
                  : "Building a strong team culture through various activities and events"}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="group overflow-hidden rounded-2xl border border-[#A3B18A] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B4D3E]/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-[#636E72]">Loading...</div>
      </div>
    }>
      <AboutContent />
    </Suspense>
  )
}
