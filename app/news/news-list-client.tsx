"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Newspaper } from "lucide-react"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { ImagePlaceholder } from "@/components/hexia/image-placeholder"
import { getFileUrl, Article } from "@/lib/directus"
import { t, getHrefWithLang, type ArticleCopy, type SupportedLocale } from "@/lib/i18n"

export type LocalizedArticle = { article: Article; copy: ArticleCopy }

type NewsListClientProps = {
  lang: SupportedLocale
  localizedArticles: LocalizedArticle[]
}

export function NewsListClient({ lang, localizedArticles }: NewsListClientProps) {
  const featuredEntry =
    localizedArticles.find(({ article }) => article.is_featured) ?? localizedArticles[0]
  const featuredNews = featuredEntry?.article
  const featuredCopy = featuredEntry?.copy
  const featuredImageSrc = getFileUrl(featuredNews?.image)
  const newsArticles = localizedArticles.filter(({ article }) => article.id !== featuredNews?.id)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (localizedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)]">
        <Navbar />
        <main className="pt-20 lg:pt-24">
          <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[var(--text-body)]">
            {lang === "zh" ? "暂无新闻文章。" : "No news articles found."}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {featuredNews && featuredCopy ? (
          <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-[4/3] lg:aspect-auto">
                    {featuredImageSrc ? (
                      <Image
                        src={featuredImageSrc}
                        alt={featuredCopy.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder label={featuredCopy.title} />
                    )}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary-dark)]">
                        {t("news.featured", lang)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:p-10">
                    <div className="flex items-center gap-3 text-sm text-[var(--text-body)]">
                      {featuredCopy.category ? (
                        <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[var(--primary)]">
                          {featuredCopy.category}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(featuredNews.date_published)}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-[var(--primary-dark)] lg:text-3xl">{featuredCopy.title}</h2>
                    <p className="mt-4 leading-relaxed text-[var(--text-body)]">{featuredCopy.excerpt}</p>
                    <Link
                      href={getHrefWithLang(`/news/${featuredNews.slug}`, lang)}
                      className="mt-6 inline-flex items-center gap-2 font-medium text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
                    >
                      {t("news.readMore", lang)}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="pb-16 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--primary-dark)]">
                  <Newspaper className="size-5" />
                  {t("news.latest", lang)}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {newsArticles.map(({ article, copy }) => (
                    <article
                      key={article.id}
                      className="group flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-body)]">
                          {copy.category ? (
                            <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[var(--primary)]">
                              {copy.category}
                            </span>
                          ) : null}
                          <span>{formatDate(article.date_published)}</span>
                        </div>
                        <h3 className="mt-3 line-clamp-2 font-semibold text-[var(--primary-dark)] transition-colors group-hover:text-[var(--primary)]">
                          {copy.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--text-body)]">{copy.excerpt}</p>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={getHrefWithLang(`/news/${article.slug}`, lang)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
                        >
                          {t("news.readMore", lang)}
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
