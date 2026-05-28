"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  {
    title: "Feed Additives",
    image: "/images/feed1.jpg",
    items: ["Amino Acids", "Vitamins", "Minerals"],
  },
  {
    title: "Food Additives",
    image: "/images/food1.jpg",
    items: ["Sweeteners", "Preservatives", "Colorants"],
  },
  {
    title: "Nutritional Products",
    image: "/images/nutri.jpg",
    items: ["NMN", "L-EGT", "Functional Ingredients"],
  },
  {
    title: "Nutri. Ingredients",
    image: "/images/nutri (2).png",
    items: ["Nutraceutical Ingredients"],
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="bg-[#FDFBF7] py-20 lg:py-28">
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
          {products.map((product, index) => (
            <a
              key={index}
              href="/products"
              className={`group relative overflow-hidden p-4 transition-all duration-300 hover:shadow-xl bg-white`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EF]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-[var(--hexia-forest-dark)]">
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="mt-1 text-sm text-[#636E72]">{product.subtitle}</p>
                )}
                <div className="mt-3 space-y-2">
                  {product.items.map((item) => (
                    <div key={item} className="flex items-center text-sm text-[#636E72]">
                      <span className="mr-2 w-1.5 h-1.5 rounded-full bg-[#E9B35F]"></span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-[#2D6A4F] group-hover:text-[var(--hexia-forest)] transition-colors">
                  Learn More
                  <ArrowRight className="ml-1 size-4" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-[var(--hexia-forest)] bg-white text-[var(--hexia-forest)] transition-all duration-300 hover:bg-[var(--hexia-forest)] hover:text-white"
          >
            <a href="/products">
              View All Products
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
