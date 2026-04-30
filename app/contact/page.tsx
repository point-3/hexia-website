"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Mail, Clock, Building2, Headphones, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    productInterest: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Form submitted – backend integration needed")
  }

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
              <span className="font-medium text-[#2D6A4F]">Contact Us</span>
            </nav>

            <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">Contact Us</h1>
            <p className="mt-2 text-[#636E72]">
              Get in touch with our team for inquiries, quotes, or any questions
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-[#1B4D3E]">Send us a Message</h2>
                <p className="mt-2 text-sm text-[#636E72]">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#2D3436]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#2D3436]">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-[#2D3436]">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="productInterest" className="block text-sm font-medium text-[#2D3436]">
                      Product Interest
                    </label>
                    <input
                      type="text"
                      id="productInterest"
                      value={formData.productInterest}
                      onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="e.g., Methionine, NMN, Biluochun Tea"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#2D3436]">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="mt-2 w-full resize-none rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="Please describe your requirements in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#E9B35F] py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:bg-[#2D6A4F] hover:text-white"
                  >
                    Send Message
                  </Button>
                </form>

                {/* Response time notice */}
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#2D6A4F]/5 p-4">
                  <Clock className="size-5 text-[#2D6A4F]" />
                  <span className="text-sm text-[#2D6A4F] font-medium">We reply within 24 hours</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Suzhou HQ */}
                <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#2D6A4F]">
                      <Building2 className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">Suzhou Headquarters</h3>
                      <p className="text-sm text-[#636E72]">China</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-[#A3B18A]" />
                    <p className="text-[#636E72]">
                      RM205, Building 1-B, HR Service Industrial Park,<br />
                      No. 336 Fengli Street, Suzhou Industrial Park, China
                    </p>
                  </div>
                </div>

                {/* Japan Office */}
                <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#1B4D3E]">
                      <Building2 className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">Japan Office</h3>
                      <p className="text-sm text-[#636E72]">Osaka, Japan</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-[#A3B18A]" />
                    <p className="text-[#636E72]">
                      103-9-1, Hirano Shi, Hirano-Ku,<br />
                      Osaka, Japan
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-[#A3B18A] bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#E9B35F]">
                      <Mail className="size-6 text-[#1B4D3E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">Email</h3>
                      <a
                        href="mailto:sales@hexia.com"
                        className="text-[#2D6A4F] hover:text-[#E9B35F] transition-colors"
                      >
                        sales@hexia.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
                      <Headphones className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">7x24H Online Support</h3>
                      <p className="text-sm text-white/80">We are always here to help</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/70">
                    Our team is available around the clock to assist you with any inquiries, 
                    technical questions, or urgent orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  )
}
