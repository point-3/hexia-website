"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Calendar, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { getFileUrl, Article } from "@/lib/directus"
import { toast } from "sonner"
import { t, getHrefWithLang, type ArticleCopy, type SupportedLocale } from "@/lib/i18n"

export type RecentArticleEntry = { article: Article; copy: ArticleCopy }

type ArticleDetailClientProps = {
  article: Article
  copy: ArticleCopy
  recentArticles: RecentArticleEntry[]
  lang: SupportedLocale
}

export function ArticleDetailClient({
  article,
  copy,
  recentArticles,
  lang,
}: ArticleDetailClientProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: copy.title,
          text: copy.excerpt,
          url: window.location.href,
        })
        .then(() => toast.success(lang === "zh" ? "分享成功！" : "Shared successfully!"))
        .catch((err) => console.log("Share failed:", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(lang === "zh" ? "链接已复制到剪贴板！" : "Link copied to clipboard!")
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <Link href={getHrefWithLang("/", lang)} className="text-[var(--text-body)] hover:text-[var(--primary)]">
              {t("nav.home", lang)}
            </Link>
            <ChevronRight className="size-4 text-[var(--text-body)]" />
            <Link href={getHrefWithLang("/news", lang)} className="text-[var(--text-body)] hover:text-[var(--primary)]">
              {t("nav.news", lang)}
            </Link>
            <ChevronRight className="size-4 text-[var(--text-body)]" />
            <span className="max-w-xs truncate font-medium text-[var(--primary)] md:max-w-md">{copy.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-10">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-body)]">
                  {copy.category ? (
                    <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 font-medium text-[var(--primary)]">
                      {copy.category}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {formatDate(article.date_published)}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight text-[var(--primary-dark)] lg:text-4xl">{copy.title}</h1>

                <div className="mt-4 flex justify-end border-b border-[var(--border)]/30 pb-4">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-[var(--text-body)] transition-colors hover:text-[var(--primary)]"
                  >
                    <Share2 className="size-4" />
                    {lang === "zh" ? "分享" : "Share"}
                  </button>
                </div>

                {article.image ? (
                  <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-xl bg-[var(--bg-muted)]">
                    <Image
                      src={getFileUrl(article.image)}
                      alt={copy.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div
                  className="prose prose-sm mt-8 max-w-none leading-relaxed text-[var(--text-body)]"
                  dangerouslySetInnerHTML={{ __html: copy.content || "" }}
                />

                <div className="mt-10 border-t border-[var(--border)]/30 pt-6">
                  <Link
                    href={getHrefWithLang("/news", lang)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
                  >
                    <ArrowLeft className="size-4" />
                    {lang === "zh" ? "返回新闻中心" : "Back to News"}
                  </Link>
                </div>
              </article>
            </div>

            <div className="space-y-6">
              {recentArticles.length > 0 ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
                  <h3 className="font-semibold text-[var(--primary-dark)]">
                    {lang === "zh" ? "最新动态" : "Recent Articles"}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {recentArticles.map(({ article: item, copy: itemCopy }) => (
                      <li key={item.id} className="border-b border-[var(--border)]/20 pb-3 last:border-0 last:pb-0">
                        <Link
                          href={getHrefWithLang(`/news/${item.slug}`, lang)}
                          className="group block"
                        >
                          <span className="text-xs text-[var(--text-body)]">{formatDate(item.date_published)}</span>
                          <h4 className="mt-1 line-clamp-2 text-sm font-medium text-[var(--primary-dark)] transition-colors group-hover:text-[var(--primary)]">
                            {itemCopy.title}
                          </h4>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-xl border border-[var(--border)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)]">
                <h3 className="text-lg font-bold text-[var(--primary-foreground)]">{lang === "zh" ? "需要帮助？" : "Need Help?"}</h3>
                <p className="mt-2 text-sm text-[var(--primary-foreground)]/80">
                  {lang === "zh"
                    ? "联系我们的销售与技术支持团队，获取文件、样品或报价帮助。"
                    : "Contact our sales and technical support teams for assistance with documentation, samples, or quotes."}
                </p>
                <Link href={getHrefWithLang("/contact", lang)} className="mt-4 inline-block">
                  <Button className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)]">
                    {t("nav.contact", lang)}
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
