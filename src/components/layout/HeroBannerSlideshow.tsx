"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, Users } from 'lucide-react'
import { Banner } from '@/types'

export default function HeroBannerSlideshow() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners')
        const data = await response.json()
        if (data.success && data.data) setBanners(data.data)
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  // Auto-rotate slides
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const defaultContent = {
    title: "Showroom Se Bhi Sasta",
    subtitle: "Discover the Latest Styles",
    description: "Experience the new standard of affordable luxury with our premium collection. Shop exclusive designs crafted for you.",
    buttonText: "Shop Collection",
    link: "/products"
  }

  if (loading) {
    return (
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 animate-pulse h-[600px] w-full border border-black/5"></div>
        </div>
      </section>
    )
  }

  const currentBanner = banners.length > 0 ? banners[currentSlide] : null

  return (
    <section className="relative min-h-[500px] sm:h-[60vh] lg:h-[70vh] w-full bg-white text-black overflow-hidden border-b border-black/[0.03]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentBanner?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
              alt="Hero Background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Subtle Overlay for readability without losing clarity */}
            <div className="absolute inset-0 bg-white/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-10 flex items-center pt-24 pb-20 sm:pt-32 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-block px-0 py-1 text-black text-[10px] font-black tracking-[0.3em] uppercase mb-4 border-b-2 border-black">
                Autumn Winter 2025
              </div>

              <h1 className="text-[8vw] sm:text-6xl lg:text-7xl font-black text-black mb-4 leading-[0.9] tracking-tighter uppercase italic drop-shadow-sm">
                {currentBanner?.title || defaultContent.title}
                <span className="block not-italic text-gray-700/80 mt-1 selection:bg-black selection:text-white text-[6vw] sm:text-4xl lg:text-5xl">
                  {defaultContent.subtitle}
                </span>
              </h1>

              <p className="text-black/60 text-base md:text-lg mb-8 max-w-lg leading-snug font-bold">
                {currentBanner?.description || defaultContent.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href={currentBanner?.link || defaultContent.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white px-8 py-4 rounded-none font-bold text-sm uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-gray-900"
                  >
                    {currentBanner?.buttonText || defaultContent.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Dots Overlay */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex gap-3">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-[1px] transition-all duration-500 ${currentSlide === idx
                  ? 'w-10 bg-black'
                  : 'w-5 bg-black/20 hover:bg-black/40'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
