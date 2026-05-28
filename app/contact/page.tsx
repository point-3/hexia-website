"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Mail, Clock, Building2, Headphones, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    productInterest: "",
    quantity: "",
    message: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Success Message Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="max-w-sm w-full rounded-xl bg-[#2D6A4F]/20 px-6 py-5 text-center backdrop-blur-sm">
            <p className="text-base font-medium text-[#2D6A4F]">
              Thank you for your inquiry! We will contact you as soon as possible within 24 hours.
            </p>
          </div>
        </div>
      )}

      <Navbar />

      <main className="pt-20 lg:pt-24">
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
                <h2 className="text-lg font-bold text-[#1B4D3E] sm:text-xl">Send us a Message</h2>
                <p className="mt-1 text-xs text-[#636E72] sm:text-sm">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-[#2D3436] sm:text-sm">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-[#2D3436] sm:text-sm">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="country" className="block text-xs font-medium text-[#2D3436] sm:text-sm">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                        placeholder="Your country"
                      />
                    </div>
                    <div>
                      <label htmlFor="productInterest" className="block text-xs font-medium text-[#2D3436] sm:text-sm">
                        Interested Product
                      </label>
                      <input
                        type="text"
                        id="productInterest"
                        value={formData.productInterest}
                        onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                        placeholder="Product name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-xs font-medium text-[#2D3436] sm:text-sm">
                      Quantity
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-[#2D3436] sm:text-sm">
                      Message / Requirement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="mt-1 w-full resize-none rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                      placeholder="Please describe your requirements in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#E9B35F] py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:bg-[#2D6A4F] hover:text-white"
                  >
                    Send Inquiry
                  </Button>
                </form>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#2D6A4F]/5 p-3">
                  <Clock className="size-4 text-[#2D6A4F]" />
                  <span className="text-xs text-[#2D6A4F] font-medium sm:text-sm">We reply within 24 hours</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                {/* Suzhou HQ */}
                <div className="rounded-xl border border-[#A3B18A] bg-white p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#2D6A4F]">
                      <Building2 className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">Suzhou HQ</h3>
                      <p className="text-xs text-[#636E72] sm:text-sm">China</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#A3B18A]" />
                    <p className="text-xs text-[#636E72] leading-relaxed sm:text-sm">
                      Room 232A, Building A, No. 188 Suhong East Road, Suzhou Industrial Park, Suzhou Area, China (Jiangsu) Pilot Free Trade Zone
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-xl border border-[#A3B18A] bg-white p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#E9B35F]">
                      <Mail className="size-5 text-[#1B4D3E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">Email</h3>
                      <div className="mt-1 space-y-1">
                        <a
                          href="mailto:justin@hexiabio.com"
                          className="block text-xs text-[#2D6A4F] hover:text-[#E9B35F] transition-colors sm:text-sm"
                        >
                          justin@hexiabio.com
                        </a>
                        <a
                          href="mailto:morehope.justin@gmail.com"
                          className="block text-xs text-[#2D6A4F] hover:text-[#E9B35F] transition-colors sm:text-sm"
                        >
                          morehope.justin@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WeChat/WhatsApp */}
                <div className="rounded-xl border border-[#A3B18A] bg-white p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#25D366]">
                      <MessageCircle className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B4D3E]">WeChat/WhatsApp</h3>
                      <span className="text-xs text-[#2D6A4F] sm:text-sm">+86 138 6232 0011</span>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4D3E] p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white/20">
                      <Headphones className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">7x24H Online Support</h3>
                      <p className="text-xs text-white/80">We are always here to help</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-white/70 leading-relaxed">
                    Our team is available around the clock to assist you with any inquiries, technical questions, or urgent orders.
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