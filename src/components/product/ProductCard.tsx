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
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4 border border-black/5 transition-all duration-300">

          {/* Sale Badge */}
          {product.isOnSale && discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-black text-white text-xs font-black px-2 py-1 uppercase tracking-tighter shadow-lg">
                -{discountPercentage}% OFF
              </div>
            </div>
          )}

          {/* Action Buttons (Right Top) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={cn(
                "p-2 bg-white border border-black/5 text-black hover:bg-black hover:text-white transition-all shadow-sm",
                isWishlisted && "bg-black text-white"
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
              className="object-cover object-center transition-all duration-700"
              priority={priority}
            />
          </div>

          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-4 bottom-4 z-20"
              >
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-900 py-3 font-black uppercase tracking-widest transition-all text-[10px]"
                >
                  <Plus className="h-4 w-4" />
                  Quick Add
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
              <div className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                Out of Stock
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-1 px-1">
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="text-xs uppercase tracking-[0.2em] text-gray-700 font-black">
              {product.tags[0]}
            </div>
          )}

          <div className="flex justify-between items-start gap-4">
            <h3 className="text-sm font-black text-black uppercase tracking-tighter leading-tight">
              {product.name}
            </h3>
            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3 w-3 text-black fill-current" />
                <span className="text-xs font-black text-black">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-black/5 mt-auto">
            <span className="text-sm font-black text-black tracking-tighter">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through tracking-tighter">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
