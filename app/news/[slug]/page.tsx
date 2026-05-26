"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Calendar, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { getFileUrl, Article } from "@/lib/directus"
import { getArticleBySlug, getArticles } from "@/lib/api/articles"
import { toast } from "sonner"

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = use(params)
  const slug = decodeURIComponent(rawSlug)

  const [article, setArticle] = useState<Article | null>(null)
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 严格暴露无参数时的逻辑异常，禁止任何兜底
  if (!slug) {
    throw new Error("NewsDetailPage: slug 参数必须提供！")
  }

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        setLoading(true)
        const [currentArticle, allArticles] = await Promise.all([
          getArticleBySlug(slug),
          getArticles()
        ])
        setArticle(currentArticle)
        
        // 过滤当前文章，获得最近的新闻列表 (最多 5 篇)
        const filteredRecent = allArticles
          .filter((a) => a.id !== currentArticle.id)
          .slice(0, 5)
        setRecentArticles(filteredRecent)
      } catch (err: any) {
        console.error("加载新闻详情失败:", err)
        setError(err.message || "加载新闻详情失败")
      } finally {
        setLoading(false)
      }
    }

    fetchArticleDetails()
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((err) => console.log("Share failed:", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <div className="text-[#636E72]">Loading article...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="pt-32 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-[#1B4D3E]">Article not found</h1>
            <p className="mt-2 text-sm text-red-500">{error || "The requested article does not exist."}</p>
            <Link href="/news" className="mt-4 inline-block text-[#2D6A4F] hover:underline">
              Back to news
            </Link>
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#636E72] hover:text-[#2D6A4F]">Home</Link>
            <ChevronRight className="size-4 text-[#636E72]" />
            <Link href="/news" className="text-[#636E72] hover:text-[#2D6A4F]">News</Link>
            <ChevronRight className="size-4 text-[#636E72]" />
            <span className="max-w-xs truncate font-medium text-[#2D6A4F] md:max-w-md">
              {article.title}
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <article className="rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-10">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#636E72]">
                  <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-[#2D6A4F] font-medium">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {formatDate(article.date_published)}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight text-[#1B4D3E] lg:text-4xl">
                  {article.title}
                </h1>

                {/* Share Button */}
                <div className="mt-4 flex justify-end border-b border-[#A3B18A]/30 pb-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-[#636E72] hover:text-[#2D6A4F] transition-colors"
                  >
                    <Share2 className="size-4" />
                    Share
                  </button>
                </div>

                {/* Banner Image */}
                {article.image && (
                  <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-xl bg-[#F5F3EF]">
                    <Image
                      src={getFileUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Body Content */}
                <div 
                  className="prose prose-sm max-w-none mt-8 text-[#2D3436] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />

                {/* Footer Back Button */}
                <div className="mt-10 border-t border-[#A3B18A]/30 pt-6">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                  >
                    <ArrowLeft className="size-4" />
                    Back to News
                  </Link>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Articles */}
              {recentArticles.length > 0 && (
                <div className="rounded-xl border border-[#A3B18A] bg-white p-6">
                  <h3 className="font-semibold text-[#1B4D3E]">Recent Articles</h3>
                  <ul className="mt-4 space-y-4">
                    {recentArticles.map((item) => (
                      <li key={item.id} className="border-b border-[#A3B18A]/20 pb-3 last:border-0 last:pb-0">
                        <Link href={`/news/${item.slug}`} className="group block">
                          <span className="text-xs text-[#636E72]">{formatDate(item.date_published)}</span>
                          <h4 className="mt-1 font-medium text-[#1B4D3E] transition-colors group-hover:text-[#2D6A4F] line-clamp-2 text-sm">
                            {item.title}
                          </h4>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Card */}
              <div className="rounded-xl border border-[#A3B18A] bg-[#2D6A4F] p-6 text-white">
                <h3 className="text-lg font-bold">Need Help?</h3>
                <p className="mt-2 text-sm text-white/80">
                  Contact our sales and technical support teams for assistance with documentation, samples, or quotes.
                </p>
                <Link href="/contact" className="mt-4 inline-block">
                  <Button className="bg-[#E9B35F] text-[#1B4D3E] hover:bg-white hover:text-[#2D6A4F]">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
