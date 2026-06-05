import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import {
  CMS_REVALIDATE_TAGS,
  DEFAULT_CMS_REVALIDATE_PATHS,
  getCmsRevalidateSeconds,
} from "@/lib/cms-cache"

export const dynamic = "force-dynamic"

type RevalidatePayload = {
  secret?: string
  paths?: unknown
  tags?: unknown
}

function revalidateSecret(): string {
  return process.env.CMS_REVALIDATE_SECRET || process.env.REVALIDATE_SECRET || ""
}

async function readPayload(request: NextRequest): Promise<RevalidatePayload> {
  try {
    return (await request.json()) as RevalidatePayload
  } catch {
    return {}
  }
}

function bearerToken(request: NextRequest): string {
  const authorization = request.headers.get("authorization") || ""
  return authorization.replace(/^Bearer\s+/i, "").trim()
}

function isAuthorized(request: NextRequest, payload: RevalidatePayload): boolean {
  const secret = revalidateSecret()
  if (!secret && process.env.NODE_ENV !== "production") return true

  const candidate =
    request.headers.get("x-revalidate-secret") ||
    bearerToken(request) ||
    request.nextUrl.searchParams.get("secret") ||
    payload.secret ||
    ""

  return Boolean(secret) && candidate === secret
}

function stringList(value: unknown, fallback: readonly string[]): string[] {
  if (!Array.isArray(value)) return [...fallback]
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [item.trim()]
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const path = "path" in item ? String(item.path || "").trim() : ""
      return path ? [path] : []
    }
    return []
  })
}

function revalidatePaths(paths: string[]) {
  return paths.map((path) => {
    const type = path.includes("[") ? "page" : undefined
    revalidatePath(path, type)
    return { path, type: type || null }
  })
}

function revalidateTags(tags: string[]) {
  return tags.map((tag) => {
    revalidateTag(tag, "max")
    return tag
  })
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    revalidateSeconds: getCmsRevalidateSeconds(),
    defaultPaths: DEFAULT_CMS_REVALIDATE_PATHS,
    defaultTags: Object.values(CMS_REVALIDATE_TAGS),
    auth: revalidateSecret() ? "secret-required" : "development-open",
  })
}

export async function POST(request: NextRequest) {
  const payload = await readPayload(request)
  if (!isAuthorized(request, payload)) {
    return NextResponse.json({ ok: false, error: "Unauthorized revalidate request" }, { status: 401 })
  }

  const paths = stringList(payload.paths, DEFAULT_CMS_REVALIDATE_PATHS)
  const tags = stringList(payload.tags, Object.values(CMS_REVALIDATE_TAGS))
  const revalidatedPaths = revalidatePaths(paths)
  const revalidatedTags = revalidateTags(tags)

  return NextResponse.json({
    ok: true,
    revalidatedAt: new Date().toISOString(),
    revalidateSeconds: getCmsRevalidateSeconds(),
    paths: revalidatedPaths,
    tags: revalidatedTags,
  })
}
