"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  {
    title: "Feed Additives",
    titleCn: "饲料添加剂",
    image: "/images/feed-additives.jpg",
    items: ["Amino Acids", "Vitamins", "Minerals"],
  },
  {
    title: "Food Additives",
    titleCn: "食品添加剂",
    image: "/images/food-additives.jpg",
    items: ["Sweeteners", "Preservatives", "Colorants"],
  },
  {
    title: "Nutritional Products",
    titleCn: "营养品",
    image: "/images/nutritional-products.jpg",
    items: ["NMN", "L-EGT", "Functional Ingredients"],
  },
  {
    title: "Suzhou Specialty",
    titleCn: "苏州特产",
    image: "/images/suzhou-specialty.jpg",
    items: ["Biluochun Tea", "Loquat Flower Tea", "Loquat Paste"],
  },
]

export function ProductsSection() {
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

        {/* Product Cards - 4 columns */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.title}
              className="group overflow-hidden rounded-2xl border border-[var(--hexia-sage)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--hexia-forest-dark)]/60 to-transparent" />
              </div>

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

                <a
                  href="/products"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--hexia-forest)] transition-colors hover:text-[var(--hexia-gold)]"
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
