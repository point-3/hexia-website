import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { SiteConfigProvider } from '@/components/hexia/site-config-provider'
import { MarketingAnalytics } from '@/components/hexia/marketing-analytics'
import { getSiteSettings } from '@/lib/api/site-config'
import { getRawFileUrl } from '@/lib/directus'
import { resolveDefaultMetadata } from '@/lib/seo'
import { createSiteThemeStyle } from '@/lib/site-theme'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()
  const favicon = getRawFileUrl(siteSettings.favicon) || '/images/网站标签 (1).png'

  return {
    ...resolveDefaultMetadata(siteSettings, 'en'),
    generator: 'v0.app',
    icons: {
      icon: [{ url: favicon }],
      apple: favicon || '/apple-icon.png',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-background"
        style={createSiteThemeStyle(siteSettings)}
        suppressHydrationWarning
      >
        <SiteConfigProvider siteSettings={siteSettings}>
          <MarketingAnalytics siteSettings={siteSettings} />
          {children}
          <Toaster />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </SiteConfigProvider>
      </body>
    </html>
  )
}
