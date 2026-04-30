"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Target, Award, GraduationCap, MapPin, Users } from "lucide-react"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"
import { PartnersSection } from "@/components/hexia/partners-section"

// Certifications
const certifications = [
  { name: "HACCP", description: "Hazard Analysis Critical Control Point" },
  { name: "ISO", description: "International Organization for Standardization" },
  { name: "FAMI-QS", description: "Feed Additives and Premixtures Quality System" },
  { name: "FDA", description: "Food and Drug Administration" },
  { name: "GMP", description: "Good Manufacturing Practice" },
]

// Team activities
const teamActivities = [
  { title: "Team Building", image: "/images/hexia-team.jpg" },
  { title: "Annual Meetings", image: "/images/hexia-team.jpg" },
  { title: "Training Programs", image: "/images/hexia-team.jpg" },
]

// Counter component
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0
          const duration = 2000
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {/* Header */}
        <section className="bg-[#2D6A4F]/5 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/" className="text-[#636E72] hover:text-[#2D6A4F]">Home</Link>
              <ChevronRight className="size-4 text-[#636E72]" />
              <span className="font-medium text-[#2D6A4F]">About Us</span>
            </nav>

            <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">About Us</h1>
            <p className="mt-2 text-[#636E72]">
              Learn more about Hexia Biotechnology and our mission
            </p>
          </div>
        </section>

        {/* Company Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] py-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#leaf-pattern)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Hexia (Suzhou) Biotechnology Co., Ltd.
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg text-white/80">
                Established in 2023, headquartered in Suzhou Free Trade Zone, with branches in Japan and Hong Kong. 
                We are dedicated to providing comprehensive solutions for animal nutrition and food ingredients.
              </p>
            </div>
          </div>
        </section>

        {/* Company Introduction */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                  About <span className="text-[#E9B35F]">Hexia</span>
                </h2>
                <div className="mt-6 space-y-4 text-[#636E72] leading-relaxed">
                  <p>
                    Hexia (Suzhou) is a growing trading company focusing on distribution of feed additives and 
                    food ingredients to international markets. Most of our team members have been in this business 
                    for over 10 years, bringing deep industry knowledge and extensive market connections.
                  </p>
                  <p>
                    We specialize in sourcing high-quality amino acids, vitamins, minerals, and specialty ingredients 
                    from certified manufacturers in China, serving customers across Europe, Americas, Southeast Asia, 
                    and beyond.
                  </p>
                  <p>
                    Our commitment to quality, reliability, and customer service has made us a trusted partner for 
                    businesses seeking efficient supply chain solutions in animal and human nutrition.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#2D6A4F] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl"><Counter end={10} suffix="+" /></div>
                  <div className="mt-2 text-sm text-white/80">Years Experience</div>
                </div>
                <div className="rounded-2xl bg-[#1B4D3E] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl"><Counter end={642} suffix="+" /></div>
                  <div className="mt-2 text-sm text-white/80">Global Partners</div>
                </div>
                <div className="rounded-2xl bg-[#1B4D3E] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl"><Counter end={175} suffix="+" /></div>
                  <div className="mt-2 text-sm text-white/80">Countries Served</div>
                </div>
                <div className="rounded-2xl bg-[#2D6A4F] p-6 text-center text-white">
                  <div className="text-3xl font-bold lg:text-4xl">24/7</div>
                  <div className="mt-2 text-sm text-white/80">Online Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#F5F3EF] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#2D6A4F]">
                <Target className="size-8 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">Our Mission</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[#636E72]">
                To become a <span className="font-semibold text-[#2D6A4F]">one-stop solution</span> for your demand 
                in animal and human nutrition, providing reliable sourcing, efficient logistics, and outstanding 
                customer service.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E9B35F]">
                <Award className="size-8 text-[#1B4D3E]" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">Quality Certifications</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                Our partner factories adhere to the highest international quality standards
              </p>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex size-28 flex-col items-center justify-center rounded-2xl border-2 border-[#A3B18A] bg-white p-4 text-center transition-all hover:border-[#2D6A4F] hover:shadow-lg sm:size-32"
                >
                  <span className="text-lg font-bold text-[#2D6A4F]">{cert.name}</span>
                  <span className="mt-1 text-[10px] text-[#636E72] leading-tight">{cert.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bioway Business Academy */}
        <section className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="flex size-16 items-center justify-center rounded-full bg-[#E9B35F]">
                  <GraduationCap className="size-8 text-[#1B4D3E]" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                  Bioway Business Academy
                </h2>
                <p className="mt-4 text-white/80 leading-relaxed">
                  Bioway Business Academy focuses on professional talent cultivation and industry knowledge sharing. 
                  We provide training programs, workshops, and seminars to help our partners and team members stay 
                  ahead of market trends and best practices in animal nutrition and food ingredients.
                </p>
                <ul className="mt-6 space-y-3">
                  {["Professional Training Programs", "Industry Knowledge Sharing", "Market Trend Analysis", "Technical Workshops"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80">
                      <span className="size-2 rounded-full bg-[#E9B35F]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-[#E9B35F]/30">
                <Image
                  src="/images/hexia-team.jpg"
                  alt="Bioway Business Academy"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Japan Office */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#2D6A4F]">
                <MapPin className="size-8 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">Japan Office</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                Our overseas branch in Osaka, Japan serves clients in the Asia-Pacific region
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
                <h3 className="font-semibold text-[#1B4D3E]">Japan Office Address</h3>
                <p className="mt-2 text-[#636E72]">
                  103-9-1, Hirano Shi, Hirano-Ku,<br />
                  Osaka, Japan
                </p>
              </div>
              <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 lg:p-8">
                <h3 className="font-semibold text-[#1B4D3E]">Suzhou HQ Address</h3>
                <p className="mt-2 text-[#636E72]">
                  RM205, Building 1-B, HR Service Industrial Park,<br />
                  No. 336 Fengli Street, Suzhou Industrial Park, China
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <PartnersSection />

        {/* Team Activities */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E9B35F]">
                <Users className="size-8 text-[#1B4D3E]" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#1B4D3E] sm:text-3xl">Team Activities</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                Building a strong team culture through various activities and events
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="group overflow-hidden rounded-2xl border border-[#A3B18A] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B4D3E]/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
