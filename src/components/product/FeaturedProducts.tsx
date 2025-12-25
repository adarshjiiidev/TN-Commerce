"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-100 rounded-none w-64 mb-12"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 aspect-[3/4]"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-left mb-12 border-b border-black/[0.03] pb-6"
        >
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-5xl font-black text-black uppercase tracking-tighter italic">Bestsellers</h2>
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest mt-2">Curated for the bold</p>
            </div>
            <Link href="/products" className="text-black text-xs font-bold uppercase tracking-widest border-b border-black hover:text-gray-400 hover:border-gray-400 mb-2 transition-all">
              View All
            </Link>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product._id}`} className="group block">
                <motion.div
                  className="relative overflow-hidden transition-all duration-500"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border border-black/[0.03]">
                    <Image
                      src={product.images[0] || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-700"
                    />

                    {/* Quick Add Button - Solid Black */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest"
                      >
                        Quick Add
                      </motion.button>
                    </div>

                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 right-4 bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-tighter">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-black text-xs font-black uppercase tracking-widest leading-none mb-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-black font-black text-sm tracking-tighter">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-600 text-xs line-through tracking-tighter">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
