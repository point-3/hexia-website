"use client"

import { useCallback, useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { SupportedLocale } from "@/lib/i18n"

const STORAGE_KEY = "hexia_lang"

function parseLocale(value: string | null): SupportedLocale | null {
  if (!value) return null
  const normalized = value.toLowerCase()
  if (normalized === "zh" || normalized === "en") return normalized
  return null
}

/**
 * 当前页面语言：优先 URL ?lang=，否则读取 localStorage（上次选择）
 */
export function useLocale(): SupportedLocale {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const paramLang = parseLocale(searchParams.get("lang"))

  const storedLang = useMemo(() => {
    if (typeof window === "undefined") return null
    return parseLocale(localStorage.getItem(STORAGE_KEY))
  }, [paramLang])

  const lang: SupportedLocale = paramLang ?? storedLang ?? "en"

  useEffect(() => {
    if (typeof window === "undefined") return

    if (paramLang) {
      localStorage.setItem(STORAGE_KEY, paramLang)
      return
    }

    const saved = parseLocale(localStorage.getItem(STORAGE_KEY))
    if (!saved) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", saved)
    router.replace(`${pathname}?${params.toString()}`)
  }, [paramLang, pathname, router, searchParams])

  return lang
}

export function useToggleLocale(): () => void {
  const lang = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  return useCallback(() => {
    const nextLang: SupportedLocale = lang === "en" ? "zh" : "en"
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", nextLang)
    localStorage.setItem(STORAGE_KEY, nextLang)
    router.push(`${pathname}?${params.toString()}`)
  }, [lang, pathname, router, searchParams])
}
