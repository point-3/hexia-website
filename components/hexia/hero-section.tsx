"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { getFileUrl } from "@/lib/directus"

export interface Banner {
  id: number
  image: any
  category?: string
  title: string
  subtitle?: string
}

interface HeroSectionProps {
  banners: Banner[]
}

export function HeroSection({ banners }: HeroSectionProps) {
  // 严格执行禁止兜底原则：若参数不存在或为空数组，直接报错暴露问题
  if (!banners || banners.length === 0) {
    throw new Error("HeroSection: 必须传入有效的 banners 列表且不能为空数组！")
  }

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }, [banners.length])

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
      {banners.map((slide, index) => {
        const imageUrl = getFileUrl(slide.image)
        if (!imageUrl) {
          throw new Error(`HeroSection: 轮播图项目 ID ${slide.id} 的背景图 URL 不能为空！`)
        }
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={imageUrl}
              alt={slide.category || "Banner"}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        )
      })}



      {/* Slide Controls - Dots */}
      {banners.length >= 2 && (
        <div className="absolute bottom-[60px] left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-3">
            {banners.map((_, index) => (
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
