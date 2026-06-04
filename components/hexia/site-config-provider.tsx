"use client"

import { createContext, useContext } from "react"
import type { SiteSettings } from "@/lib/directus"
import { DEFAULT_SITE_SETTINGS } from "@/lib/api/site-config"

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS)

export function SiteConfigProvider({
  siteSettings,
  children,
}: {
  siteSettings: SiteSettings
  children: React.ReactNode
}) {
  return (
    <SiteSettingsContext.Provider value={siteSettings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
