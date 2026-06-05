import Script from "next/script"
import type { SiteSettings } from "@/lib/directus"
import {
  getMarketingAnalyticsConfig,
  shouldLoadMarketingAnalytics,
} from "@/lib/marketing-analytics"

export function MarketingAnalytics({ siteSettings }: { siteSettings: SiteSettings }) {
  if (!shouldLoadMarketingAnalytics(siteSettings)) return null

  const config = getMarketingAnalyticsConfig(siteSettings)

  return (
    <>
      {config.gtmId ? (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${config.gtmId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${config.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      ) : null}

      {config.ga4MeasurementId ? (
        <>
          <Script
            id="google-analytics-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.ga4MeasurementId}');
            `}
          </Script>
        </>
      ) : null}
    </>
  )
}
