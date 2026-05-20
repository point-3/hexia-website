"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Package, BarChart3, GraduationCap, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/hexia/navbar"
import { Footer } from "@/components/hexia/footer"

const services = [
  {
    icon: Package,
    title: "Supply Chain Management",
    description: "One-stop solution for all your sourcing needs",
    details: [
      "Refined supply-chain management",
      "Mixed container loading for cost efficiency",
      "Flexible logistics options",
      "Door-to-door delivery service",
      "Real-time shipment tracking",
    ],
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "Stay informed with the latest industry trends",
    details: [
      "Monthly Amino Acid price trend reports",
      "Vitamin market analysis",
      "Regular LinkedIn updates",
      "Industry news and insights",
      "Customized market reports on request",
    ],
  },
  {
    icon: GraduationCap,
    title: "Bioway Business Academy",
    description: "Professional development and knowledge sharing",
    details: [
      "Industry training programs",
      "Technical workshops",
      "Best practices sharing",
      "Regulatory compliance guidance",
      "New product development support",
    ],
  },
]

export default function ServicePage() {
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
      <Navbar />

      <main className="pt-20 lg:pt-24">
        {/* Header */}
        <section className="bg-[#2D6A4F]/5 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/" className="text-[#636E72] hover:text-[#2D6A4F]">Home</Link>
              <ChevronRight className="size-4 text-[#636E72]" />
              <span className="font-medium text-[#2D6A4F]">Service</span>
            </nav>

            <h1 className="text-3xl font-bold text-[#1B4D3E] sm:text-4xl">Our Services</h1>
            <p className="mt-2 text-[#636E72]">
              Comprehensive solutions to support your business growth in animal nutrition and food ingredients
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group rounded-2xl border-l-4 border-[#A3B18A] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#2D6A4F] hover:shadow-lg lg:p-8"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#2D6A4F]">
                    <service.icon className="size-7 text-white" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#1B4D3E]">{service.title}</h3>
                  <p className="mt-2 text-[#636E72]">{service.description}</p>

                  <ul className="mt-6 space-y-3">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm text-[#636E72]">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#E9B35F]" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2D6A4F] transition-colors hover:text-[#E9B35F]"
                  >
                    Contact Us
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="bg-[#F5F3EF] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                Why Choose Our <span className="text-[#E9B35F]">Services</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#636E72]">
                We are committed to delivering value at every stage of your business journey
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "20+", label: "Years of Industry Experience" },
                { value: "99%", label: "Customer Satisfaction Rate" },
                { value: "48h", label: "Average Response Time" },
                { value: "24/7", label: "Online Support" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="text-3xl font-bold text-[#2D6A4F]">{stat.value}</div>
                  <div className="mt-2 text-sm text-[#636E72]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1B4D3E] sm:text-3xl">
                  Request a <span className="text-[#E9B35F]">Quote</span>
                </h2>
                <p className="mt-4 text-[#636E72]">
                  Tell us about your needs and we&apos;ll get back to you promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#2D3436]">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2D3436]">
                    Email Address <span className="text-red-500">*</span>
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
                  <label htmlFor="country" className="block text-sm font-medium text-[#2D3436]">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                    placeholder="Enter your country"
                  />
                </div>

                <div>
                  <label htmlFor="productInterest" className="block text-sm font-medium text-[#2D3436]">
                    Interested Product
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
                  <label htmlFor="quantity" className="block text-sm font-medium text-[#2D3436]">
                    Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#2D3436]">
                    Message / Requirement <span className="text-red-500">*</span>
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
                  Send Inquiry
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

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#636E72]">
                <Headphones className="size-5 text-[#2D6A4F]" />
                <span>7x24H Online Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
