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
    title: "Express Your Vibe",
    subtitle: "Discover the Latest Styles",
    description: "Discover the latest trends & express your style effortlessly. Shop exclusive collections with premium designs, just for you!",
    buttonText: "Shop now",
    link: "/products"
  }

  if (loading) {
    return (
      <section className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-[#0d0d12]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a1a24] rounded-3xl p-8 animate-pulse h-96"></div>
        </div>
      </section>
    )
  }

  const currentBanner = banners.length > 0 ? banners[currentSlide] : null

  return (
    <section className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-[#0d0d12]">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Card - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#1a1a24] to-[#14141c] rounded-3xl p-6 md:p-8 shadow-2xl border border-white/5 mb-6"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {currentBanner?.title || defaultContent.title}
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {defaultContent.subtitle}
                    </span>
                  </h1>

                  <p className="text-gray-400 text-base mb-6 max-w-lg leading-relaxed">
                    {currentBanner?.description || defaultContent.description}
                  </p>

                  <div>
                    <Link href={currentBanner?.link || defaultContent.link}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                      >
                        {currentBanner?.buttonText || defaultContent.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Social Proof - Compact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#1a1a24]" />
                    ))}
                  </div>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-xl font-bold text-white mb-0.5">58K+</div>
                <div className="text-gray-400 text-xs mb-1">Client Reviews</div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Image - Smaller */}
            <div className="relative h-[350px] lg:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentBanner?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Dots */}
          {banners.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${currentSlide === idx
                    ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Bottom Cards Grid - Updated with Oversized and Regular Fit */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Card 1 - Oversized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-[#1a1a24] to-[#14141c] rounded-2xl overflow-hidden border border-white/5 h-60 group cursor-pointer"
          >
            <Link href="/products?fit=oversized" className="block h-full relative">
              <Image
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Oversized"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg">Oversized</h3>
                <p className="text-gray-300 text-xs mt-1">Shop Collection →</p>
              </div>
            </Link>
          </motion.div>

          {/* Card 2 - Regular Fit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-[#1a1a24] to-[#14141c] rounded-2xl overflow-hidden border border-white/5 h-60 group cursor-pointer"
          >
            <Link href="/products?fit=regular" className="block h-full relative">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Regular Fit"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg">Regular Fit</h3>
                <p className="text-gray-300 text-xs mt-1">Shop Now →</p>
              </div>
            </Link>
          </motion.div>

          {/* Card 3 - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 h-60 flex items-center justify-center p-6 text-center"
          >
            <div>
              <h3 className="text-white font-bold text-xl mb-2">
                Models wearing
                <br />
                full outfits
              </h3>
              <Link href="/collections">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all"
                >
                  Explore more →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
