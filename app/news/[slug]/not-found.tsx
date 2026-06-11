import Link from "next/link"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"

export default function NewsArticleNotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />
      <main className="pt-32 lg:pt-36">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">404</h1>
          <p className="mt-2 text-[var(--text-body)]">该语言版本的文章不存在或尚未发布。</p>
          <Link href="/news" className="mt-6 inline-block text-[var(--primary)] hover:underline">
            返回新闻列表
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
