"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    image: "/feed.png",
    category: "Food Additives",
    title: "Premium Food Additives",
    subtitle: "Enhance Quality. Ensure Safety. Delight Every Bite.",
  },
  {
    id: 2,
    image: "/food addi.jpg",
    category: "Feed Additives",
    title: "Premium Feed Additives",
    subtitle: "Amino acids, vitamins, minerals for optimal animal nutrition",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

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
    <section className="relative aspect-[1942/809] w-full overflow-visible">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.category}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Slide Controls - Dots */}
      {slides.length >= 2 && (
        <div className="absolute bottom-[60px] left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-[#2D6A4F]"
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
