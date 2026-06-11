"use client"

import Image from "next/image"
import { ArrowRight, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFileUrl, Category, Subcategory } from "@/lib/directus"
import { useSearchParams } from "next/navigation"
import { t, getHrefWithLang } from "@/lib/i18n"

interface ProductsSectionProps {
  categories?: Category[]
  subcategories?: Subcategory[]
}

function ProductPreviewImage({ src, title }: { src?: string; title: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={title}
        fill
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--bg-muted)] px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--primary)] shadow-sm">
        <PackageOpen className="size-7" strokeWidth={1.7} />
      </div>
      <span className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-[var(--text-body)]">
        {title}
      </span>
    </div>
  )
}

export function ProductsSection({ categories, subcategories }: ProductsSectionProps) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") || "en"

  const fallbackProducts = [
    {
      id: "1",
      title: lang === "zh" ? "饲料添加剂" : "Feed Additives",
      image: undefined,
      items: lang === "zh" ? ["氨基酸", "维生素", "矿物质"] : ["Amino Acids", "Vitamins", "Minerals"],
    },
    {
      id: "2",
      title: lang === "zh" ? "食品添加剂" : "Food Additives",
      image: undefined,
      items: lang === "zh" ? ["甜味剂", "防腐剂", "着色剂"] : ["Sweeteners", "Preservatives", "Colorants"],
    },
    {
      id: "3",
      title: lang === "zh" ? "营养产品" : "Nutritional Products",
      image: undefined,
      items: lang === "zh" ? ["NMN", "L-EGT", "功能成分"] : ["NMN", "L-EGT", "Functional Ingredients"],
    },
    {
      id: "4",
      title: lang === "zh" ? "营养成分" : "Nutri. Ingredients",
      image: undefined,
      items: lang === "zh" ? ["营养保健品成分"] : ["Nutraceutical Ingredients"],
    },
  ]

  const displayProducts = categories && categories.length > 0 && subcategories
    ? categories.map((category) => {
        const matchedSubs = subcategories
          .filter((sub) => {
            const catId = typeof sub.category_id === "object" ? sub.category_id.id : sub.category_id
            return catId === category.id
          })
          .slice(0, 3)
          .map((sub) => (lang === "zh" ? sub.name_cn : sub.name))

        return {
          id: category.id,
          title: lang === "zh" ? category.name_cn : category.name,
          image: category.image ? getFileUrl(category.image) : undefined,
          items: matchedSubs.length > 0 ? matchedSubs : ["..."],
        }
      })
    : fallbackProducts

  return (
    <section id="products" className="bg-[var(--bg-page)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--hexia-forest-dark)] sm:text-4xl">
            {lang === "zh" ? (
              <>
                我们的核心 <span className="text-[var(--hexia-gold)]">产品</span>
              </>
            ) : (
              <>
                Our Core <span className="text-[var(--hexia-gold)]">Products</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[var(--text-body)]">
            {t("home.coreDesc", lang)}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <a
              key={product.id}
              href={getHrefWithLang("/products", lang)}
              className="group relative overflow-hidden p-4 transition-all duration-300 hover:shadow-xl bg-[var(--bg-card)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-muted)]">
                <ProductPreviewImage src={product.image} title={product.title} />
                {product.image ? <div className="absolute inset-0 bg-gradient-to-t from-[var(--hexia-forest-dark)]/60 to-transparent" /> : null}
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-[var(--hexia-forest-dark)]">
                  {product.title}
                </h3>
                <div className="mt-3 space-y-2">
                  {product.items.map((item) => (
                    <div key={item} className="flex items-center text-sm text-[var(--text-body)]">
                      <span className="mr-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-[var(--primary)] group-hover:text-[var(--hexia-forest)] transition-colors">
                  {t("home.learnMore", lang)}
                  <ArrowRight className="ml-1 size-4" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-[var(--hexia-forest)] bg-[var(--bg-card)] text-[var(--hexia-forest)] transition-all duration-300 hover:bg-[var(--hexia-forest)] hover:text-white"
          >
            <a href={getHrefWithLang("/products", lang)}>
              {t("home.viewAll", lang)}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
