"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-black/[0.05] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Company Info - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="/lgt.png"
                alt="Showroom Se Bhi Sasta"
                className="h-20 w-auto object-contain"
              />
              <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tighter italic">
                Showroom <span className="text-gray-400">Se Bhi</span> Sasta
              </h3>
            </div>

            <p className="text-gray-900 text-[10px] sm:text-xs leading-relaxed font-black uppercase tracking-tighter italic max-w-xs">
              Premium commerce engineered<br />from the heart of the hostel.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <svg className="w-4 h-4 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="leading-tight">
                  Kanta Bishunpura<br />
                  Chandauli, UP
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <svg className="w-4 h-4 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <motion.a
                  href="mailto:support@showroom_sasta.com"
                  whileHover={{ x: 2, color: '#000000' }}
                  className="hover:text-black transition-colors truncate"
                >
                  support@showroom_sasta.com
                </motion.a>
              </div>
            </div>
          </div>

          {/* Quick Links - 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black text-black uppercase tracking-tighter italic mb-6">Shop</h4>
            <ul className="space-y-4">
              {[
                { name: 'New Arrivals', href: '/products?new=true' },
                { name: 'Oversized', href: '/products?fit=oversized' },
                { name: 'Regular Fit', href: '/products?fit=regular' },
                { name: 'Best Sellers', href: '/products?sort=best-selling' },
                { name: 'Sale', href: '/products?sale=true' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: '#000000' }}
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors inline-block cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black text-black uppercase tracking-tighter italic mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: '#000000' }}
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors inline-block cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter - 4 cols */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h4 className="text-sm font-black text-black uppercase tracking-tighter italic mb-4">Connect</h4>
              <div className="flex gap-3">
                {[
                  { name: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
                  { name: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
                  { name: 'Twitter', href: 'https://twitter.com', Icon: Twitter },
                  { name: 'Youtube', href: 'https://youtube.com', Icon: Youtube }
                ].map(({ name, href, Icon }) => (
                  <motion.a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 bg-gray-50 border border-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 border border-black/5">
              <h5 className="text-sm font-black text-black uppercase tracking-tighter italic mb-2">The Inner Circle</h5>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Access limited drops first.</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-white border border-black/5 px-4 py-2.5 text-[10px] text-black placeholder:text-gray-300 focus:outline-none focus:border-black/10 transition-all font-black"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-black text-white transition-all hover:bg-gray-800">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-black/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Showroom Se Bhi Sasta. Heritage in Room 302.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Terms</Link>
            <Link href="/cookies" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
