"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-black/[0.02] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <span className="text-white font-black text-lg">L//U</span>
              </div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">Limit//Up</h3>
            </div>

            <p className="text-gray-900 text-sm leading-relaxed font-black uppercase tracking-tighter italic">
              Redefining fashion<br />with bold, minimal designs.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="p-0">
                  <span className="sr-only">Address</span>
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  123 Fashion Street<br />
                  New York, NY 10001
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="p-0">
                  <span className="sr-only">Email</span>
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <motion.a
                  href="mailto:support@limitup.com"
                  whileHover={{ x: 2, color: '#000000' }}
                  className="hover:text-black transition-colors"
                >
                  support@limitup.com
                </motion.a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-black uppercase tracking-tighter italic mb-6">Shop</h4>
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
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors inline-block cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-black text-black uppercase tracking-tighter italic mb-6">Company</h4>
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
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors inline-block cursor-pointer"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-lg font-black text-black uppercase tracking-tighter italic mb-6">Social</h4>
            <div className="flex gap-4 mb-8">
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
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-none bg-gray-50/50 border border-black/[0.03] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{name}</span>
                </motion.a>
              ))}
            </div>

            <div className="p-8 bg-gray-50/50 border border-black/[0.03]">
              <h5 className="text-lg font-black text-black uppercase tracking-tighter italic mb-2">Join the Club</h5>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Get exclusive access to new drops.</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-black/[0.05] rounded-none px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black/20 transition-all font-bold"
                />
                <button className="absolute right-1.5 top-1.5 p-1.5 bg-black text-white transition-all hover:bg-gray-900">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-24 pt-8 border-t border-black/[0.02] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Limit//Up. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Terms</Link>
            <Link href="/cookies" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
