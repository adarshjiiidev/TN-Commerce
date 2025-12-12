"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-[#0d0d12] border-t border-white/5 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">L//U</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-heading tracking-tight">Limit//Up</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining fashion with bold, minimal designs for the modern lifestyle.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="sr-only">Address</span>
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  123 Fashion Street<br />
                  New York, NY 10001
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="sr-only">Email</span>
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <motion.a
                  href="mailto:support@limitup.com"
                  whileHover={{ x: 2, color: '#c084fc' }}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  support@limitup.com
                </motion.a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Shop</h4>
            <ul className="space-y-4">
              {[
                { name: 'New Arrivals', href: '/products?new=true' },
                { name: 'Oversized Collection', href: '/products?fit=oversized' },
                { name: 'Regular Fit', href: '/products?fit=regular' },
                { name: 'Best Sellers', href: '/products?sort=best-selling' },
                { name: 'Sale', href: '/products?sale=true' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: '#c084fc' }}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm inline-block cursor-pointer"
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
            <h4 className="text-white font-bold mb-6 font-heading">Company</h4>
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
                      whileHover={{ x: 4, color: '#c084fc' }}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm inline-block cursor-pointer"
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
            <h4 className="text-white font-bold mb-6 font-heading">Stay Connected</h4>
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
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all shadow-glow-sm hover:shadow-glow"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{name}</span>
                </motion.a>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
              <h5 className="text-white font-semibold mb-2">Subscribe to our newsletter</h5>
              <p className="text-xs text-gray-400 mb-4">Get the latest updates and exclusive offers.</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                <button className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-glow transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Limit//Up. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-xs text-gray-500 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
