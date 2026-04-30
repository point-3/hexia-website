"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronRight, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { cn } from "@/lib/utils"

// Product categories
const categories = [
  {
    name: "Additives",
    subcategories: [
      {
        name: "Feed Additives",
        items: ["Amino Acids", "Vitamins", "Minerals", "Enzymes", "Premix", "Pigments", "API/Vet Medicine"],
      },
      {
        name: "Food Additives",
        items: ["Thickeners", "Acid Regulators", "Sweeteners"],
      },
    ],
  },
  {
    name: "Nutrition",
    subcategories: [
      { name: "NMN", items: [] },
      { name: "L-EGT", items: [] },
    ],
  },
  {
    name: "Suzhou Specialty",
    subcategories: [
      { name: "Biluochun Tea", items: [] },
      { name: "Biluohong Tea", items: [] },
      { name: "Loquat Series", items: [] },
    ],
  },
]

// Find the parent top-level category name for a given subcategory or item
function findParentCategory(name: string): string | null {
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      if (sub.name === name || sub.items.includes(name)) {
        return cat.name
      }
    }
  }
  return null
}

// Sample products data
const products = [
  { id: "methionine", name: "DL-Methionine", description: "Feed Grade 99%", category: "Amino Acids", image: "/images/feed-additives.jpg" },
  { id: "lysine", name: "L-Lysine HCL", description: "Feed Grade 98.5%", category: "Amino Acids", image: "/images/feed-additives.jpg" },
  { id: "threonine", name: "L-Threonine", description: "Feed Grade 98.5%", category: "Amino Acids", image: "/images/feed-additives.jpg" },
  { id: "tryptophan", name: "L-Tryptophan", description: "Feed Grade 98%", category: "Amino Acids", image: "/images/feed-additives.jpg" },
  { id: "vitamin-a", name: "Vitamin A", description: "1000IU/g", category: "Vitamins", image: "/images/feed-additives.jpg" },
  { id: "vitamin-e", name: "Vitamin E", description: "50% Feed Grade", category: "Vitamins", image: "/images/feed-additives.jpg" },
  { id: "nmn", name: "NMN", description: "Beta-Nicotinamide 99%", category: "NMN", image: "/images/nutritional-products.jpg" },
  { id: "l-egt", name: "L-Ergothioneine", description: "High Purity", category: "L-EGT", image: "/images/nutritional-products.jpg" },
  { id: "biluochun", name: "Biluochun Tea", description: "Premium Green Tea", category: "Biluochun Tea", image: "/images/suzhou-specialty.jpg" },
  { id: "loquat-paste", name: "Loquat Paste", description: "Traditional Recipe", category: "Loquat Series", image: "/images/suzhou-specialty.jpg" },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    const initial = new Set(["Additives"])
    if (categoryFromUrl) {
      const parent = findParentCategory(categoryFromUrl)
      if (parent) initial.add(parent)
    }
    return Array.from(initial)
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Sync URL param changes (e.g. navigating from footer links)
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
      const parent = findParentCategory(categoryFromUrl)
      if (parent) {
        setExpandedCategories((prev) => prev.includes(parent) ? prev : [...prev, parent])
      }
    }
  }, [categoryFromUrl])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  // Resolve selectedCategory to a set of matching product categories
  const getMatchingCategories = (selected: string | null): Set<string> | null => {
    if (!selected) return null
    const matched = new Set<string>()

    for (const cat of categories) {
      // If selected is a top-level category (e.g. "Nutrition", "Suzhou Specialty"), match all leaves
      if (cat.name === selected) {
        for (const sub of cat.subcategories) {
          if (sub.items.length > 0) {
            sub.items.forEach((item) => matched.add(item))
          } else {
            matched.add(sub.name)
          }
        }
        return matched
      }

      for (const sub of cat.subcategories) {
        // If selected is a subcategory with items (e.g. "Feed Additives"), match all its items
        if (sub.name === selected && sub.items.length > 0) {
          sub.items.forEach((item) => matched.add(item))
          return matched
        }
      }
    }
    // Otherwise it's a leaf-level category, match directly
    matched.add(selected)
    return matched
  }

  const matchingCategories = getMatchingCategories(selectedCategory)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !matchingCategories || matchingCategories.has(product.category)
    return matchesSearch && matchesCategory
  })

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
              <span className="font-medium text-[#2D6A4F]">Products</span>
            </nav>

            <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">Our Products</h1>
            <p className="mt-2 text-[#636E72]">
              Browse our comprehensive range of feed additives, food ingredients, and specialty products
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with Search */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>{/* spacer */}</div>
            
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#A3B18A] px-4 py-2 text-sm font-medium text-[#2D6A4F] lg:hidden"
              >
                <Menu className="size-4" />
                Categories
              </button>

              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#636E72]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#A3B18A] bg-white py-2 pl-10 pr-4 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
              </div>
            </div>
          </div>

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
                  All Products
                </button>

                {categories.map((category) => (
                  <div key={category.name} className="mb-2">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[#2D3436] hover:bg-[#2D6A4F]/10"
                    >
                      {category.name}
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          expandedCategories.includes(category.name) && "rotate-180"
                        )}
                      />
                    </button>

                    {expandedCategories.includes(category.name) && (
                      <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#A3B18A] pl-3">
                        {category.subcategories.map((sub) => (
                          <div key={sub.name}>
                            <button
                              onClick={() => setSelectedCategory(sub.name)}
                              className={cn(
                                "w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                                selectedCategory === sub.name
                                  ? "bg-[#E9B35F]/20 text-[#2D6A4F] font-medium"
                                  : "text-[#636E72] hover:text-[#2D6A4F]"
                              )}
                            >
                              {sub.name}
                            </button>
                            {sub.items.length > 0 && (
                              <div className="ml-2 mt-1 space-y-0.5">
                                {sub.items.map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => setSelectedCategory(item)}
                                    className={cn(
                                      "w-full rounded px-2 py-1 text-left text-xs transition-colors",
                                      selectedCategory === item
                                        ? "text-[#2D6A4F] font-medium"
                                        : "text-[#636E72]/80 hover:text-[#2D6A4F]"
                                    )}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
                    All Products
                  </button>

                  {categories.map((category) => (
                    <div key={category.name} className="mb-2">
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[#2D3436] hover:bg-[#2D6A4F]/10"
                      >
                        {category.name}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            expandedCategories.includes(category.name) && "rotate-180"
                          )}
                        />
                      </button>

                      {expandedCategories.includes(category.name) && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#A3B18A] pl-3">
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => {
                                setSelectedCategory(sub.name)
                                setIsSidebarOpen(false)
                              }}
                              className={cn(
                                "w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                                selectedCategory === sub.name
                                  ? "bg-[#E9B35F]/20 text-[#2D6A4F] font-medium"
                                  : "text-[#636E72] hover:text-[#2D6A4F]"
                              )}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {selectedCategory && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-[#636E72]">Filtered by:</span>
                  <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-sm font-medium text-[#2D6A4F]">
                    {selectedCategory}
                  </span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 text-xs text-[#636E72] hover:text-[#2D6A4F]"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group overflow-hidden rounded-xl border border-[#A3B18A] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-[#2D6A4F]">{product.category}</span>
                      <h3 className="mt-1 font-semibold text-[#1B4D3E] group-hover:text-[#2D6A4F]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#636E72]">{product.description}</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-[#E9B35F] text-[#1B4D3E] hover:bg-[#2D6A4F] hover:text-white"
                      >
                        Inquiry
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="rounded-xl border border-[#A3B18A] bg-white p-12 text-center">
                  <p className="text-[#636E72]">No products found matching your criteria.</p>
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
