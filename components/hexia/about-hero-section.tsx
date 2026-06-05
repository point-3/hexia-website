"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { PageSection } from "@/lib/directus";
import { getFileUrl } from "@/lib/directus";
import {
  getSectionConfig,
  getSectionTranslation,
  localizedText,
} from "@/lib/page-section-content";

export function AboutHeroSection({ section }: { section?: PageSection | null }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";
  const translation = getSectionTranslation(section, lang);
  const config = getSectionConfig(section, lang);
  const imageSrc = getFileUrl(section?.image || localizedText(config.image, lang), {
    width: 1920,
    quality: 85,
    format: "webp",
  }) || "/about us banner.png";
  const backgroundColor = section?.background_color || localizedText(config.background_color, lang) || "#FDFBF7";
  const imageAlt = translation?.title || localizedText(config.alt || config.title, lang) || "About Hexia";

  return (
    <section className="relative z-10 aspect-[1942/809] w-full overflow-visible" style={{ backgroundColor }}>
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1920}
          height={400}
          className="h-full w-full object-cover object-top"
          priority
        />
      </div>

      {/* 底部曲线 SVG - 轻微覆盖 banner */}
      <div className="absolute -bottom-[10px] left-0 z-20 w-full pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="h-[60px] w-full"
        >
          <path d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z" fill="#FDFBF7" />
        </svg>
      </div>
    </section>
  );
}
