"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shirt, Star, ShoppingBag, ArrowRight, Zap, Trophy, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
}

export default function BestSellingStore() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      const response = await fetch('/api/products?category=tshirts&sortBy=reviewCount&limit=6')
      const data = await response.json()

      if (data.success) {
        setBestSellers(data.data.products)
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayProducts = bestSellers

  if (loading) return null; // Or a skeleton, but usually handled by parent or empty for cleanliness on main landing

  if (displayProducts.length === 0) return null

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Backglow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Customer Favorites</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
            Best Selling <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Discover the pieces everyone is talking about. Handpicked for quality, style, and comfort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Hero Brand Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 h-full"
          >
            <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden glass-card border border-white/10 group">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0d0d12] to-blue-900/40" />
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

              <div className="relative z-10 flex flex-col h-full p-8 md:p-12">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-64 h-64 mb-8"
                  >
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                    <Image
                      src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Signature Tee"
                      fill
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-10 relative"
                    />
                  </motion.div>

                  <h3 className="text-3xl font-bold text-white mb-2 font-heading">Limit//Up Originals</h3>
                  <p className="text-gray-400 mb-6 max-w-xs mx-auto">Experiene the perfect blend of luxury and streetwear.</p>

                  <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                      <p className="text-2xl font-bold text-white">4.9</p>
                      <p className="text-xs text-gray-400">Avg Rating</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                      <p className="text-2xl font-bold text-white">10K+</p>
                      <p className="text-xs text-gray-400">Sold</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <Link href="/products?category=tshirts" className="group/btn block w-full">
                    <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                      Shop The Look <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Grid & Categories */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Essentials", count: "128 Items", icon: Sparkles, color: "text-purple-400" },
                { name: "Graphic", count: "84 Items", icon: Star, color: "text-pink-400" },
                { name: "Limited", count: "12 Items", icon: Zap, color: "text-yellow-400" },
              ].map((cat, idx) => (
                <Link key={idx} href={`/products?category=tshirts&tag=${cat.name.toLowerCase()}`}>
                  <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-4 transition-all group cursor-pointer h-full">
                    <cat.icon className={cn("h-6 w-6 mb-3", cat.color)} />
                    <h4 className="font-semibold text-white">{cat.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products/${product._id}`} className="block group">
                    <div className="bg-[#15151a] hover:bg-[#1c1c24] rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-all flex items-center gap-4 h-full">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-400">{product.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-white font-bold mt-2 font-heading">₹{product.price}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white font-heading">Flash Sale is Live!</h4>
                <p className="text-purple-100 text-sm mt-1">Get up to 40% off on selected items.</p>
              </div>
              <Link href="/products?onSale=true">
                <button className="relative z-10 bg-white text-purple-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                  Shop Now
                </button>
              </Link>

              {/* Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
