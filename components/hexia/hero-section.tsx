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
    image: "/images/feed-additives.jpg",
    category: "Feed Additives",
    title: "Premium Feed Additives",
    subtitle: "Amino acids, vitamins, minerals for optimal animal nutrition",
  },
  {
    id: 2,
    image: "/images/food-additives.jpg",
    category: "Food Additives",
    title: "Quality Food Ingredients",
    subtitle: "Thickeners, sweeteners, and acid regulators for food industry",
  },
  {
    id: 3,
    image: "/images/nutritional-products.jpg",
    category: "Nutrition & Specialty",
    title: "Nutritional Products",
    subtitle: "NMN, L-EGT and premium Suzhou specialty products",
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
    <section className="relative min-h-screen overflow-hidden">
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
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E]/95 via-[#2D6A4F]/80 to-[#2D6A4F]/60" />
        </div>
      ))}

      {/* Tea Leaf Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="tea-pattern"
              x="0"
              y="0"
              width="150"
              height="150"
              patternUnits="userSpaceOnUse"
            >
              <path d="M30 40 Q40 20 50 40 Q40 50 30 40" fill="white" opacity="0.3" />
              <path d="M100 30 Q110 15 120 30 Q110 38 100 30" fill="white" opacity="0.2" />
              <path d="M70 90 Q85 70 100 90 Q85 100 70 90" fill="white" opacity="0.25" />
              <circle cx="60" cy="50" r="2" fill="white" opacity="0.3" />
              <circle cx="90" cy="70" r="1.5" fill="white" opacity="0.2" />
              <line x1="60" y1="50" x2="90" y2="70" stroke="white" strokeWidth="0.5" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tea-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Category Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E9B35F]/30 bg-[#E9B35F]/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-[#E9B35F] animate-pulse" />
            <span className="text-sm font-medium text-[#E9B35F]">
              {slides[currentSlide].category}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Your Reliable Partner in Animal Nutrition & Food Ingredients
          </h1>

          <p className="mt-6 text-pretty text-base text-white/80 sm:text-lg md:text-xl">
            Comprehensive solutions for global sourcing and supply chain management.
          </p>

          {/* Slide Subtitle */}
          <p className="mt-3 text-white/60 text-sm sm:text-base">
            {slides[currentSlide].subtitle}
          </p>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium text-white/70 sm:gap-6">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E9B35F]" />
              10+ Years Experience
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E9B35F]" />
              One-Stop Sourcing
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E9B35F]" />
              Global Logistics
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[#E9B35F] px-8 py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:scale-105 hover:bg-[#D4A04A]"
            >
              Get a Quote
            </Button>
            <a href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent px-8 py-6 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                Explore Products
              </Button>
            </a>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-32 left-4 right-4 flex items-center justify-between sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          {/* Dots Indicator */}
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? "h-3 w-10 rounded-full bg-[#E9B35F]"
                    : "size-3 rounded-full bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                prevSlide()
                setIsAutoPlaying(false)
                setTimeout(() => setIsAutoPlaying(true), 5000)
              }}
              className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:size-12"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => {
                nextSlide()
                setIsAutoPlaying(false)
                setTimeout(() => setIsAutoPlaying(true), 5000)
              }}
              className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:size-12"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="absolute bottom-8 left-4 right-4 flex flex-col items-center gap-4 sm:flex-row sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          <span className="text-xs font-medium uppercase tracking-widest text-white/50">
            Certified By
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.label}
                className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 transition-all duration-300 hover:border-[#E9B35F]/50 hover:bg-white/10 hover:text-white sm:size-14"
              >
                <span className="text-[10px] font-bold sm:text-xs">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z"
            fill="#FDFBF7"
          />
        </svg>
      </div>
    </section>
  )
}
