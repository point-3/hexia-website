"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"

// Chinese to English category translation dictionary
const categoryMap: Record<string, string> = {
  "氨基酸": "Amino Acids",
  "维生素": "Vitamins",
  "矿物质": "Minerals",
  "酶制剂": "Enzymes",
  "预混料": "Premixes",
  "色素": "Pigments",
  "API、兽药": "APIs & Veterinary Drugs",
  "甜味剂": "Sweeteners",
  "防腐剂": "Preservatives",
  "增稠剂": "Thickeners",
  "酸度调节剂": "Acidity Regulators",
  "着色剂": "Colorants",
  "营养品添加剂": "Nutraceutical Ingredients",
}

type Product = {
  category1?: string
  二级分类?: string
  productname?: string
  imagename?: string
  producttitle?: string
  productdescription?: string
}

// Translate Chinese category to English
const translateCategory = (chineseName: string | undefined): string => {
  if (!chineseName) return "Others"
  return categoryMap[chineseName] || chineseName
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const productName = searchParams?.get("name")
  
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/product.json')
        if (response.ok) {
          const data = await response.json()
          const validProducts = data.filter((p: Product) => p.productname && p.productname.trim() !== "")
          setAllProducts(validProducts)

          // Find product by name or slug
          const slug = params?.slug || ""
          const currentProduct = validProducts.find((p: Product) => 
            p.productname === productName ||
            p.productname?.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') === slug
          )
          setProduct(currentProduct || validProducts[0])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params?.slug, productName])

  const relatedProducts = allProducts.filter((p) =>
    p.productname !== product?.productname && p.category1 === product?.category1
  ).slice(0, 4)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Inquiry submitted – backend integration needed")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <div className="text-[#636E72]">Loading product...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-[#1B4D3E]">Product not found</h1>
            <Link href="/products" className="mt-4 inline-block text-[#2D6A4F] hover:underline">
              Back to products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#636E72] hover:text-[#2D6A4F]">Home</Link>
            <ChevronRight className="size-4 text-[#636E72]" />
            <Link href="/products" className="text-[#636E72] hover:text-[#2D6A4F]">Products</Link>
            <ChevronRight className="size-4 text-[#636E72]" />
            <span className="font-medium text-[#2D6A4F]">{product.producttitle}</span>
          </nav>

          {/* Product Header */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#A3B18A] bg-white">
                <Image
                  src={`/images/${product.imagename}`}
                  alt={product.producttitle}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/feed-additives.jpg'
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                {translateCategory(product["二级分类"]) || product.category1}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-[#1B4D3E] lg:text-4xl">{product.producttitle}</h1>
              <p className="mt-2 text-lg text-[#636E72]">{product.productname}</p>

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
              <p className="leading-relaxed whitespace-pre-line">{product.productdescription}</p>
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
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-[#1B4D3E]">Related Products</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item, index) => (
                  <Link
                    key={index}
                    href={`/products/${encodeURIComponent(item.productname?.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') || `product-${index}`)}?name=${encodeURIComponent(item.productname || "")}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#A3B18A] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F3EF]">
                      <Image
                        src={`/images/${item.imagename}`}
                        alt={item.producttitle}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/feed-additives.jpg'
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <span className="text-xs font-medium text-[#2D6A4F]">
                        {translateCategory(item["二级分类"]) || item.category1}
                      </span>
                      <h3 className="mt-1 flex-1 font-semibold text-[#1B4D3E] group-hover:text-[#2D6A4F] line-clamp-2">
                        {item.producttitle}
                      </h3>
                      <p className="mt-2 text-sm text-[#636E72] line-clamp-2">
                        {item.productdescription}
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 w-full bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white"
                      >
                        Inquiry
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
