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
import { Footer } from "@/components/hexia/footer"
import { BackToTop } from "@/components/hexia/back-to-top"
import { FloatingSidebar } from "@/components/hexia/floating-sidebar"

import { getBanners } from "@/lib/api/banners"
import { getCategories, getSubcategories } from "@/lib/api/products"
import { getPageMetadataFromSearchParams } from "@/lib/seo"

/** 首页含轮播图，须与 Directus 后台实时同步（避免换图后仍显示旧缓存） */
export const dynamic = 'force-dynamic'

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  return getPageMetadataFromSearchParams("home", searchParams)
}

export default async function HomePage() {
  // 服务端并发获取数据模型
  const [banners, categories, subcategories] = await Promise.all([
    getBanners(),
    getCategories(),
    getSubcategories()
  ])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-[#636E72]">Loading...</div>
      </div>
    }>
      <main className="min-h-screen home">
        {/* Navigation */}
        <Navbar variant="transparent" />

        {/* Hero Section */}
        <HeroSection banners={banners} />

        {/* Why Choose Hexia */}
        <WhyChooseSection />

        {/* Products Preview */}
        <ProductsSection categories={categories} subcategories={subcategories} />

        {/* About Us with Stats */}
        <AboutSection />

        {/* Services */}
        <ServicesSection />

        {/* Quote Form */}
        <QuoteFormSection />

        {/* Partners */}
        <PartnersSection />

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
