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

// Product type definition
type Product = {
  category1?: string
  二级分类?: string
  productname?: string
  imagename?: string
  producttitle?: string
  productdescription?: string
}

// Category type
type Category = {
  name: string
  hasSubcategories: boolean
  subcategories: { name: string; nameEn: string; count: number }[]
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Translate Chinese category to English
  const translateCategory = (chineseName: string | undefined): string => {
    if (!chineseName) return "Others"
    return categoryMap[chineseName] || chineseName
  }

  // Generate unique category key
  const getCategoryKey = (cat1: string, cat2?: string): string => {
    return `${cat1}_${cat2 || ""}`
  }

  // Fetch products data and build categories dynamically
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("开始获取产品数据...")
        const response = await fetch('/data/product.json')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("获取到的数据:", data)
        console.log("数据长度:", data?.length)
        
        if (!Array.isArray(data)) {
          throw new Error("数据格式错误：不是数组")
        }
        
        // Filter out empty products
        const validProducts = data.filter((p: Product) => {
          const hasName = p?.productname && p.productname.trim() !== ""
          return hasName
        })
        console.log("有效产品数量:", validProducts.length)
        setProducts(validProducts)
        
        // Build categories from products data
        // First pass: count products per category combination
        const categoryCountMap = new Map<string, number>()
        validProducts.forEach((product: Product) => {
          const cat1 = product?.category1?.trim() || ""
          const cat2 = product?.["二级分类"]?.trim() || ""
          
          if (cat1) {
            // Count for category1
            const cat1Key = getCategoryKey(cat1)
            categoryCountMap.set(cat1Key, (categoryCountMap.get(cat1Key) || 0) + 1)
            
            // Count for category1 + category2
            if (cat2) {
              const cat2Key = getCategoryKey(cat1, cat2)
              categoryCountMap.set(cat2Key, (categoryCountMap.get(cat2Key) || 0) + 1)
            }
          }
        })

        // Second pass: build category structure
        const categoryMap2 = new Map<string, Set<string>>()
        validProducts.forEach((product: Product) => {
          const cat1 = product?.category1?.trim() || ""
          const cat2 = product?.["二级分类"]?.trim() || ""
          
          if (cat1) {
            if (!categoryMap2.has(cat1)) {
              categoryMap2.set(cat1, new Set())
            }
            // Only add non-empty subcategories
            if (cat2) {
              categoryMap2.get(cat1)!.add(cat2)
            }
          }
        })

        console.log("生成的类目Map:", categoryMap2)

        const builtCategories: Category[] = []
        categoryMap2.forEach((subcategories, categoryName) => {
          const subcatsArray = Array.from(subcategories)
          builtCategories.push({
            name: categoryName, // Use original category1 value directly
            hasSubcategories: subcatsArray.length > 0,
            subcategories: subcatsArray.map(sub => ({
              name: sub,
              nameEn: translateCategory(sub),
              count: categoryCountMap.get(getCategoryKey(categoryName, sub)) || 0
            }))
          })
        })
        
        console.log("最终类目结构:", builtCategories)
        setCategories(builtCategories)
        // Auto-expand categories that have subcategories
        setExpandedCategories(builtCategories.filter(c => c.hasSubcategories).map(c => c.name))
        
      } catch (error) {
        console.error("请求错误:", error)
        setError(`加载失败: ${error instanceof Error ? error.message : '未知错误'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggleCategory = (category: string) => {
    const categoryData = categories.find(c => c.name === category)
    if (!categoryData?.hasSubcategories) {
      // No subcategories - click to select
      setSelectedCategory(getCategoryKey(category))
      return
    }
    
    // Has subcategories - toggle expand/collapse
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const toggleSubcategory = (categoryName: string, subcategoryName: string) => {
    const key = getCategoryKey(categoryName, subcategoryName)
    setSelectedCategory(selectedCategory === key ? null : key)
  }

  const filteredProducts = products.filter((product) => {
    if (!product?.category1) return false
    
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      (product?.producttitle?.toLowerCase().includes(searchLower) || false) ||
      (product?.productdescription?.toLowerCase().includes(searchLower) || false) ||
      (product?.productname?.toLowerCase().includes(searchLower) || false)
    
    if (!selectedCategory) {
      return matchesSearch
    }
    
    // Check if selectedCategory matches this product
    const cat1 = product.category1.trim()
    const cat2 = product["二级分类"]?.trim() || ""
    
    // Selected category could be: "cat1_" (no subcategory) or "cat1_cat2"
    const productCat1Key = getCategoryKey(cat1)
    const productCat2Key = getCategoryKey(cat1, cat2)
    
    const matchesCategory = selectedCategory === productCat1Key || selectedCategory === productCat2Key
    
    return matchesSearch && matchesCategory
  })

  // Generate product ID from productname
  const generateProductId = (product: Product, index: number): string => {
    const name = product?.productname || `product-${index}`
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
  }

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
                Categories
              </button>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#636E72]" />
                <input
                  type="text"
                  placeholder="Search products..."
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
                点击刷新重试
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-28 rounded-xl border border-[#A3B18A] bg-white p-4">
                <h2 className="mb-4 font-semibold text-[#1B4D3E]">Categories</h2>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    !selectedCategory ? "bg-[#2D6A4F] text-white" : "text-[#636E72] hover:bg-[#2D6A4F]/10"
                  )}
                >
                  All Products ({products.length})
                </button>

                {categories.length === 0 && !loading && (
                  <p className="text-sm text-[#636E72]">暂无类目数据</p>
                )}

                {categories.map((category) => {
                  const cat1Key = getCategoryKey(category.name)
                  const isCat1Selected = selectedCategory === cat1Key
                  
                  if (!category.hasSubcategories) {
                    // No subcategories - single clickable button
                    return (
                      <button
                        key={category.name}
                        onClick={() => toggleCategory(category.name)}
                        className={cn(
                          "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                          isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                        )}
                      >
                        {category.name}
                      </button>
                    )
                  }

                  // Has subcategories - expandable menu
                  return (
                    <div key={category.name} className="mb-2">
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                        )}
                      >
                        {category.name}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            expandedCategories.includes(category.name) && "rotate-180"
                          )}
                        />
                      </button>

                      {expandedCategories.includes(category.name) && category.subcategories.length > 0 && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#A3B18A] pl-3">
                          {category.subcategories.map((sub) => {
                            const subKey = getCategoryKey(category.name, sub.name)
                            const isSubSelected = selectedCategory === subKey
                            
                            return (
                              <button
                                key={sub.name}
                                onClick={() => toggleSubcategory(category.name, sub.name)}
                                className={cn(
                                  "w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                                  isSubSelected
                                    ? "bg-[#E9B35F]/20 text-[#2D6A4F] font-medium"
                                    : "text-[#636E72] hover:text-[#2D6A4F]"
                                )}
                              >
                                {sub.nameEn} ({sub.count})
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
                    <h2 className="font-semibold text-[#1B4D3E]">Categories</h2>
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
                    All Products ({products.length})
                  </button>
                  {categories.map((category) => {
                    const cat1Key = getCategoryKey(category.name)
                    const isCat1Selected = selectedCategory === cat1Key
                    
                    if (!category.hasSubcategories) {
                      return (
                        <button
                          key={category.name}
                          onClick={() => {
                            toggleCategory(category.name)
                            setIsSidebarOpen(false)
                          }}
                          className={cn(
                            "mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                            isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                          )}
                        >
                          {category.name}
                        </button>
                      )
                    }

                    return (
                      <div key={category.name} className="mb-2">
                        <button
                          onClick={() => toggleCategory(category.name)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isCat1Selected ? "bg-[#2D6A4F] text-white" : "text-[#2D3436] hover:bg-[#2D6A4F]/10"
                          )}
                        >
                          {category.name}
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform",
                              expandedCategories.includes(category.name) && "rotate-180"
                            )}
                          />
                        </button>
                        {expandedCategories.includes(category.name) && category.subcategories.length > 0 && (
                          <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#A3B18A] pl-3">
                            {category.subcategories.map((sub) => {
                              const subKey = getCategoryKey(category.name, sub.name)
                              const isSubSelected = selectedCategory === subKey
                              
                              return (
                                <button
                                  key={sub.name}
                                  onClick={() => {
                                    toggleSubcategory(category.name, sub.name)
                                    setIsSidebarOpen(false)
                                  }}
                                  className={cn(
                                    "w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                                    isSubSelected
                                      ? "bg-[#E9B35F]/20 text-[#2D6A4F] font-medium"
                                      : "text-[#636E72] hover:text-[#2D6A4F]"
                                  )}
                                >
                                  {sub.nameEn} ({sub.count})
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
                  <span className="text-sm text-[#636E72]">Filtered by:</span>
                  <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                    {selectedCategory.replace('_', ' > ')}
                  </span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 text-xs text-[#636E72] hover:text-[#2D6A4F]"
                  >
                    Clear
                  </button>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-[#636E72]">Loading products...</div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-[#A3B18A] bg-white p-12 text-center">
                  <p className="text-[#636E72]">No products found matching your criteria.</p>
                  <p className="mt-2 text-sm text-[#636E72]">Total products: {products.length}</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <Link
                      key={index}
                      href={`/products/${encodeURIComponent(generateProductId(product, index))}?name=${encodeURIComponent(product?.productname || "")}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-[#A3B18A] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
                        <Image
                          src={`/images/${product?.imagename || 'feed-additives.jpg'}`}
                          alt={product?.producttitle || 'Product'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/feed-additives.jpg'
                          }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-3 sm:p-4">
                        <span className="text-xs font-medium text-[#2D6A4F]">
                          {translateCategory(product?.["二级分类"]) || product?.category1 || "Others"}
                        </span>
                        <h3 className="mt-1 flex-1 font-semibold text-sm text-[#1B4D3E] group-hover:text-[#2D6A4F] line-clamp-2">
                          {product?.producttitle || "Untitled Product"}
                        </h3>
                        <p className="mt-1 text-xs text-[#636E72] line-clamp-2 sm:text-sm">
                          {product?.productdescription || ""}
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
    <Suspense>
      <ProductsContent />
    </Suspense>
  )
}
