"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, Plus, Eye } from 'lucide-react'
import { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart'
import { formatPrice, calculateDiscount } from '@/utils'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()
  const { data: session } = useSession()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session?.user) {
      // Create a custom event or redirect
      window.location.href = '/?auth=signin'
      return
    }
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist API call
  }

  const discountPercentage = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn("group relative block h-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1a1a24] mb-4 border border-white/5 group-hover:border-purple-500/30 transition-colors duration-300 shadow-lg group-hover:shadow-purple-900/10">

          {/* Sale Badge */}
          {product.isOnSale && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md bg-opacity-90">
                <span>SAVE</span>
                <span>{discountPercentage}%</span>
              </div>
            </div>
          )}

          {/* Action Buttons (Right Top) */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={cn(
                "p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg",
                isWishlisted ? "bg-red-500/80 text-white border-red-500" : "hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </motion.button>
          </div>

          {/* Product Image */}
          <div className="relative w-full h-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              priority={priority}
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-4 bottom-4 z-20"
              >
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md text-black hover:bg-white py-3 rounded-xl font-semibold shadow-xl hover:scale-[1.02] transition-all text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Quick Add
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
              <div className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">
                Out of Stock
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2 px-1">
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold truncate">
              {product.tags[0]}
            </div>
          )}

          <div className="flex justify-between items-start gap-4">
            <h3 className="text-base font-medium text-white line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
              {product.name}
            </h3>
            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 shrink-0 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-gray-300">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-white font-heading">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through decoration-gray-500/50">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
