"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    id: 'oversized',
    name: 'Oversized',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    href: '/products?fit=oversized',
    gradient: 'from-purple-500 via-pink-500 to-purple-600'
  },
  {
    id: 'regular-fit',
    name: 'Regular Fit',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    href: '/products?fit=regular',
    gradient: 'from-pink-500 via-orange-400 to-pink-500'
  }
]

export default function CategoryGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d0d12]">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-white mb-3">Shop by Fit</h2>
          <p className="text-gray-400 text-lg">Find your perfect style</p>
        </motion.div>

        {/* Categories Grid - 2 columns centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group block">
                <motion.div
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />

                  {/* Gradient Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[5]" />

                  {/* Image */}
                  <div className="absolute inset-0 z-10">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Glassmorphism Label - Enhanced */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/15 backdrop-blur-2xl rounded-2xl py-4 px-8 border border-white/30 shadow-2xl text-center group-hover:bg-white/20 transition-all duration-300"
                    >
                      <span className="text-white font-semibold text-xl tracking-wide">
                        {category.name}
                      </span>
                    </motion.div>
                  </div>

                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-purple-500/20 to-transparent z-[8]" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
