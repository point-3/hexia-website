"use client"

import { useState, useEffect, use, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { useSiteSettings } from "@/components/hexia/site-config-provider"
import { getFileUrl, Product as DirectusProduct } from "@/lib/directus"
import { getProductBySlugFromCms, getProductsFromCms } from "@/lib/api/cms-client"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"
import { t, getHrefWithLang, getProductTranslation } from "@/lib/i18n"
import { useLocale } from "@/hooks/use-locale"
import { trackInquiryConversion } from "@/lib/marketing-analytics"

function ProductDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = use(params)
  const slug = decodeURIComponent(rawSlug)
  const lang = useLocale()
  const siteSettings = useSiteSettings()

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
          getProductBySlugFromCms(slug),
          getProductsFromCms()
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
      const { product_title: currentTitle } = getProductTranslation(product!, lang)
      await createInquiry({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source_page: `Product Detail [${product?.slug}]: ${currentTitle}`,
        source_product_slug: product?.slug,
        product_interest: currentTitle
      })
      toast.success(t("inquiry.successToast", lang))
      trackInquiryConversion(siteSettings, {
        source: "product_detail_form",
        productSlug: product?.slug,
        language: lang,
      })
      setFormData({ name: "", email: "", message: "" })
    } catch (err: any) {
      console.error(err)
      toast.error(t("inquiry.errorToast", lang))
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
      <div className="min-h-screen bg-[var(--bg-page)]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <div className="text-[var(--text-body)]">{t("products.loading", lang)}</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-[var(--primary-dark)]">
              {lang === "zh" ? "找不到该产品" : "Product not found"}
            </h1>
            <p className="mt-2 text-sm text-red-500">
              {error || (lang === "zh" ? "请求的产品不存在。" : "The requested product does not exist.")}
            </p>
            <Link href={getHrefWithLang("/products", lang)} className="mt-4 inline-block text-[var(--primary)] hover:underline">
              {lang === "zh" ? "返回产品列表" : "Back to products"}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const subcategoryName = typeof product.subcategory_id === "object" ? (lang === "zh" ? product.subcategory_id?.name_cn : product.subcategory_id?.name) : ""
  const categoryName = typeof product.category_id === "object" ? (lang === "zh" ? product.category_id?.name_cn : product.category_id?.name) : ""

  const { product_title: productTitle, product_description: productDesc } = getProductTranslation(product, lang)

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6 lg:py-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link href={getHrefWithLang("/", lang)} className="text-[var(--text-body)] hover:text-[var(--primary)]">
              {t("nav.home", lang)}
            </Link>
            <ChevronRight className="size-4 text-[var(--text-body)]" />
            <Link href={getHrefWithLang("/products", lang)} className="text-[var(--text-body)] hover:text-[var(--primary)]">
              {t("nav.products", lang)}
            </Link>
            <ChevronRight className="size-4 text-[var(--text-body)]" />
            <span className="font-medium text-[var(--primary)]">{productTitle}</span>
          </nav>

          {/* Product Header */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            {/* Image */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <Image
                  src={getFileUrl(product.image) || "/images/feed-additives.jpg"}
                  alt={productTitle}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div>
                <span className="inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]">
                  {subcategoryName || categoryName || (lang === "zh" ? "其他" : "Others")}
                </span>
                <h1 className="mt-3 text-3xl font-bold text-[var(--primary-dark)] lg:text-4xl">
                  {productTitle}
                </h1>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleRequestQuote}
                  size="lg"
                  className="w-full bg-[var(--accent)] py-6 text-lg font-semibold text-[var(--primary-dark)] transition-all hover:bg-[var(--primary)] hover:text-white sm:w-auto sm:px-12"
                >
                  {t("inquiry.formTitle", lang)}
                </Button>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8">
            <h2 className="mb-4 text-xl font-bold text-[var(--primary-dark)]">
              {lang === "zh" ? "产品描述" : "Product Description"}
            </h2>
            <div className="prose prose-sm max-w-none text-[var(--text-body)]">
              <p className="leading-relaxed whitespace-pre-line">{productDesc}</p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div id="inquiry-form" className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8">
            <h2 className="mb-2 text-xl font-bold text-[var(--primary-dark)]">{t("inquiry.title", lang)}</h2>
            <p className="mb-6 text-sm text-[var(--text-body)]">{t("inquiry.subtitle", lang)}</p>

            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-body)]">{t("inquiry.name", lang)}</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-4 py-2.5 text-[var(--text-body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-body)]">{t("inquiry.email", lang)}</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-4 py-2.5 text-[var(--text-body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-body)]">{t("inquiry.message", lang)}</label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-page)] px-4 py-2.5 text-[var(--text-body)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                  placeholder={t("home.placeholderMessage", lang)}
                />
              </div>
              <div className="sm:col-span-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[var(--accent)] text-[var(--primary-dark)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50"
                >
                  {isSubmitting ? t("inquiry.submitting", lang) : t("inquiry.submit", lang)}
                </Button>
              </div>
            </form>

            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-body)]">
              <Headphones className="size-4 text-[var(--primary)]" />
              <span>{t("home.onlineSupport", lang)}</span>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-[var(--primary-dark)]">{t("products.relatedProducts", lang)}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => {
                  const itemSubName = typeof item.subcategory_id === "object" ? (lang === "zh" ? item.subcategory_id?.name_cn : item.subcategory_id?.name) : ""
                  const itemCatName = typeof item.category_id === "object" ? (lang === "zh" ? item.category_id?.name_cn : item.category_id?.name) : ""
                  const { product_title: itemTitle, product_description: itemDesc } = getProductTranslation(item, lang)

                  return (
                    <Link
                      key={item.id}
                      href={getHrefWithLang(`/products/${item.slug}`, lang)}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-muted)]">
                          <Image
                            src={getFileUrl(item.image) || "/images/feed-additives.jpg"}
                            alt={itemTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <span className="text-xs font-medium text-[var(--primary)]">
                            {itemSubName || itemCatName || (lang === "zh" ? "其他" : "Others")}
                          </span>
                          <h3 className="mt-1 flex-1 font-semibold text-[var(--primary-dark)] group-hover:text-[var(--primary)] line-clamp-2">
                            {itemTitle}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--text-body)] line-clamp-2">
                            {itemDesc}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <Button
                          size="sm"
                          className="w-full bg-[var(--accent)] text-[var(--primary-dark)] hover:bg-[var(--primary)] hover:text-white"
                        >
                          {t("products.inquiryButton", lang)}
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

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-[var(--text-body)]">Loading...</div>
      </div>
    }>
      <ProductDetailContent params={params} />
    </Suspense>
  )
}
