"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ChevronRightIcon, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { cn } from "@/lib/utils"

// Mock product data
const productData: Record<string, {
  name: string
  category: string
  description: string
  fullDescription: string
  images: string[]
  specs: { label: string; value: string }[]
}> = {
  methionine: {
    name: "DL-Methionine",
    category: "Amino Acids",
    description: "Feed Grade 99%",
    fullDescription: `Methionine is the first limiting amino acid in poultry and often considered limiting in swine diets. It plays a crucial role in protein synthesis, growth, and feather development.

DL-Methionine is widely used as an essential amino acid supplement in animal feed to improve the nutritional balance and promote optimal growth performance.

Our DL-Methionine is manufactured using advanced technology to ensure consistent quality and purity. It is available in various packaging sizes to meet your specific requirements.

**Key Benefits:**
- Enhances growth performance
- Improves feed conversion ratio
- Supports feather and fur development
- Essential for protein synthesis`,
    images: ["/images/feed-additives.jpg", "/images/feed-additives.jpg", "/images/feed-additives.jpg"],
    specs: [
      { label: "CAS Number", value: "59-51-8" },
      { label: "Purity", value: "≥99%" },
      { label: "Appearance", value: "White crystalline powder" },
      { label: "Application", value: "Feed additive" },
      { label: "Package", value: "25kg/bag" },
      { label: "Shelf Life", value: "24 months" },
    ],
  },
  lysine: {
    name: "L-Lysine HCL",
    category: "Amino Acids",
    description: "Feed Grade 98.5%",
    fullDescription: `L-Lysine is an essential amino acid that cannot be synthesized by animals and must be supplied through diet. It is the second limiting amino acid in swine and third in poultry.

Our L-Lysine HCL is produced through fermentation technology, ensuring high purity and excellent bioavailability for animal nutrition.

**Key Benefits:**
- Promotes muscle growth
- Improves feed efficiency
- Essential for tissue repair
- Supports immune function`,
    images: ["/images/feed-additives.jpg", "/images/feed-additives.jpg", "/images/feed-additives.jpg"],
    specs: [
      { label: "CAS Number", value: "657-27-2" },
      { label: "Purity", value: "≥98.5%" },
      { label: "Appearance", value: "White to light yellow powder" },
      { label: "Application", value: "Feed additive" },
      { label: "Package", value: "25kg/bag" },
      { label: "Shelf Life", value: "24 months" },
    ],
  },
  nmn: {
    name: "NMN (Beta-Nicotinamide Mononucleotide)",
    category: "Nutrition",
    description: "High Purity 99%",
    fullDescription: `NMN (Nicotinamide Mononucleotide) is a naturally occurring compound found in various food sources. It is a direct precursor to NAD+, an essential coenzyme in all living cells.

Our NMN is produced using enzymatic biosynthesis technology, ensuring the highest purity and stability for nutritional supplement applications.

**Key Benefits:**
- Supports cellular energy metabolism
- Promotes healthy aging
- Enhances NAD+ levels
- High bioavailability`,
    images: ["/images/nutritional-products.jpg", "/images/nutritional-products.jpg"],
    specs: [
      { label: "CAS Number", value: "1094-61-7" },
      { label: "Purity", value: "≥99%" },
      { label: "Appearance", value: "White powder" },
      { label: "Application", value: "Nutritional supplement" },
      { label: "Package", value: "1kg/bag, 25kg/drum" },
      { label: "Storage", value: "Cool and dry place" },
    ],
  },
  biluochun: {
    name: "Biluochun Tea",
    category: "Suzhou Specialty",
    description: "Premium Green Tea",
    fullDescription: `Biluochun is one of China's most famous green teas, originating from the Dongting Mountain area near Suzhou. Known for its delicate spiral-shaped leaves and fresh, fruity aroma.

Our Biluochun is hand-picked during early spring and processed using traditional methods to preserve its distinctive flavor and health benefits.

**Key Features:**
- Hand-picked from Dongting Mountain
- Traditional processing methods
- Fresh and fruity aroma
- Rich in antioxidants`,
    images: ["/images/suzhou-specialty.jpg", "/images/suzhou-specialty.jpg"],
    specs: [
      { label: "Origin", value: "Dongting, Suzhou" },
      { label: "Grade", value: "Premium" },
      { label: "Type", value: "Green Tea" },
      { label: "Harvest", value: "Early Spring" },
      { label: "Package", value: "50g, 100g, 250g tins" },
      { label: "Shelf Life", value: "18 months" },
    ],
  },
}

// Related products
const relatedProducts = [
  { id: "lysine", name: "L-Lysine HCL", description: "Feed Grade 98.5%", image: "/images/feed-additives.jpg" },
  { id: "threonine", name: "L-Threonine", description: "Feed Grade 98.5%", image: "/images/feed-additives.jpg" },
  { id: "tryptophan", name: "L-Tryptophan", description: "Feed Grade 98%", image: "/images/feed-additives.jpg" },
  { id: "vitamin-a", name: "Vitamin A", description: "1000IU/g", image: "/images/feed-additives.jpg" },
]

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const product = productData[slug] || productData.methionine

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Inquiry submitted – backend integration needed")
  }

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
              <Link href="/products" className="text-[#636E72] hover:text-[#2D6A4F]">Products</Link>
              <ChevronRight className="size-4 text-[#636E72]" />
              <span className="font-medium text-[#2D6A4F]">{product.name}</span>
            </nav>

            <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-[#636E72]">
              {product.category} · {product.description}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Product Header */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#A3B18A] bg-white">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all",
                        selectedImage === idx
                          ? "border-[#2D6A4F]"
                          : "border-[#A3B18A] opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                {product.category}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-[#1B4D3E] lg:text-4xl">{product.name}</h1>
              <p className="mt-2 text-lg text-[#636E72]">{product.description}</p>

              {/* Specs Table */}
              <div className="mt-8 rounded-xl border border-[#A3B18A] bg-white p-6">
                <h3 className="mb-4 font-semibold text-[#1B4D3E]">Product Specifications</h3>
                <div className="space-y-3">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between border-b border-[#A3B18A]/30 pb-2 last:border-0">
                      <span className="text-sm text-[#636E72]">{spec.label}</span>
                      <span className="text-sm font-medium text-[#2D3436]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="mt-6 w-full bg-[#E9B35F] py-6 text-lg font-semibold text-[#1B4D3E] transition-all hover:bg-[#2D6A4F] hover:text-white sm:w-auto sm:px-12"
              >
                Request Quote
              </Button>
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-12 rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
            <h2 className="mb-4 text-xl font-bold text-[#1B4D3E]">Product Description</h2>
            <div className="prose prose-sm max-w-none text-[#636E72]">
              {product.fullDescription.split("\n\n").map((para, idx) => (
                <p key={idx} className="mb-4 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="mt-12 rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
            <h2 className="mb-2 text-xl font-bold text-[#1B4D3E]">Send Inquiry</h2>
            <p className="mb-6 text-sm text-[#636E72]">Interested in this product? Fill out the form below and we&apos;ll get back to you.</p>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#2D3436]">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2D3436]">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#2D3436]">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 w-full resize-none rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                  placeholder="Please describe your requirements..."
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white">
                  Submit Inquiry
                </Button>
              </div>
            </form>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#636E72]">
              <Headphones className="size-4 text-[#2D6A4F]" />
              <span>7x24H Online Support</span>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-[#1B4D3E]">Related Products</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group min-w-[200px] overflow-hidden rounded-xl border border-[#A3B18A] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-[#1B4D3E]">{item.name}</h3>
                    <p className="text-xs text-[#636E72]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
