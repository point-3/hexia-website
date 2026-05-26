"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFileUrl, Category, Subcategory } from "@/lib/directus"

interface ProductsSectionProps {
  categories: Category[]
  subcategories: Subcategory[]
}

export function ProductsSection({ categories, subcategories }: ProductsSectionProps) {
  // 严格执行禁止兜底原则：若必需的数据参数为空或未定义，则直接报错退出
  if (!categories || categories.length === 0) {
    throw new Error("ProductsSection: 缺少必须的 categories 数据或为空！")
  }
  if (!subcategories) {
    throw new Error("ProductsSection: 缺少必须的 subcategories 数据！")
  }

  // 整理数据，为每个一级分类分配其所属的前 3 个二级分类
  const displayProducts = categories.map((category) => {
    const matchedSubs = subcategories
      .filter((sub) => {
        const catId = typeof sub.category_id === "object" ? sub.category_id.id : sub.category_id
        return catId === category.id
      })
      .slice(0, 3)
      .map((sub) => sub.name)

    return {
      id: category.id,
      title: category.name,
      titleCn: category.name_cn,
      image: getFileUrl(category.image),
      items: matchedSubs,
    }
  })

  return (
    <section id="products" className="bg-[#F5F3EF] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--hexia-forest-dark)] sm:text-4xl">
            Our Core <span className="text-[var(--hexia-gold)]">Products</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#636E72]">
            Premium feed additives, food ingredients, and nutrition solutions for global markets.
          </p>
        </div>

        {/* Product Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                {product.image && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E5E5E5]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--hexia-forest-dark)]/60 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--hexia-forest-dark)]">
                    {product.title}
                  </h3>
                  <p className="text-sm text-[#636E72]">{product.titleCn}</p>

                  <ul className="mt-3 space-y-1.5">
                    {product.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-[#636E72]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--hexia-gold)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href="/products"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--hexia-forest)] transition-colors hover:text-[var(--hexia-gold)]"
                >
                  Learn More
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a href="/products">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[var(--hexia-forest)] text-[var(--hexia-forest)] transition-all duration-300 hover:bg-[var(--hexia-forest)] hover:text-white"
            >
              View All Products
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
