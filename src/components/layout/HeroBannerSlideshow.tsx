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
    <section className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-white text-black overflow-hidden border-b border-black/[0.03]">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Content - Takes 7 cols */}
          <div className="lg:col-span-7">
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

                <h1 className="text-[12vw] lg:text-9xl font-black text-black mb-8 leading-[0.85] tracking-tighter uppercase italic">
                  {currentBanner?.title || defaultContent.title}
                  <span className="block not-italic text-gray-300 mt-4 selection:bg-black selection:text-white">
                    {defaultContent.subtitle}
                  </span>
                </h1>

                <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-lg leading-snug font-bold">
                  {currentBanner?.description || defaultContent.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href={currentBanner?.link || defaultContent.link}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-black text-white px-12 py-6 rounded-none font-bold text-sm uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-gray-900"
                    >
                      {currentBanner?.buttonText || defaultContent.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Image - Takes 5 cols */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-[3/4] overflow-hidden bg-gray-50 border border-black/5"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentBanner?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt="Hero"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Navigation Dots Overlay */}
            {banners.length > 1 && (
              <div className="absolute -bottom-10 left-0 flex gap-4">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-[2px] transition-all duration-500 ${currentSlide === idx
                      ? 'w-12 bg-black'
                      : 'w-6 bg-black/20 hover:bg-black/40'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
