"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AboutHeroSection() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('header');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);

    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  return (
    <section className="relative z-10 aspect-[1942/809] w-full overflow-visible">
      <div className="absolute inset-0">
        <Image
          src="/about us banner.png"
          alt="About Hexia"
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
