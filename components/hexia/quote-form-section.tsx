"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"
import { createInquiry } from "@/lib/api/inquiries"
import { toast } from "sonner"

export function QuoteFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    productInterest: "",
    quantity: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        country: formData.country || undefined,
        product_interest: formData.productInterest || undefined,
        quantity: formData.quantity || undefined,
        message: formData.message,
        source_page: "Home Page Quote Section",
      })
      toast.success("Inquiry submitted successfully!")
      setShowSuccess(true)
      setFormData({
        name: "",
        email: "",
        country: "",
        productInterest: "",
        quantity: "",
        message: "",
      })
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err: any) {
      console.error(err)
      toast.error(`Submission failed: ${err.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
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
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                placeholder="Enter your country"
              />
            </div>

            {/* Interested Product */}
            <div>
              <label
                htmlFor="productInterest"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Interested Product
              </label>
              <input
                type="text"
                id="productInterest"
                name="productInterest"
                value={formData.productInterest}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                placeholder="e.g., Methionine, NMN, Biluochun Tea"
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                placeholder="Enter quantity"
              />
            </div>

            {/* Message / Requirement */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#2D3436]"
              >
                Message / Requirement <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                disabled={isSubmitting}
                className="mt-2 w-full resize-none rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 disabled:opacity-50"
                placeholder="Please describe your requirements in detail..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-[#E9B35F] py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:bg-[#2D6A4F] hover:text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Send Inquiry"}
            </Button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 rounded-xl bg-[#2D6A4F]/20 p-4 text-center">
              <p className="text-sm font-medium text-[#2D6A4F]">
                Thank you for your inquiry! We will contact you as soon as possible within 24 hours.
              </p>
            </div>
          )}

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
