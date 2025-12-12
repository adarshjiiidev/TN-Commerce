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
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-400" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-white fill-current" />
            <h2 className="text-4xl font-black text-white">FLASH SALE</h2>
            <Zap className="h-8 w-8 text-white fill-current" />
          </div>

          <p className="text-white/90 text-lg mb-6">Massive discounts - Limited time only!</p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-white" />
            <span className="text-white font-semibold text-lg">Ends in</span>
            {[
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-black/40 backdrop-blur-md text-white px-5 py-3 rounded-xl text-3xl font-bold min-w-[4rem] text-center border border-white/20">
                  {formatTime(item.value)}
                </div>
                <span className="text-white/70 text-xs mt-1 font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-base shadow-lg">
              UP TO 50% OFF
            </span>
            <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-full font-semibold">
              🔥 Limited Stock
            </span>
          </div>
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product._id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-black shadow-lg">
                        -{calcDiscount(product.originalPrice, product.price)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-gray-900 font-semibold mb-2 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500 font-bold text-xl">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 text-sm line-through">₹{product.originalPrice}</span>
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
