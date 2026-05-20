"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const certifications = [
  { label: "HACCP" },
  { label: "ISO" },
  { label: "FAMI-QS" },
]

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
  {
    id: 3,
    image: "/chinese tea.jpg",
    category: "Chinese Specialty",
    title: "Chinese Specialty",
    subtitle: "Premium Biluochun tea and specialty products",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <section className="relative h-[800px]">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.category}
            width={1920}
            height={800}
            className="w-full h-auto block"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative">
        {/* Slide Controls */}
        <div className="absolute bottom-20 right-4 z-10 sm:right-6 lg:right-8">
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? "h-3 w-8 rounded-full bg-[#E9B35F]"
                    : "size-3 rounded-full bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Curve Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z"
              fill="#FDFBF7"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
