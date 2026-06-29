"use client"

import Image from "next/image"
import { ArrowRight, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFileUrl, Category, Subcategory, type PageSection } from "@/lib/directus"
import { useSearchParams } from "next/navigation"
import { t, getHrefWithLang } from "@/lib/i18n"
import { getSectionConfig, getSectionTranslation, localizedText } from "@/lib/page-section-content"
import { sectionTitleWithSuffix } from "@/lib/section-title"

interface ProductsSectionProps {
  section?: PageSection | null
  categories?: Category[]
  subcategories?: Subcategory[]
}

type ProductPreviewItem = {
  id: string | number
  title: string
  image?: string
  items: string[]
}

function balancedProductRows(products: ProductPreviewItem[]): ProductPreviewItem[][] {
  if (products.length === 0) return []

  const maxColumns = 5
  const rowCount = Math.ceil(products.length / maxColumns)
  if (rowCount <= 1) return [products]

  const baseSize = Math.floor(products.length / rowCount)
  const remainder = products.length % rowCount
  const rows: ProductPreviewItem[][] = []
  let cursor = 0

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowSize = baseSize + (rowIndex < remainder ? 1 : 0)
    rows.push(products.slice(cursor, cursor + rowSize))
    cursor += rowSize
  }

  return rows
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

export function ProductsSection({ section, categories, subcategories }: ProductsSectionProps) {
  const searchParams = useSearchParams()
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en"
  const translation = getSectionTranslation(section, lang)
  const config = getSectionConfig(section, lang)
  const title = translation?.title || localizedText(config.title, lang) || t("home.coreProducts", lang)
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang)

  const displayProducts: ProductPreviewItem[] = categories && categories.length > 0 && subcategories
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
          items: matchedSubs,
        }
      })
    : []
  const productRows = balancedProductRows(displayProducts)

  if (displayProducts.length === 0) return null

  return (
    <section id="products" className="bg-[var(--bg-page)] py-20 lg:py-28">
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary-dark)] sm:text-4xl">
            {sectionTitleWithSuffix(section, title, lang)}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-[var(--text-body)]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-16 space-y-6">
          {productRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-6 lg:flex-nowrap">
              {row.map((product) => (
                <a
                  key={product.id}
                  href={getHrefWithLang("/products", lang)}
                  className="group relative w-full overflow-hidden bg-[var(--bg-card)] p-4 transition-all duration-300 hover:shadow-xl sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_6rem)/5)] lg:max-w-[18rem]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-muted)]">
                    <ProductPreviewImage src={product.image} title={product.title} />
                    {product.image ? <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-dark)]/60 to-transparent" /> : null}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-base font-semibold text-[var(--primary-dark)]">
                      {product.title}
                    </h3>
                    {product.items.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {product.items.map((item) => (
                        <div key={item} className="flex items-center text-sm text-[var(--text-body)]">
                          <span className="mr-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          {item}
                        </div>
                      ))}
                    </div>
                    ) : null}
                    <div className="mt-4 flex items-center text-sm font-medium text-[var(--primary)] transition-colors group-hover:text-[var(--primary-dark)]">
                      {t("home.learnMore", lang)}
                      <ArrowRight className="ml-1 size-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-[var(--primary-dark)] bg-[var(--bg-card)] text-[var(--primary-dark)] transition-all duration-300 hover:bg-[var(--primary-dark)] hover:text-white"
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
