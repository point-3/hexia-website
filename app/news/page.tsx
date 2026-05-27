import { getArticles } from "@/lib/api/articles"
import { resolveArticleTranslation, type SupportedLocale } from "@/lib/i18n"
import { NewsListClient } from "./news-list-client"

function parsePageLang(value: string | undefined): SupportedLocale {
  if (!value) return "en"
  const normalized = value.toLowerCase()
  if (normalized === "zh" || normalized === "en") return normalized
  throw new Error(`NewsPage: 不支持的语言参数 "${value}"`)
}

type NewsPageProps = {
  searchParams: Promise<{ lang?: string }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { lang: rawLang } = await searchParams
  const lang = parsePageLang(rawLang)

  const articles = await getArticles()
  const localizedArticles = articles.flatMap((article) => {
    const copy = resolveArticleTranslation(article, lang)
    return copy ? [{ article, copy }] : []
  })

  return <NewsListClient lang={lang} localizedArticles={localizedArticles} />
}
