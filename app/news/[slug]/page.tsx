"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Calendar, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"

// Article data (matches news list page)
const articlesData: Record<string, {
  title: string
  date: string
  category: string
  image: string
  content: string[]
}> = {
  "amino-acid-market-2026": {
    title: "Global Amino Acid Market Trends Q1 2026",
    date: "April 25, 2026",
    category: "Market Report",
    image: "/images/feed-additives.jpg",
    content: [
      "The global amino acid market continued its upward trajectory in Q1 2026, driven by robust demand from the animal feed industry and expanding applications in human nutrition. This comprehensive report examines key trends, pricing dynamics, and regional developments that are shaping the market landscape.",
      "Methionine prices saw a notable increase of 8-12% compared to Q4 2025, primarily driven by supply constraints from major producers and growing demand in the poultry sector. DL-Methionine, a critical feed additive for poultry nutrition, remains one of the most traded amino acids globally.",
      "L-Lysine HCL maintained stable pricing throughout the quarter, with Chinese manufacturers continuing to dominate global supply. The feed-grade lysine market benefited from strong demand across Southeast Asia and Latin America, where livestock production continues to expand.",
      "L-Threonine experienced moderate price fluctuations, with a slight upward trend toward the end of Q1. European buyers increased procurement volumes ahead of anticipated supply tightness in Q2, while Asian markets remained relatively stable.",
      "The specialty amino acids segment, including L-Tryptophan and L-Valine, showed promising growth as more feed formulators adopted precision nutrition strategies. This trend is expected to accelerate throughout 2026 as the industry focuses on optimizing feed conversion ratios and reducing environmental impact.",
      "Looking ahead to Q2 2026, market analysts anticipate continued price firmness for most amino acids. Key factors to watch include raw material costs, energy prices in China, and potential supply chain disruptions. Hexia Biotechnology remains committed to providing competitive pricing and reliable supply to our global partners.",
    ],
  },
  "vitamin-price-update": {
    title: "Vitamin Market Price Update - April 2026",
    date: "April 20, 2026",
    category: "Price Report",
    image: "/images/feed-additives.jpg",
    content: [
      "The global vitamin market for feed and food applications continues to evolve, with notable price movements across several key products in April 2026. This monthly report provides an overview of the latest pricing trends and market dynamics.",
      "Vitamin A (1000IU/g) prices have stabilized after the volatility experienced in late 2025. Current FOB China prices range from $28-32/kg, representing a 5% decrease from March levels. Market participants expect prices to remain stable through Q2.",
      "Vitamin D3 (500IU/g) saw a slight uptick in pricing, driven by seasonal demand from the European poultry sector. The market remains well-supplied, with Chinese producers operating at 70-80% capacity utilization.",
      "Vitamin E (50%) prices continued their gradual decline, reflecting ample supply from major producers. Feed-grade Vitamin E is currently trading at $8.5-9.5/kg FOB China, down approximately 3% from the previous month.",
      "B-complex vitamins, including B1, B2, B6, and B12, showed mixed trends. Riboflavin (B2) prices firmed on the back of production curtailments at select Chinese facilities, while other B-vitamins remained relatively stable.",
      "Hexia Biotechnology offers competitive pricing on all vitamin products with flexible payment terms and reliable delivery schedules. Contact our sales team for the latest quotations and availability.",
    ],
  },
  "fami-qs-certification": {
    title: "Understanding FAMI-QS Certification Requirements",
    date: "April 15, 2026",
    category: "Industry Guide",
    image: "/images/feed-additives.jpg",
    content: [
      "FAMI-QS (Feed Additives and Premixtures Quality System) certification has become an essential credential for companies operating in the European feed additives market. This comprehensive guide explains the requirements, benefits, and process of obtaining FAMI-QS certification.",
      "The FAMI-QS certification scheme was developed by the European feed additives industry to ensure the quality and safety of specialty feed ingredients throughout the supply chain. It covers manufacturers, traders, and distributors of feed additives and premixtures.",
      "Key requirements for FAMI-QS certification include implementing a robust quality management system, ensuring product traceability, maintaining proper documentation, and conducting regular internal audits. Companies must also demonstrate compliance with relevant EU regulations on feed safety.",
      "The certification process typically involves an initial assessment, implementation of required quality procedures, an external audit by an accredited certification body, and ongoing surveillance audits. The entire process can take 6-12 months depending on the company's existing quality infrastructure.",
      "Benefits of FAMI-QS certification include enhanced market access in Europe, improved customer confidence, reduced risk of product recalls, and alignment with international best practices. Many European feed companies now require FAMI-QS certification from their suppliers as a minimum quality standard.",
      "Hexia Biotechnology works exclusively with FAMI-QS certified manufacturers, ensuring that all our feed additive products meet the highest European quality standards. Our team can assist customers with documentation and compliance requirements for smooth import procedures.",
    ],
  },
  "nmn-research-update": {
    title: "Latest Research on NMN Benefits and Applications",
    date: "April 10, 2026",
    category: "Research",
    image: "/images/nutritional-products.jpg",
    content: [
      "Nicotinamide Mononucleotide (NMN) continues to be at the forefront of anti-aging and longevity research, with several significant studies published in Q1 2026 providing new insights into its mechanisms of action and potential health benefits.",
      "A landmark clinical trial published in Nature Aging demonstrated that daily NMN supplementation at 500mg significantly increased NAD+ levels in middle-aged adults within just two weeks. Participants also reported improvements in energy levels, sleep quality, and physical endurance after 12 weeks of supplementation.",
      "Researchers at Tokyo University published findings showing NMN's potential role in supporting cardiovascular health. The study, conducted over 6 months, showed that NMN supplementation improved vascular function markers in adults aged 55-75, suggesting potential benefits for age-related cardiovascular decline.",
      "In the field of metabolic health, a new study from Stanford University demonstrated that NMN supplementation improved insulin sensitivity in overweight adults. These findings align with earlier preclinical data and open new avenues for NMN applications in metabolic health management.",
      "The global NMN market continues to expand rapidly, with estimated market size reaching $800 million in 2026. Key growth drivers include aging populations, increasing health consciousness, and growing scientific evidence supporting NMN's efficacy.",
      "Hexia Biotechnology supplies pharmaceutical-grade NMN (≥99% purity) produced through advanced enzymatic biosynthesis technology. Our NMN products are backed by comprehensive certificates of analysis and are suitable for dietary supplement formulations worldwide.",
    ],
  },
  "supply-chain-logistics": {
    title: "Optimizing Supply Chain for Feed Ingredients",
    date: "April 5, 2026",
    category: "Industry Guide",
    image: "/images/feed-additives.jpg",
    content: [
      "Efficient supply chain management is crucial for success in the global feed ingredients trade. This guide outlines best practices and strategies for optimizing your supply chain operations, from sourcing to delivery.",
      "Supplier qualification and management form the foundation of a reliable supply chain. Companies should maintain a diversified supplier base, conduct regular quality audits, and establish clear specifications and quality agreements with each supplier. At Hexia, we work with over 50 qualified manufacturers to ensure consistent supply.",
      "Mixed container loading (MCL) is an effective strategy for reducing logistics costs, especially for companies purchasing multiple products in smaller quantities. By consolidating different products into a single container, buyers can achieve significant savings on shipping costs while maintaining adequate inventory levels.",
      "Inventory management strategies should balance the cost of carrying inventory against the risk of stockouts. Just-in-time (JIT) approaches work well for stable, high-volume products, while safety stock strategies are recommended for specialty ingredients with longer lead times or price volatility.",
      "Documentation and compliance are critical for smooth international trade. Key documents include certificates of analysis, certificates of origin, phytosanitary certificates, and MSDS/SDS. Working with an experienced trading partner like Hexia ensures all documentation requirements are met before shipment.",
      "Hexia Biotechnology's integrated supply chain services cover everything from sourcing and quality verification to logistics coordination and after-sales support. Our team's deep industry experience enables us to provide solutions that optimize both cost and reliability for our global partners.",
    ],
  },
  "biluochun-harvest": {
    title: "2026 Biluochun Spring Harvest Preview",
    date: "March 28, 2026",
    category: "Product News",
    image: "/images/suzhou-specialty.jpg",
    content: [
      "As spring arrives in the Dongting Mountain area of Suzhou, tea enthusiasts around the world eagerly await the annual Biluochun harvest. Early reports from 2026 indicate exceptional quality prospects for this year's premium green tea crop.",
      "Biluochun, one of China's top ten famous teas, is exclusively produced in the Dongting East and West Mountain areas surrounding Taihu Lake in Suzhou. The tea is characterized by its tightly rolled, spiral-shaped leaves, delicate appearance, and distinctive fresh, fruity aroma.",
      "This year's harvest benefits from favorable weather conditions during the critical growth period. Moderate winter temperatures followed by a gradual warming trend in March have promoted optimal bud development. Tea masters report that the first flush leaves show excellent tenderness and color.",
      "The traditional hand-picking process begins when tea buds reach the ideal size of one bud and one leaf. Skilled pickers can harvest approximately 500 grams of fresh leaves per day, which yields only about 100 grams of finished tea, highlighting the artisanal nature of authentic Biluochun production.",
      "Processing involves multiple steps including withering, kill-green (sha qing), rolling, and drying. The distinctive spiral shape is achieved through the traditional hand-rolling technique, where tea masters use precise movements to shape the leaves while maintaining the delicate cellular structure.",
      "Hexia Biotechnology offers direct-from-source Biluochun tea, carefully selected from the finest gardens in Dongting Mountain. Our tea undergoes rigorous quality testing to ensure authenticity and premium quality. Contact us for pre-order pricing and availability for the 2026 spring harvest.",
    ],
  },
  "food-additives-regulations": {
    title: "EU Food Additives Regulations Update 2026",
    date: "March 20, 2026",
    category: "Regulations",
    image: "/images/food-additives.jpg",
    content: [
      "The European Union continues to evolve its regulatory framework for food additives, with several important updates taking effect in 2026. This article summarizes the key changes and their implications for food ingredient importers and manufacturers.",
      "New labeling requirements for food additives will come into force in July 2026, requiring more detailed information on the origin and manufacturing process of certain additives. These changes primarily affect thickeners, emulsifiers, and acid regulators used in processed food products.",
      "The EU has completed its re-evaluation program for several commonly used food additives, resulting in updated acceptable daily intake (ADI) values for certain sweeteners and preservatives. Companies should review their product formulations to ensure compliance with the revised limits.",
      "Import documentation requirements have been streamlined under the new EU Single Window for Customs, reducing paperwork burden while maintaining strict quality and safety standards. However, exporters must now provide additional analytical data for certain categories of food additives.",
      "The European Food Safety Authority (EFSA) has published updated guidance on the data requirements for novel food additive applications, reflecting advances in toxicological testing methodologies and risk assessment approaches.",
      "Hexia Biotechnology's quality assurance team maintains up-to-date knowledge of EU regulatory requirements and can assist customers with compliance documentation, ensuring smooth import procedures. Our food additive products are sourced from manufacturers that meet all current EU quality and safety standards.",
    ],
  },
}

// Recent articles for sidebar
const recentArticles = [
  { id: "amino-acid-market-2026", title: "Global Amino Acid Market Trends Q1 2026", date: "April 25, 2026" },
  { id: "vitamin-price-update", title: "Vitamin Market Price Update - April 2026", date: "April 20, 2026" },
  { id: "fami-qs-certification", title: "Understanding FAMI-QS Certification Requirements", date: "April 15, 2026" },
  { id: "nmn-research-update", title: "Latest Research on NMN Benefits and Applications", date: "April 10, 2026" },
  { id: "supply-chain-logistics", title: "Optimizing Supply Chain for Feed Ingredients", date: "April 5, 2026" },
]

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const article = articlesData[slug]

  // Fallback for unknown slugs
  if (!article) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-20 lg:pt-24">
          <section className="bg-[#2D6A4F]/5 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <nav className="mb-4 flex items-center gap-2 text-sm">
                <Link href="/" className="text-[#636E72] hover:text-[#2D6A4F]">Home</Link>
                <ChevronRight className="size-4 text-[#636E72]" />
                <Link href="/news" className="text-[#636E72] hover:text-[#2D6A4F]">News</Link>
                <ChevronRight className="size-4 text-[#636E72]" />
                <span className="font-medium text-[#2D6A4F]">Article Not Found</span>
              </nav>
              <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">Article Not Found</h1>
              <p className="mt-2 text-[#636E72]">The article you are looking for does not exist.</p>
            </div>
          </section>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
            <Link href="/news">
              <Button className="bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white">
                <ArrowLeft className="mr-2 size-4" />
                Back to News
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Find adjacent articles for prev/next navigation
  const slugs = Object.keys(articlesData)
  const currentIndex = slugs.indexOf(slug)
  const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null
  const nextSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {/* Header */}
        <section className="bg-[#2D6A4F]/5 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/" className="text-[#636E72] hover:text-[#2D6A4F]">Home</Link>
              <ChevronRight className="size-4 text-[#636E72]" />
              <Link href="/news" className="text-[#636E72] hover:text-[#2D6A4F]">News</Link>
              <ChevronRight className="size-4 text-[#636E72]" />
              <span className="font-medium text-[#2D6A4F] line-clamp-1">{article.title}</span>
            </nav>

            <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">{article.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#636E72]">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="size-4" />
                <span className="rounded-full bg-[#2D6A4F]/10 px-2.5 py-0.5 text-[#2D6A4F] font-medium">
                  {article.category}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Article Content */}
              <div className="lg:col-span-2">
                {/* Featured Image */}
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[#A3B18A]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Article Body */}
                <article className="prose prose-lg max-w-none">
                  {article.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="mb-6 text-[#636E72] leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </article>

                {/* Share & Tags */}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#A3B18A]/30 pt-6">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-[#A3B18A]" />
                    <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                      {article.category}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-sm text-[#636E72] transition-colors hover:text-[#2D6A4F]">
                    <Share2 className="size-4" />
                    Share Article
                  </button>
                </div>

                {/* Prev / Next Navigation */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {prevSlug ? (
                    <Link
                      href={`/news/${prevSlug}`}
                      className="group rounded-xl border border-[#A3B18A] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="flex items-center gap-1 text-xs text-[#636E72]">
                        <ArrowLeft className="size-3" />
                        Previous Article
                      </span>
                      <span className="mt-1 block text-sm font-medium text-[#1B4D3E] transition-colors group-hover:text-[#2D6A4F] line-clamp-2">
                        {articlesData[prevSlug].title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextSlug && (
                    <Link
                      href={`/news/${nextSlug}`}
                      className="group rounded-xl border border-[#A3B18A] bg-white p-4 text-right transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="flex items-center justify-end gap-1 text-xs text-[#636E72]">
                        Next Article
                        <ArrowRight className="size-3" />
                      </span>
                      <span className="mt-1 block text-sm font-medium text-[#1B4D3E] transition-colors group-hover:text-[#2D6A4F] line-clamp-2">
                        {articlesData[nextSlug].title}
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Articles */}
                <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                  <h3 className="font-semibold text-[#1B4D3E]">Recent Articles</h3>
                  <ul className="mt-4 space-y-4">
                    {recentArticles
                      .filter((a) => a.id !== slug)
                      .slice(0, 4)
                      .map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/news/${item.id}`}
                            className="group block"
                          >
                            <div className="text-sm font-medium text-[#1B4D3E] transition-colors group-hover:text-[#2D6A4F] line-clamp-2">
                              {item.title}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-[#636E72]">
                              <Calendar className="size-3" />
                              {item.date}
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <Link
                    href="/news"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                  >
                    View All News
                    <ArrowRight className="size-3" />
                  </Link>
                </div>

                {/* Inquiry CTA */}
                <div className="rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] p-6 text-white">
                  <h3 className="font-semibold">Need More Information?</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Our experts are ready to help you with any questions about products, pricing, or market trends.
                  </p>
                  <Link href="/contact">
                    <Button className="mt-4 w-full bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#D4A04A]">
                      Contact Us
                    </Button>
                  </Link>
                </div>

                {/* Newsletter */}
                <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                  <h3 className="font-semibold text-[#1B4D3E]">Subscribe to Updates</h3>
                  <p className="mt-2 text-sm text-[#636E72]">
                    Get the latest market reports and industry news delivered to your inbox.
                  </p>
                  <form className="mt-4 space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                    />
                    <button
                      type="button"
                      className="w-full rounded-lg bg-[#E9B35F] py-2.5 text-sm font-semibold text-[#1B4D3E] transition-colors hover:bg-[#D4A04A]"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
