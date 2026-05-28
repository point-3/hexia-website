"use client"

import { Mail, MapPin, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Service", href: "/service" },
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact Us", href: "/contact" },
]

const productLinks = [
  { label: "Feed Additives", href: "/products?category=Feed+Additives" },
  { label: "Food Additives", href: "/products?category=Food+Additives" },
  { label: "Nutrition", href: "/products?category=Nutrition" },
  { label: "Chinese Specialty", href: "/products?category=Chinese+Specialty" },
]

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/justin-jia-8995a6364", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/haibin2280?igsh=MTh0cXl2YnJxNnIxcQ%3D%3D&utm_source=qr", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/share/1BAkfLuv6y/?mibextid=wwXIfr", label: "Facebook" },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-[#2D6A4F]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6 lg:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2" aria-label="Hexia homepage">
              <span className="text-lg font-bold text-white">
                HEXIA
              </span>
            </a>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Hexia (Suzhou) Biotechnology Co., Ltd. - Your reliable partner in animal nutrition and food ingredients.
            </p>
            
            {/* Social Icons */}
            <div className="mt-4 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-[#E9B35F] hover:text-[#1B4D3E]"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              Products
            </h4>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              Contact
            </h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <span>
                  <strong className="text-white">Suzhou HQ</strong><br />
                  Room 232A, Building A, No. 188 Suhong East Road, Suzhou Industrial Park
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" title="Email" />
                <span>
                  <a href="mailto:justin@hexiabio.com" className="text-white transition-colors hover:text-[#E9B35F]">
                    justin@hexiabio.com
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" title="WhatsApp" />
                <a href="https://wa.me/+8613862320011" target="_blank" rel="noopener noreferrer" className="text-white transition-colors hover:text-[#E9B35F]">
                  +86 138 6232 0011
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-6">
          <p className="text-center text-xs text-white/60">
            Copyright © 2026 Hexia (Suzhou) Biotechnology Co., Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
