"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { getFileUrl, Product as DirectusProduct } from "@/lib/directus"
import { getProductBySlug, getProducts } from "@/lib/api/products"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = use(params)
  const slug = decodeURIComponent(rawSlug)

  const [product, setProduct] = useState<DirectusProduct | null>(null)
  const [allProducts, setAllProducts] = useState<DirectusProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 严格暴露无参数时的逻辑异常
  if (!slug) {
    throw new Error("ProductDetailPage: slug 参数必须提供！")
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const [currentProduct, productsList] = await Promise.all([
          getProductBySlug(slug),
          getProducts()
        ])
        setProduct(currentProduct)
        setAllProducts(productsList)
      } catch (err: any) {
        console.error("加载产品详情失败:", err)
        setError(err.message || "加载产品详情失败")
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [slug])

  // 获取相关产品（相同分类的其它产品，最多 4 个）
  const relatedProducts = allProducts
    .filter((p) => {
      if (!product) return false
      const currentCatId = typeof product.category_id === "object" ? product.category_id?.id : product.category_id
      const pCatId = typeof p.category_id === "object" ? p.category_id?.id : p.category_id
      return p.id !== product.id && pCatId === currentCatId
    })
    .slice(0, 4)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source_page: `Product Detail: ${product?.product_title}`,
        source_product_slug: product?.slug,
        product_interest: product?.product_title
      })
      toast.success("Inquiry submitted successfully! We will contact you soon.")
      setFormData({ name: "", email: "", message: "" })
    } catch (err: any) {
      console.error(err)
      toast.error(`Submission failed: ${err.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestQuote = () => {
    // 自动滑动到询盘表单区域
    const element = document.getElementById("inquiry-form")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-[#1B4D3E]">Product not found</h1>
            <p className="mt-2 text-sm text-red-500">{error || "The requested product does not exist."}</p>
            <Link href="/products" className="mt-4 inline-block text-[#2D6A4F] hover:underline">
              Back to products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const subcategoryName = typeof product.subcategory_id === "object" ? product.subcategory_id?.name : ""
  const categoryName = typeof product.category_id === "object" ? product.category_id?.name : ""

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
            <span className="font-medium text-[#2D6A4F]">{product.product_title}</span>
          </nav>

          {/* Product Header */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#A3B18A] bg-white">
                <Image
                  src={getFileUrl(product.image) || "/images/feed-additives.jpg"}
                  alt={product.product_title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div>
                <span className="inline-block rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                  {subcategoryName || categoryName || "Others"}
                </span>
                <h1 className="mt-3 text-3xl font-bold text-[#1B4D3E] lg:text-4xl">{product.product_title}</h1>
                <p className="mt-2 text-lg text-[#636E72]">{product.product_name}</p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleRequestQuote}
                  size="lg"
                  className="w-full bg-[#E9B35F] py-6 text-lg font-semibold text-[#1B4D3E] transition-all hover:bg-[#2D6A4F] hover:text-white sm:w-auto sm:px-12"
                >
                  Request Quote
                </Button>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-12 rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
            <h2 className="mb-4 text-xl font-bold text-[#1B4D3E]">Product Description</h2>
            <div className="prose prose-sm max-w-none text-[#636E72]">
              <p className="leading-relaxed whitespace-pre-line">{product.product_description}</p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div id="inquiry-form" className="mt-12 rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
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
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
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
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#2D3436]">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-full resize-none rounded-lg border border-[#A3B18A] bg-[#FDFBF7] px-4 py-2.5 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                  placeholder="Please describe your requirements..."
                />
              </div>
              <div className="sm:col-span-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
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
                {relatedProducts.map((item) => {
                  const itemSubName = typeof item.subcategory_id === "object" ? item.subcategory_id?.name : ""
                  const itemCatName = typeof item.category_id === "object" ? item.category_id?.name : ""
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#A3B18A] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F3EF]">
                          <Image
                            src={getFileUrl(item.image) || "/images/feed-additives.jpg"}
                            alt={item.product_title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <span className="text-xs font-medium text-[#2D6A4F]">
                            {itemSubName || itemCatName || "Others"}
                          </span>
                          <h3 className="mt-1 flex-1 font-semibold text-[#1B4D3E] group-hover:text-[#2D6A4F] line-clamp-2">
                            {item.product_title}
                          </h3>
                          <p className="mt-2 text-sm text-[#636E72] line-clamp-2">
                            {item.product_description}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <Button
                          size="sm"
                          className="w-full bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white"
                        >
                          Inquiry
                        </Button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
