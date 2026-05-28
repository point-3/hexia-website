"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { getBannerImageUrl, type Banner } from "@/lib/directus"

interface HeroSectionProps {
  banners?: Banner[]
}

const fallbackBannerImages = [
  '/feed.png',
  '/food addi.jpg',
  '/chinese tea.jpg',
]

export function HeroSection({ banners }: HeroSectionProps) {
  const displayBanners = (banners && banners.length > 0) ? banners : null
  const fallbackMode = !displayBanners

  if (!fallbackMode && displayBanners.length === 0) {
    throw new Error("HeroSection: 必须传入有效的 banners 列表且不能为空数组！")
  }

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const totalSlides = fallbackMode ? fallbackBannerImages.length : displayBanners.length

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <section className="relative aspect-[1942/809] w-full overflow-hidden">
      {/* Background Images */}
      {fallbackMode ? (
        fallbackBannerImages.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              key={imageUrl}
              src={imageUrl}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))
      ) : (
        displayBanners.map((slide, index) => {
          const imageUrl = getBannerImageUrl(slide)
          if (!imageUrl) {
            throw new Error(`HeroSection: 轮播图项目 ID ${slide.id} 的背景图 URL 不能为空！`)
          }
          return (
            <div
              key={imageUrl}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                key={imageUrl}
                src={imageUrl}
                alt={`Banner ${slide.id}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          )
        })
      )}



      {/* Slide Controls - Dots */}
      {totalSlides >= 2 && (
        <div className="absolute bottom-[60px] left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-[#2D6A4F] scale-125"
                    : "bg-white/90 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Curve Overlay */}
      <div className="absolute -bottom-[30px] left-0 right-0 z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[60px] w-full"
        >
          <path
            d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z"
            fill="#FDFBF7"
          />
        </svg>
      </div>
    </section>
  )
}
