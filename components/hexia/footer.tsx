"use client"

import { Mail, MapPin, Linkedin, Facebook, Leaf } from "lucide-react"

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
  { label: "Suzhou Specialty", href: "/products?category=Suzhou+Specialty" },
]

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-[#2D6A4F]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <a href="/" className="flex items-center gap-2">
              <Leaf className="size-6 text-[#E9B35F]" />
              <span className="text-lg font-bold text-white">
                HEXIA BIOTECH
              </span>
            </a>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Hexia (Suzhou) Biotechnology Co., Ltd. - Your reliable partner in 
              animal nutrition and food ingredients.
            </p>
            
            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-[#E9B35F] hover:text-[#1B4D3E]"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#E9B35F]"
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
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#E9B35F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E9B35F]">
              Contact
            </h4>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <span>
                  <strong className="text-white/80">Suzhou HQ</strong><br />
                  RM205, Building 1-B, HR Service Industrial Park, No. 336 Fengli Street, Suzhou Industrial Park, China
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#E9B35F]" />
                <span>
                  <strong className="text-white/80">Japan Office</strong><br />
                  103-9-1, Hirano Shi, Hirano-Ku, Osaka, Japan
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="size-4 shrink-0 text-[#E9B35F]" />
                <a href="mailto:sales@hexia.com" className="transition-colors hover:text-[#E9B35F]">
                  sales@hexia.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/40">
            Copyright © 2026 Hexia (Suzhou) Biotechnology Co., Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
