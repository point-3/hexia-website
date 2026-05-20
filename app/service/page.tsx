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
    company: "",
    service: "",
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
                { value: "10+", label: "Years of Industry Experience" },
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

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#2D3436]">
                      Name
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
                      Email
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
                  <label htmlFor="service" className="block text-sm font-medium text-[#2D3436]">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                  >
                    <option value="">Select a service</option>
                    <option value="supply-chain">Supply Chain Management</option>
                    <option value="market-intel">Market Intelligence</option>
                    <option value="academy">Bioway Business Academy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#2D3436]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 w-full resize-none rounded-xl border border-[#A3B18A] bg-[#FDFBF7] px-4 py-3 text-[#2D3436] placeholder:text-[#636E72]/60 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#E9B35F] py-6 text-base font-semibold text-[#1B4D3E] transition-all duration-300 hover:bg-[#2D6A4F] hover:text-white"
                >
                  Submit Request
                </Button>
              </form>

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
