"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"

export function QuoteFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productInterest: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Form submitted – backend integration needed")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="quote" className="bg-[#FDFBF7] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#1B4D3E] sm:text-4xl">
              Request a <span className="text-[#E9B35F]">Quote</span>
            </h2>
            <p className="mt-4 text-[#636E72]">
              Tell us about your needs and we&apos;ll get back to you promptly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                placeholder="your@email.com"
              />
            </div>

            {/* Product Interest */}
            <div>
              <label
                htmlFor="productInterest"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Product Interest
              </label>
              <input
                type="text"
                id="productInterest"
                name="productInterest"
                value={formData.productInterest}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                placeholder="e.g., Methionine, NMN, Biluochun Tea"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                placeholder="Tell us more about your requirements..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#E9B35F] py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:bg-[#2D6A4F] hover:text-white"
            >
              Submit Request
            </Button>
          </form>

          {/* Support Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#636E72]">
            <Headphones className="size-5 text-[#2D6A4F]" />
            <span>7x24H Online Support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
