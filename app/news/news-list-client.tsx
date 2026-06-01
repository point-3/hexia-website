"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, TrendingUp, FileText, Newspaper } from "lucide-react"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { getFileUrl, Article } from "@/lib/directus"
import { t, getHrefWithLang, type ArticleCopy, type SupportedLocale } from "@/lib/i18n"

export type LocalizedArticle = { article: Article; copy: ArticleCopy }

type NewsListClientProps = {
  lang: SupportedLocale
  localizedArticles: LocalizedArticle[]
}

export function NewsListClient({ lang, localizedArticles }: NewsListClientProps) {
  const marketReports =
    lang === "zh"
      ? [
          { title: "氨基酸月度市场报告", period: "2026年4月" },
          { title: "维生素价格指数", period: "2026年4月" },
          { title: "饲料添加剂市场行情概述", period: "2026年第一季度" },
        ]
      : [
          { title: "Amino Acid Monthly Report", period: "April 2026" },
          { title: "Vitamin Price Index", period: "April 2026" },
          { title: "Feed Additives Market Overview", period: "Q1 2026" },
        ]

  const featuredEntry =
    localizedArticles.find(({ article }) => article.is_featured) ?? localizedArticles[0]
  const featuredNews = featuredEntry?.article
  const featuredCopy = featuredEntry?.copy
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
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-20 lg:pt-24">
          <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[#636E72]">
            {lang === "zh" ? "暂无新闻文章。" : "No news articles found."}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {featuredNews && featuredCopy ? (
          <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-[#A3B18A] bg-white shadow-sm">
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-[4/3] lg:aspect-auto">
                    <Image
                      src={getFileUrl(featuredNews.image) || "/images/feed-additives.jpg"}
                      alt={featuredCopy.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-[#E9B35F] px-3 py-1 text-sm font-medium text-[#1B4D3E]">
                        {t("news.featured", lang)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:p-10">
                    <div className="flex items-center gap-3 text-sm text-[#636E72]">
                      {featuredCopy.category ? (
                        <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-[#2D6A4F]">
                          {featuredCopy.category}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(featuredNews.date_published)}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-[#1B4D3E] lg:text-3xl">{featuredCopy.title}</h2>
                    <p className="mt-4 leading-relaxed text-[#636E72]">{featuredCopy.excerpt}</p>
                    <Link
                      href={getHrefWithLang(`/news/${featuredNews.slug}`, lang)}
                      className="mt-6 inline-flex items-center gap-2 font-medium text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
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
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#1B4D3E]">
                  <Newspaper className="size-5" />
                  {t("news.latest", lang)}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {newsArticles.map(({ article, copy }) => (
                    <article
                      key={article.id}
                      className="group flex flex-col justify-between rounded-xl border border-[#A3B18A] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div>
                        <div className="flex items-center gap-3 text-xs text-[#636E72]">
                          {copy.category ? (
                            <span className="rounded-full bg-[#2D6A4F]/10 px-2 py-0.5 text-[#2D6A4F]">
                              {copy.category}
                            </span>
                          ) : null}
                          <span>{formatDate(article.date_published)}</span>
                        </div>
                        <h3 className="mt-3 line-clamp-2 font-semibold text-[#1B4D3E] transition-colors group-hover:text-[#2D6A4F]">
                          {copy.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[#636E72]">{copy.excerpt}</p>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={getHrefWithLang(`/news/${article.slug}`, lang)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                        >
                          {t("news.readMore", lang)}
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-[#1B4D3E]">
                    <TrendingUp className="size-5 text-[#E9B35F]" />
                    {lang === "zh" ? "市场行情分析" : "Market Reports"}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {marketReports.map((report) => (
                      <li key={report.title}>
                        <Link
                          href="#"
                          className="group flex items-center justify-between rounded-lg border border-[#A3B18A]/50 p-3 transition-all hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5"
                        >
                          <div>
                            <div className="text-sm font-medium text-[#1B4D3E]">{report.title}</div>
                            <div className="text-xs text-[#636E72]">{report.period}</div>
                          </div>
                          <FileText className="size-4 text-[#A3B18A] transition-colors group-hover:text-[#2D6A4F]" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                  <h3 className="font-semibold text-[#1B4D3E]">
                    {lang === "zh" ? "关注我们的 LinkedIn" : "Follow Us on LinkedIn"}
                  </h3>
                  <p className="mt-2 text-sm text-[#636E72]">
                    {lang === "zh"
                      ? "随时获取最新的市场行情趋势和公司动态。"
                      : "Stay connected for daily updates on market trends and company news."}
                  </p>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0077B5] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    {lang === "zh" ? "关注和夏" : "Follow Hexia"}
                  </a>
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
