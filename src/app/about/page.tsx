"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Heart, Leaf, Users } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passion for Design',
    description: 'Every piece is crafted with love and attention to detail.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practices',
    description: 'Committed to ethical manufacturing and eco-friendly materials.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'Premium materials and construction that stands the test of time.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'Building lasting relationships with our customers and partners.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d12] pt-20">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
            alt="About Limit//Up"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d12]/80 via-[#0d0d12]/60 to-[#0d0d12]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 font-heading"
          >
            <span className="gradient-text">Our Story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl max-w-2xl mx-auto text-gray-300"
          >
            Redefining fashion with bold, minimal designs
          </motion.p>
        </motion.div>
      </section>

      {/* Story Content */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card rounded-3xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-heading">
                Where Fashion Meets Function
              </h2>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Limit//Up was born from a simple belief: that great design should be both beautiful and functional.
                  We create clothing and accessories that speak to the modern lifestyle, combining clean aesthetics
                  with thoughtful construction.
                </p>

                <p>
                  Our commitment to quality extends beyond just materials—we're dedicated to sustainable practices,
                  ethical manufacturing, and creating pieces that last. Every item in our collection is designed
                  to be a staple in your wardrobe for years to come.
                </p>

                <p>
                  We believe in the power of minimalism, where every detail serves a purpose. Our designs strip away
                  the unnecessary, leaving only what matters—form, function, and feeling.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#0a0a0f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-heading">
              Our Values
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card rounded-2xl p-6 text-center hover-glow transition-all"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3 font-heading">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-heading">
              Join Our Journey
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Be part of a community that values quality, sustainability, and timeless design.
            </p>
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 rounded-full font-semibold shadow-glow hover:shadow-glow-lg transition-all"
            >
              Explore Collection
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
