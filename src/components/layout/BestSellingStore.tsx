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
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-black/5 mb-6">
            <Trophy className="h-4 w-4 text-black" />
            <span className="text-[10px] font-black text-black uppercase tracking-widest">Customer Favorites</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6 uppercase tracking-tighter italic">
            Best Sellers
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-xs font-bold uppercase tracking-[0.3em]">
            Pieces that defined the season. Handpicked for quality & style.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Hero Brand Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-12 h-[500px] mb-20"
          >
            <div className="relative h-full overflow-hidden bg-black group border border-black">
              <div className="relative z-10 flex flex-col h-full p-8 md:p-12">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-72 h-72 mb-10"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Signature Tee"
                      fill
                      className="object-contain z-10 relative transition-all duration-700"
                    />
                  </motion.div>

                  <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Showroom Se Bhi Sasta Originals</h3>
                  <p className="text-gray-400 mb-10 max-w-xs mx-auto text-[10px] font-black uppercase tracking-widest">Premium blend of luxury and streetwear.</p>

                  <div className="grid grid-cols-2 gap-px w-full max-w-sm bg-white/10 border border-white/10">
                    <div className="bg-black p-6 text-center">
                      <p className="text-xl font-black text-white italic tracking-tighter uppercase">Premium</p>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Quality</p>
                    </div>
                    <div className="bg-black p-6 text-center">
                      <p className="text-xl font-black text-white italic tracking-tighter uppercase">Verified</p>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Authentic</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-10 border-t border-white/10">
                  <Link href="/products?category=tshirts" className="group/btn block w-full">
                    <button className="w-full bg-white text-black font-black py-6 text-xs uppercase tracking-[0.3em] hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                      Shop The Originals <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Grid & Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-12 space-y-12"
          >
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Essentials", count: "Shop Collection", icon: Sparkles },
                { name: "Graphic", count: "Shop Collection", icon: Star },
                { name: "Limited", count: "Shop Collection", icon: Zap },
              ].map((cat, idx) => (
                <Link key={idx} href={`/products?category=tshirts&tag=${cat.name.toLowerCase()}`}>
                  <div className="bg-gray-50 hover:bg-gray-100 border border-black/5 rounded-none p-6 transition-all group cursor-pointer h-full flex flex-col items-center justify-center text-center">
                    <cat.icon className="h-5 w-5 mb-3 text-black" />
                    <h4 className="font-black text-black uppercase tracking-widest text-sm">{cat.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover:text-black transition-colors">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products/${product._id}`} className="block group">
                    <div className="bg-gray-50 border border-black/5 p-4 transition-all flex flex-col h-full">
                      <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-700"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black font-black uppercase tracking-tighter italic text-sm">{product.name}</h4>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3 w-3 text-black fill-current" />
                          <span className="text-[10px] font-bold text-black">{product.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-black font-black mt-4 text-xs tracking-tighter italic">₹{product.price}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Banner */}
            <div className="bg-black p-10 flex items-center justify-between border border-black overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Flash Sale Active</h4>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2 italic shadow-none border-0">Up to 40% off on all collections.</p>
              </div>
              <Link href="/products?onSale=true">
                <button className="relative z-10 bg-white text-black px-10 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all">
                  Shop Now
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
