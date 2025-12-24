"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Clock } from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  isOnSale: boolean
}

export default function FlashSale() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 45 })

  useEffect(() => { fetchSaleProducts() }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) seconds--
        else if (minutes > 0) { minutes--; seconds = 59 }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchSaleProducts = async () => {
    try {
      const response = await fetch('/api/products?onSale=true&limit=4')
      const data = await response.json()
      if (data.success) setProducts(data.data.products)
    } catch (err) { console.error('Error:', err) }
    finally { setLoading(false) }
  }

  const formatTime = (t: number) => t.toString().padStart(2, '0')
  const calcDiscount = (o: number, c: number) => Math.round(((o - c) / o) * 100)

  if (loading || products.length === 0) return null

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black text-white overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic italic">Flash Sale</h2>
          </div>

          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-12">Limited Time Collection</p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {[
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-white/5 border border-white/10 text-white px-6 py-4 text-4xl font-black min-w-[5rem]">
                  {formatTime(item.value)}
                </div>
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-2">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="bg-white text-black px-8 py-3 font-black text-xs uppercase tracking-widest shadow-xl">
              UP TO 50% OFF
            </span>
          </div>
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product._id}`}>
                <motion.div
                  className="bg-black border border-white/5 overflow-hidden transition-all duration-500"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.images[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-white text-black px-2 py-1 text-[9px] font-black uppercase tracking-tighter shadow-lg">
                        -{calcDiscount(product.originalPrice, product.price)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-black">
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest leading-none mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-black text-sm tracking-tighter">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-600 text-[10px] line-through tracking-tighter">₹{product.originalPrice}</span>
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
