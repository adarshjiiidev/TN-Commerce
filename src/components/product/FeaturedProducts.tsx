"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8')
      const data = await response.json()
      if (data.success) setProducts(data.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0d0d12] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/5 rounded w-64 mb-12 mx-auto"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/5 h-96 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0d0d12] to-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-white mb-3">Trending Now</h2>
          <p className="text-gray-400 text-lg">Handpicked bestsellers everyone loves</p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product._id}`} className="group block">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-gradient-to-br from-[#1a1a24] to-[#14141c] rounded-3xl overflow-hidden border border-white/5 group-hover:border-purple-500/30 group-hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)] transition-all duration-500"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                    <Image
                      src={product.images[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="text-white text-base font-semibold mb-2 truncate group-hover:text-purple-300 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-400 text-sm font-medium">{product.rating}</span>
                      <span className="text-gray-600 text-sm">({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-orange-400 font-bold text-xl">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-600 text-sm line-through">₹{product.originalPrice}</span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              View All Products →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
