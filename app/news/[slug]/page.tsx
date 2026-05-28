import { notFound } from "next/navigation"
import { getArticleBySlug, getArticles } from "@/lib/api/articles"
import { resolveArticleTranslation, type SupportedLocale } from "@/lib/i18n"
import { ArticleDetailClient } from "./article-detail-client"

function parsePageLang(value: string | undefined): SupportedLocale {
  if (!value) return "en"
  const normalized = value.toLowerCase()
  if (normalized === "zh" || normalized === "en") return normalized
  throw new Error(`NewsDetailPage: 不支持的语言参数 "${value}"`)
}

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function NewsDetailPage({ params, searchParams }: NewsDetailPageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  if (!slug) {
    throw new Error("NewsDetailPage: slug 参数必须提供！")
  }

  const { lang: rawLang } = await searchParams
  const lang = parsePageLang(rawLang)

  let article
  try {
    article = await getArticleBySlug(slug)
  } catch {
    notFound()
  }

  const copy = resolveArticleTranslation(article, lang)
  if (!copy) {
    notFound()
  }

  const allArticles = await getArticles()
  const recentArticles = allArticles
    .filter((a) => a.id !== article.id)
    .flatMap((a) => {
      const itemCopy = resolveArticleTranslation(a, lang)
      return itemCopy ? [{ article: a, copy: itemCopy }] : []
    })
    .slice(0, 5)

  return (
    <ArticleDetailClient
      article={article}
      copy={copy}
      recentArticles={recentArticles}
      lang={lang}
    />
  )
}
