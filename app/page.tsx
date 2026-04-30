import { Navbar } from "@/components/hexia/navbar"
import { HeroSection } from "@/components/hexia/hero-section"
import { WhyChooseSection } from "@/components/hexia/why-choose-section"
import { ProductsSection } from "@/components/hexia/products-section"
import { AboutSection } from "@/components/hexia/about-section"
import { ServicesSection } from "@/components/hexia/services-section"
import { QuoteFormSection } from "@/components/hexia/quote-form-section"
import { PartnersSection } from "@/components/hexia/partners-section"
import { Footer } from "@/components/hexia/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navbar variant="transparent" />

      {/* Hero Section */}
      <HeroSection />

      {/* Why Choose Hexia */}
      <WhyChooseSection />

      {/* Products Preview */}
      <ProductsSection />

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
    </main>
  )
}
