"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Calendar, ArrowRight, TrendingUp, FileText, Newspaper } from "lucide-react"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { getFileUrl, Article } from "@/lib/directus"
import { getArticles } from "@/lib/api/articles"

const marketReports = [
  { title: "Amino Acid Monthly Report", period: "April 2026" },
  { title: "Vitamin Price Index", period: "April 2026" },
  { title: "Feed Additives Market Overview", period: "Q1 2026" },
]

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const data = await getArticles()
        setArticles(data)
      } catch (err: any) {
        console.error("加载新闻列表失败:", err)
        setError(err.message || "加载新闻列表失败")
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  // 区分推荐文章和普通列表文章
  const featuredNews = articles.find((a) => a.is_featured) || articles[0]
  const newsArticles = articles.filter((a) => a.id !== featuredNews?.id)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {/* Loading / Error state */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#636E72]">
            Loading news articles...
          </div>
        ) : error ? (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-red-500">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 underline text-[#2D6A4F]">
              Click to reload
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 py-24 text-center text-[#636E72]">
            No news articles found.
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredNews && (
              <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="overflow-hidden rounded-2xl border border-[#A3B18A] bg-white shadow-sm">
                    <div className="grid lg:grid-cols-2">
                      <div className="relative aspect-[4/3] lg:aspect-auto">
                        <Image
                          src={getFileUrl(featuredNews.image) || "/images/feed-additives.jpg"}
                          alt={featuredNews.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-[#E9B35F] px-3 py-1 text-sm font-medium text-[#1B4D3E]">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center p-6 lg:p-10">
                        <div className="flex items-center gap-3 text-sm text-[#636E72]">
                          <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-[#2D6A4F]">
                            {featuredNews.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {formatDate(featuredNews.date_published)}
                          </span>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-[#1B4D3E] lg:text-3xl">
                          {featuredNews.title}
                        </h2>
                        <p className="mt-4 text-[#636E72] leading-relaxed">
                          {featuredNews.excerpt}
                        </p>
                        <Link
                          href={`/news/${featuredNews.slug}`}
                          className="mt-6 inline-flex items-center gap-2 font-medium text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                        >
                          Read More
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Main Content */}
            <section className="pb-16 lg:pb-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-3">
                  {/* Articles Grid */}
                  <div className="lg:col-span-2">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-[#1B4D3E]">
                      <Newspaper className="size-5" />
                      Latest Articles
                    </h2>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      {newsArticles.map((article) => (
                        <article
                          key={article.id}
                          className="group rounded-xl border border-[#A3B18A] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-3 text-xs text-[#636E72]">
                              <span className="rounded-full bg-[#2D6A4F]/10 px-2 py-0.5 text-[#2D6A4F]">
                                {article.category}
                              </span>
                              <span>{formatDate(article.date_published)}</span>
                            </div>
                            <h3 className="mt-3 font-semibold text-[#1B4D3E] transition-colors group-hover:text-[#2D6A4F] line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="mt-2 text-sm text-[#636E72] line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>
                          <div className="mt-4">
                            <Link
                              href={`/news/${article.slug}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                            >
                              Read More
                              <ArrowRight className="size-3" />
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Market Reports */}
                    <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                      <h3 className="flex items-center gap-2 font-semibold text-[#1B4D3E]">
                        <TrendingUp className="size-5 text-[#E9B35F]" />
                        Market Reports
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {marketReports.map((report) => (
                          <li key={report.title}>
                            <Link
                              href="#"
                              className="group flex items-center justify-between rounded-lg border border-[#A3B18A]/50 p-3 transition-all hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5"
                            >
                              <div>
                                <div className="font-medium text-[#1B4D3E] text-sm">{report.title}</div>
                                <div className="text-xs text-[#636E72]">{report.period}</div>
                              </div>
                              <FileText className="size-4 text-[#A3B18A] transition-colors group-hover:text-[#2D6A4F]" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* LinkedIn */}
                    <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                      <h3 className="font-semibold text-[#1B4D3E]">Follow Us on LinkedIn</h3>
                      <p className="mt-2 text-sm text-[#636E72]">
                        Stay connected for daily updates on market trends and company news.
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
                        Follow Hexia
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
