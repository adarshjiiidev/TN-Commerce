"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/product/ProductCard'
import ReviewSection from '@/components/product/ReviewSection'
import Loading from '@/components/ui/loading'
import { useCartStore } from '@/stores/cart'
import { Product, Review } from '@/types'
import { formatPrice, calculateDiscount } from '@/utils'
import { cn } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { data: session } = useSession()
  const { addItem } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.data.product)
          setRelatedProducts(data.data.relatedProducts)
          setReviews(data.data.reviews)
          // Pre-select first variant if available
          if (data.data.product.variants?.length > 0) {
            setSelectedVariant(data.data.product.variants[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  // Update document title when product loads
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Showroom Se Bhi Sasta`
    }
  }, [product])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedVariant || undefined, quantity)
    }
  }

  const handleWishlistToggle = () => {
    if (!session?.user) {
      // Logic for generic unified modal opening would go here if implemented
      // For now we just toggle state visually if not strictly enforcing auth check on UI
      return
    }
    setIsWishlisted(!isWishlisted)
    // TODO: Implement actual API call
  }

  const nextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const previousImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <Loading className="h-64" text="Loading product details..." />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-black mb-4 uppercase tracking-tighter italic">Product Not Found</h1>
          <p className="text-gray-700 text-xs font-bold uppercase tracking-widest mb-10">The product you're looking for doesn't exist.</p>
          <Button asChild className="bg-black text-white hover:bg-gray-900 rounded-none h-14 px-10">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const discountPercentage = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-600 mb-12 font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-black transition-colors">
            {product.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-black truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square overflow-hidden bg-gray-50 border border-black/5 group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                >
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700 ease-out cursor-zoom-in",
                      isZoomed ? "scale-110" : "scale-100"
                    )}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                {product.isOnSale && discountPercentage > 0 && (
                  <Badge className="bg-black text-white border-0 px-3 py-1 text-xs font-black uppercase tracking-tighter shadow-lg">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Navigation Arrows (visible on hover) */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); previousImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white border border-black/5 text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white border border-black/5 text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-24 h-24 overflow-hidden border-2 transition-all duration-300",
                      selectedImageIndex === index
                        ? "border-black scale-105"
                        : "border-transparent opacity-40 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="sticky top-24 space-y-8">
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-4xl md:text-6xl font-black font-heading text-black uppercase tracking-tighter leading-[0.9] italic">
                    {product.name}
                  </h1>
                  <button
                    onClick={handleWishlistToggle}
                    className="p-4 bg-gray-50 border border-black/5 hover:bg-black hover:text-white transition-colors group"
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6 transition-all duration-300",
                        isWishlisted ? "fill-current" : ""
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-black fill-current" />
                    <span className="text-xs font-black uppercase tracking-widest text-black">{product.rating.toFixed(1)}</span>
                    <span className="text-gray-600 text-xs font-bold uppercase tracking-widest ml-1">({product.reviewCount})</span>
                  </div>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-black" />
                      Available
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs font-black uppercase tracking-widest">Sold Out</span>
                  )}
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-black tracking-tighter italic">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through tracking-tighter">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-black/5" />

              {/* Description */}
              <p className="text-gray-600 text-sm font-medium leading-relaxed uppercase tracking-wide">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest">
                    Select {product.variants[0].type}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={cn(
                          "px-6 py-4 border text-[10px] font-black uppercase tracking-widest transition-all min-w-[3.5rem]",
                          selectedVariant === variant.id
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-black hover:text-black"
                        )}
                      >
                        {variant.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-black/5 bg-gray-50 p-1 sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-black text-black text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-14 text-xs font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 rounded-none transition-all duration-300"
                  >
                    Add to Cart • {formatPrice(product.price * quantity)}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Truck, label: 'Free Delivery', desc: 'Over ₹2000' },
                    { icon: RotateCcw, label: '30 Day Returns', desc: 'Easy process' },
                    { icon: Shield, label: 'Secure Payment', desc: 'Verified' },
                    { icon: Check, label: 'Authentic', desc: 'Guaranteed' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-5 bg-gray-50 border border-black/5">
                      <feature.icon className="h-5 w-5 text-black mt-0.5" />
                      <div>
                        <p className="font-black text-black text-xs uppercase tracking-widest">{feature.label}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews & Related */}
        <div className="mt-32 space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ReviewSection
              productId={productId}
              reviews={reviews}
              averageRating={product.rating || 0}
              totalReviews={product.reviewCount || 0}
            />
          </motion.div>

          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-12 border-b border-black/5 pb-8">
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic">
                  Recommended
                </h2>
                <Link href="/products" className="text-xs font-black uppercase tracking-[0.3em] text-black hover:underline flex items-center gap-1 transition-colors">
                  Shop All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
