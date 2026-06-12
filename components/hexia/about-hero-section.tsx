"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { PageSection } from "@/lib/directus";
import { getFileUrl } from "@/lib/directus";
import {
  getSectionConfig,
  getSectionTranslation,
  localizedText,
  themeColor,
} from "@/lib/page-section-content";
import { sectionTitleWithSuffix } from "@/lib/section-title";

export function AboutHeroSection({ section }: { section?: PageSection | null }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";
  const translation = getSectionTranslation(section, lang);
  const config = getSectionConfig(section, lang);
  const title = translation?.title || localizedText(config.title, lang);
  const subtitle = translation?.subtitle || localizedText(config.subtitle || config.description, lang);
  const configuredImage = section?.image || localizedText(config.image, lang);
  const imageSrc = getFileUrl(configuredImage, {
    width: 1920,
    quality: 85,
    format: "webp",
  });
  const displayImageSrc = imageSrc || (title || subtitle ? "" : "/about us banner.png");
  const backgroundColor = themeColor(section?.background_color || localizedText(config.background_color, lang), "var(--bg-page)");
  const textColor = themeColor(section?.text_color || localizedText(config.text_color, lang), "var(--primary-dark)");
  const imageAlt = title || localizedText(config.alt, lang) || "About Us";

  return (
    <section className="relative z-10 aspect-[1942/809] w-full overflow-visible" style={{ backgroundColor }}>
      {displayImageSrc ? (
        <div className="absolute inset-0">
          <Image
            src={displayImageSrc}
            alt={imageAlt}
            width={1920}
            height={400}
            className="h-full w-full object-cover object-top"
            priority
          />
        </div>
      ) : (
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center" style={{ color: textColor }}>
          <div className="mx-auto max-w-3xl">
            {title ? <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{sectionTitleWithSuffix(section, title, lang)}</h1> : null}
            {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-80 sm:text-lg">{subtitle}</p> : null}
          </div>
        </div>
      )}

      {/* 底部曲线 SVG - 轻微覆盖 banner */}
      <div className="absolute -bottom-[10px] left-0 z-20 w-full pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="h-[60px] w-full"
        >
          <path d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z" fill="var(--bg-page)" />
        </svg>
      </div>
    </section>
  );
}
