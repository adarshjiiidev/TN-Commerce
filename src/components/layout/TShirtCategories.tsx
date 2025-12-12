"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    id: 'plain',
    name: 'Plain Tees',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    href: '/products?category=tshirts&subcategory=plain',
    gradient: 'from-purple-600 via-pink-500 to-purple-600'
  },
  {
    id: 'textured',
    name: 'Textured Tees',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    href: '/products?category=tshirts&subcategory=textured',
    gradient: 'from-pink-500 via-orange-400 to-pink-500'
  },
  {
    id: 'printed',
    name: 'Printed Tees',
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    href: '/products?category=tshirts&subcategory=printed',
    gradient: 'from-cyan-500 via-blue-500 to-cyan-500'
  },
  {
    id: 'formal',
    name: 'Formal',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    href: '/products?category=tshirts&subcategory=formal',
    gradient: 'from-blue-500 via-purple-500 to-blue-500'
  }
]

export default function TShirtCategories() {
  return (
    <section className="bg-[#0d0d12] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => {
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={category.href}>
                  <div className="flex flex-col items-center text-center cursor-pointer">
                    {/* T-Shirt Image Container with Gradient */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 mb-3 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 bg-gradient-to-br ${category.gradient}`}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover mix-blend-overlay opacity-60 group-hover:opacity-70 transition-opacity duration-300"
                      />
                    </motion.div>

                    {/* Category Name */}
                    <span className="text-sm sm:text-base lg:text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                      {category.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
