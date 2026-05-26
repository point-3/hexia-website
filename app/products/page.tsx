"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { cn } from "@/lib/utils"
import { getFileUrl, Product as DirectusProduct } from "@/lib/directus"
import { getProducts, getCategories, getSubcategories } from "@/lib/api/products"
import { t, getHrefWithLang } from "@/lib/i18n"

// 对应页面分类菜单的数据结构
type MenuCategory = {
  id: number
  name: string
  name_cn: string
  hasSubcategories: boolean
  subcategories: { id: number; name: string; name_cn: string; count: number }[]
}

type SelectedCategoryType = {
  type: "category" | "subcategory"
  id: number
  name: string
} | null

function ProductsContent() {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"
  const categoryFromUrl = searchParams.get("category") // 从首页跳转可能会有 category 参数 (如 "Feed Additives")

  const [products, setProducts] = useState<DirectusProduct[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取产品、分类和二级分类数据并构建类目菜单结构
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [rawProducts, rawCategories, rawSubcategories] = await Promise.all([
          getProducts(),
          getCategories(),
          getSubcategories(),
        ])

        setProducts(rawProducts)

        // 构造层级类目菜单结构，并统计对应产品数量
        const builtCategories: MenuCategory[] = rawCategories.map((cat) => {
          const subs = rawSubcategories.filter((sub) => {
            const catId = typeof sub.category_id === "object" ? sub.category_id.id : sub.category_id
            return catId === cat.id
          })

          const subcategoriesWithCount = subs.map((sub) => {
            const count = rawProducts.filter((prod) => {
              const subId = typeof prod.subcategory_id === "object" ? prod.subcategory_id?.id : prod.subcategory_id
              return subId === sub.id
            }).length

            return {
              id: sub.id,
              name: sub.name,
              name_cn: sub.name_cn,
              count,
            }
          })

          return {
            id: cat.id,
            name: cat.name,
            name_cn: cat.name_cn,
            hasSubcategories: subcategoriesWithCount.length > 0,
            subcategories: subcategoriesWithCount,
          }
        })

        setCategories(builtCategories)
        setExpandedCategories(builtCategories.filter((c) => c.hasSubcategories).map((c) => String(c.id)))

        // 如果 URL 中有 category 参数，匹配并选中对应分类
        if (categoryFromUrl) {
          const matchedCat = builtCategories.find(
            (c) => c.name.toLowerCase() === categoryFromUrl.toLowerCase() ||
                   c.name_cn.toLowerCase() === categoryFromUrl.toLowerCase()
          )
          if (matchedCat) {
            setSelectedCategory({
              type: "category",
              id: matchedCat.id,
              name: lang === "zh" ? matchedCat.name_cn : matchedCat.name,
            })
          }
        }
      } catch (err: any) {
        console.error("加载产品数据失败:", err)
        setError(`加载失败: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryFromUrl, lang])

  const toggleCategory = (category: MenuCategory) => {
    if (!category.hasSubcategories) {
      setSelectedCategory({ type: "category", id: category.id, name: lang === "zh" ? category.name_cn : category.name })
      return
    }
    setExpandedCategories((prev) =>
      prev.includes(String(category.id))
        ? prev.filter((id) => id !== String(category.id))
        : [...prev, String(category.id)]
    )
  }

  const toggleSubcategory = (category: MenuCategory, sub: MenuCategory["subcategories"][number]) => {
    if (selectedCategory?.type === "subcategory" && selectedCategory.id === sub.id) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory({
        type: "subcategory",
        id: sub.id,
        name: lang === "zh" ? `${category.name_cn} > ${sub.name_cn}` : `${category.name} > ${sub.name}`,
      })
    }
  }

  // 过滤产品
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      product.product_title.toLowerCase().includes(searchLower) ||
      product.product_name.toLowerCase().includes(searchLower) ||
      (product.product_description?.toLowerCase().includes(searchLower) ?? false)

    if (!selectedCategory) {
      return matchesSearch
    }

    if (selectedCategory.type === "category") {
      const catId = typeof product.category_id === "object" ? product.category_id?.id : product.category_id
      return matchesSearch && catId === selectedCategory.id
    } else {
      const subId = typeof product.subcategory_id === "object" ? product.subcategory_id?.id : product.subcategory_id
      return matchesSearch && subId === selectedCategory.id
    }
  })

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with Search */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#A3B18A] px-4 py-2 text-sm font-medium text-[#2D6A4F] lg:hidden"
              >
                <Menu className="size-4" />
                {t("products.categories", lang)}
              </button>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#636E72]" />
                <input
                  type="text"
                  placeholder={t("products.search", lang)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#A3B18A] bg-white py-2 pl-10 pr-4 text-sm text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-700">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline"
              >
                {lang === "zh" ? "点击刷新重试" : "Click to refresh and retry"}
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-28 rounded-xl border border-[#A3B18A] bg-white p-4">
                <h2 className="mb-4 font-semibold text-[#1B4D3E]">{t("products.categories", lang)}</h2>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    !selectedCategory ? "bg-[#2D6A4F] text-white" : "text-[#636E72] hover:bg-[#2D6A4F]/10"
                  )}
                >
                  {t("products.all", lang)} ({products.length})
                </button>

                {categories.length === 0 && !loading && (
                  <p className="text-sm text-[#636E72]">{t("products.noCategories", lang)}</p>
                )}

                {categories.map((category) => {
                  const isCat1Selected = selectedCategory?.type === "category" && selectedCategory.id === category.id
                  const categoryName = lang === "zh" ? category.name_cn : category.name

                  if (!category.hasSubcategories) {
                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category)}
                        className={cn(
                          "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                          isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                        )}
                      >
                        {categoryName}
                      </button>
                    )
                  }

                  return (
                    <div key={category.id} className="mb-2">
                      <button
                        onClick={() => toggleCategory(category)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                        )}
                      >
                        {categoryName}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            expandedCategories.includes(String(category.id)) && "rotate-180"
                          )}
                        />
                      </button>

                      {expandedCategories.includes(String(category.id)) && category.subcategories.length > 0 && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#A3B18A] pl-3">
                          {category.subcategories.map((sub) => {
                            const isSubSelected = selectedCategory?.type === "subcategory" && selectedCategory.id === sub.id
                            const subName = lang === "zh" ? sub.name_cn : sub.name

                            return (
                              <button
                                key={sub.id}
                                onClick={() => toggleSubcategory(category, sub)}
                                className={cn(
                                  "w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                                  isSubSelected
                                    ? "bg-[#E9B35F]/20 text-[#2D6A4F] font-medium"
                                    : "text-[#636E72] hover:text-[#2D6A4F]"
                                )}
                              >
                                {subName} ({sub.count})
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </aside>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
                <div className="absolute left-0 top-0 h-full w-72 bg-white p-4 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-[#1B4D3E]">{t("products.categories", lang)}</h2>
                    <button onClick={() => setIsSidebarOpen(false)}>
                      <X className="size-5 text-[#636E72]" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setIsSidebarOpen(false)
                    }}
                    className={cn(
                      "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                      !selectedCategory ? "bg-[#2D6A4F] text-white" : "text-[#636E72] hover:bg-[#2D6A4F]/10"
                    )}
                  >
                    {t("products.all", lang)} ({products.length})
                  </button>
                  {categories.map((category) => {
                    const isCat1Selected = selectedCategory?.type === "category" && selectedCategory.id === category.id
                    const categoryName = lang === "zh" ? category.name_cn : category.name

                    if (!category.hasSubcategories) {
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            toggleCategory(category)
                            setIsSidebarOpen(false)
                          }}
                          className={cn(
                            "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                            isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                          )}
                        >
                          {categoryName}
                        </button>
                      )
                    }

                    return (
                      <div key={category.id} className="mb-2">
                        <button
                          onClick={() => toggleCategory(category)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                          )}
                        >
                          {categoryName}
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform",
                              expandedCategories.includes(String(category.id)) && "rotate-180"
                            )}
                          />
                        </button>
                        {expandedCategories.includes(String(category.id)) && category.subcategories.length > 0 && (
                          <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#A3B18A] pl-3">
                            {category.subcategories.map((sub) => {
                              const isSubSelected = selectedCategory?.type === "subcategory" && selectedCategory.id === sub.id
                              const subName = lang === "zh" ? sub.name_cn : sub.name

                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    toggleSubcategory(category, sub)
                                    setIsSidebarOpen(false)
                                  }}
                                  className={cn(
                                    "w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                                    isSubSelected
                                      ? "bg-[#E9B35F]/20 text-[#2D6A4F] font-medium"
                                      : "text-[#636E72] hover:text-[#2D6A4F]"
                                  )}
                                >
                                  {subName} ({sub.count})
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {selectedCategory && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-[#636E72]">{t("products.filterBy", lang)}:</span>
                  <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                    {selectedCategory.name}
                  </span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 text-xs text-[#636E72] hover:text-[#2D6A4F]"
                  >
                    {t("products.clear", lang)}
                  </button>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-[#636E72]">{t("products.loading", lang)}</div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-[#A3B18A] bg-white p-12 text-center">
                  <p className="text-[#636E72]">{t("products.noProducts", lang)}</p>
                  <p className="mt-2 text-sm text-[#636E72]">{t("products.totalProducts", lang)}: {products.length}</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const subName = typeof product.subcategory_id === "object" ? (lang === "zh" ? product.subcategory_id?.name_cn : product.subcategory_id?.name) : ""
                    const catName = typeof product.category_id === "object" ? (lang === "zh" ? product.category_id?.name_cn : product.category_id?.name) : ""
                    const productTitle = lang === "zh" ? product.product_name : product.product_title

                    return (
                      <Link
                        key={product.id}
                        href={getHrefWithLang(`/products/${product.slug}`, lang)}
                        className="group overflow-hidden rounded-xl border border-[#A3B18A] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
                            <Image
                              src={getFileUrl(product.image) || "/images/feed-additives.jpg"}
                              alt={productTitle}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <span className="text-xs font-medium text-[#2D6A4F]">
                              {subName || catName || (lang === "zh" ? "其他" : "Others")}
                            </span>
                            <h3 className="mt-1 font-semibold text-[#1B4D3E] group-hover:text-[#2D6A4F] line-clamp-2">
                              {productTitle}
                            </h3>
                            <p className="mt-1 text-sm text-[#636E72] line-clamp-2">
                              {product.product_description || ""}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 pt-0">
                          <Button
                            size="sm"
                            className="w-full bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white"
                          >
                            {t("products.inquiryButton", lang)}
                          </Button>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-[#636E72]">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
