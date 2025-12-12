"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Star, Users, Award, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 250])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsVisible(true)
    document.documentElement.classList.add('smooth-scroll')
    return () => {
      document.documentElement.classList.remove('smooth-scroll')
    }
  }, [])

  const smoothScrollTo = (target: Element | number) => {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 1200
      let start: number | null = null

      const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3)
      }

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)
        const ease = easeOutCubic(progress)
        window.scrollTo(0, startPosition + distance * ease)
        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }
      requestAnimationFrame(animation)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-section bg-[#0d0d12]">
      {/* Enhanced Background with Vibrant Gradients */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-[#0d0d12]" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"
        />
      </motion.div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-80px)] pt-20">
          {/* Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left text-white">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -60 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Brand Tag */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 shadow-glow"
              >
                <Star className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold tracking-wide uppercase text-gray-200">Premium Collection 2025</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black font-heading tracking-tight mb-8 leading-[0.9]">
                <motion.div className="overflow-hidden">
                  <motion.span
                    className="block text-white"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  >
                    Redefine
                  </motion.span>
                </motion.div>
                <motion.div className="overflow-hidden">
                  <motion.div
                    className="flex justify-center lg:justify-start items-center gap-4"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  >
                    <span className="text-gray-500 italic font-serif font-light">Your</span>
                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent relative">
                      Style
                      <motion.svg
                        className="absolute -bottom-2 left-0 w-full"
                        viewBox="0 0 100 10"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                      >
                        <path d="M0 5 Q 50 10 100 5" fill="none" stroke="url(#gradient)" strokeWidth="4" />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#db2777" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    </span>
                  </motion.div>
                </motion.div>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-2xl text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed font-light lg:mx-0 mx-auto"
              >
                Discover bold, minimal designs that speak to the modern lifestyle.
                Where fashion meets function in perfect harmony.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center mb-16"
              >
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 rounded-full px-8 py-6 text-lg font-bold"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm rounded-full px-8 py-6 text-lg font-medium"
                  >
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Our Story
                  </Button>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-wrap justify-center lg:justify-start gap-8 border-t border-white/5 pt-8"
              >
                {[
                  { icon: Users, label: "50K+ Happy Customers" },
                  { icon: Award, label: "Premium Quality" },
                  { icon: TrendingUp, label: "Trending Styles" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                    <item.icon className="h-5 w-5 text-purple-400" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Visuals */}
          <div className="lg:col-span-5 hidden lg:block relative h-full min-h-[600px]">
            {/* Abstract Shapes/Images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-10 right-10 w-80 h-[500px] rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl z-10"
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fashion Model"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-heading text-2xl font-bold">New Season</p>
                <p className="text-purple-300">Spring / Summer '25</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute bottom-20 left-10 w-64 h-80 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl z-0 bg-[#1a1a24]"
            >
              <Image
                src="https://images.unsplash.com/photo-1529139574466-a302c2d3621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fashion Detail"
                fill
                className="object-cover opacity-80"
              />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 glass-card p-4 rounded-2xl z-20 flex items-center gap-4 animate-float"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Live Sales</p>
                <p className="text-white font-bold">+128 sold in last hr</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => {
            const nextSection = window.innerHeight;
            smoothScrollTo(nextSection)
          }}
        >
          <span className="text-xs tracking-[0.2em] text-gray-500 uppercase group-hover:text-white transition-colors">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent group-hover:from-white transition-all overflow-hidden relative">
            <motion.div
              animate={{ y: [-20, 48] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-white blur-[1px]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
