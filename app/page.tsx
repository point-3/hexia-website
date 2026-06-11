import type { Metadata } from "next"
import { Suspense } from "react"
import { Navbar } from "@/components/hexia/navbar"
import { HeroSection } from "@/components/hexia/hero-section"
import { WhyChooseSection } from "@/components/hexia/why-choose-section"
import { ProductsSection } from "@/components/hexia/products-section"
import { AboutSection } from "@/components/hexia/about-section"
import { ServicesSection } from "@/components/hexia/services-section"
import { QuoteFormSection } from "@/components/hexia/quote-form-section"
import { PartnersSection } from "@/components/hexia/partners-section"
import { CustomContentSection } from "@/components/hexia/custom-content-section"
import { Footer } from "@/components/hexia/footer"
import { BackToTop } from "@/components/hexia/back-to-top"
import { FloatingSidebar } from "@/components/hexia/floating-sidebar"

import { getBanners } from "@/lib/api/banners"
import { getCategories, getSubcategories } from "@/lib/api/products"
import { getPageLayout } from "@/lib/api/site-config"
import type { PageLayout, PageSection } from "@/lib/directus"
import { getPageMetadataFromSearchParams } from "@/lib/seo"

/** 首页含轮播图，须与 Directus 后台实时同步（避免换图后仍显示旧缓存） */
export const dynamic = 'force-dynamic'

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("home", searchParams)
}

function fallbackHomeSection(sectionKey: string, sectionType: string, sort: number): PageSection {
  return {
    id: -sort,
    section_key: sectionKey,
    section_type: sectionType,
    status: "published",
    sort,
    is_system: true,
  }
}

function homeSections(layout: PageLayout): PageSection[] {
  const sections = layout.sections ?? []
  if (layout.id !== 0) return sections

  return [
    fallbackHomeSection("why_choose", "why_choose", 1),
    fallbackHomeSection("products_preview", "system", 2),
    fallbackHomeSection("about", "about", 3),
    fallbackHomeSection("services", "services", 4),
    fallbackHomeSection("quote_form", "system", 5),
    fallbackHomeSection("partners", "partners", 6),
  ]
}

export default async function HomePage() {
  // 服务端并发获取数据模型
  const [banners, categories, subcategories, layout] = await Promise.all([
    getBanners(),
    getCategories(),
    getSubcategories(),
    getPageLayout("home"),
  ])
  const sections = homeSections(layout)

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-[var(--text-body)]">Loading...</div>
      </div>
    }>
      <main className="min-h-screen home">
        {/* Navigation */}
        <Navbar variant="transparent" />

        {/* Hero Section */}
        <HeroSection banners={banners} />

        {sections.map((section) => {
          if (section.section_key === "why_choose" || section.section_type === "why_choose") {
            return <WhyChooseSection key={section.id} section={section} />
          }
          if (section.section_key === "products_preview") {
            return <ProductsSection key={section.id} categories={categories} subcategories={subcategories} />
          }
          if (section.section_key === "about" || section.section_type === "about") {
            return <AboutSection key={section.id} section={section} />
          }
          if (section.section_key === "services" || section.section_type === "services") {
            return <ServicesSection key={section.id} section={section} />
          }
          if (section.section_key === "quote_form") {
            return <QuoteFormSection key={section.id} />
          }
          if (section.section_key === "partners" || section.section_type === "partners") {
            return <PartnersSection key={section.id} section={section} />
          }
          if (section.section_type === "custom_content" || section.section_key.startsWith("custom_")) {
            return <CustomContentSection key={section.id} section={section} />
          }
          return null
        })}

        {/* Footer */}
        <Footer />

        {/* Back to Top */}
        <BackToTop />

        {/* Floating Sidebar */}
        <FloatingSidebar />
      </main>
    </Suspense>
  )
}
