import { type NextRequest } from 'next/server'
import { getDirectusUrl } from '@/lib/directus'

/** GET 路由默认会被 Next 缓存；轮播换图必须每次向 Directus 拉最新字节 */
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * 代理 Directus 静态资源，避免 /assets/{id} 默认 30 天浏览器缓存导致后台换图后前台不更新。
 * 查询参数 `v` 仅用于前台缓存破坏，不会转发给 Directus。
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!id) {
    return new Response('缺少资源 id', { status: 400 })
  }

  const upstreamParams = new URLSearchParams(request.nextUrl.searchParams)
  upstreamParams.delete('v')
  const query = upstreamParams.toString()
  const upstreamUrl = `${getDirectusUrl()}/assets/${id}${query ? `?${query}` : ''}`

  const upstream = await fetch(upstreamUrl, {
    cache: 'no-store',
    next: { revalidate: 0 },
  })
  if (!upstream.ok) {
    return new Response(upstream.statusText, { status: upstream.status })
  }

  const headers = new Headers()
  const contentType = upstream.headers.get('content-type')
  if (contentType) {
    headers.set('Content-Type', contentType)
  }
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  headers.set('Pragma', 'no-cache')

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  })
}
