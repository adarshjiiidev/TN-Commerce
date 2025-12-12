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
      <div className="min-h-screen bg-[#0d0d12] ">
        <Loading className="h-64" text="Loading product details..." />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild className="bg-white text-black hover:bg-gray-200">
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
    <div className="min-h-screen bg-[#0d0d12] text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span className="text-gray-700">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-white transition-colors capitalize">
            {product.category}
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square overflow-hidden rounded-3xl bg-[#15151a] border border-white/5 group"
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
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                {product.isOnSale && discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white border-0 px-3 py-1 text-sm font-bold shadow-lg">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.tags.includes('New Arrival') && (
                  <Badge className="bg-blue-500 text-white border-0 px-3 py-1 text-sm font-bold shadow-lg">
                    New
                  </Badge>
                )}
              </div>

              {/* Navigation Arrows (visible on hover) */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); previousImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 duration-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 duration-300"
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
                      "relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                      selectedImageIndex === index
                        ? "border-purple-500 ring-2 ring-purple-500/20 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-white/20"
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
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl md:text-5xl font-bold font-heading text-white tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  <button
                    onClick={handleWishlistToggle}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6 transition-all duration-300",
                        isWishlisted ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 group-hover:text-white"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
                  </div>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                  )}
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-white font-heading">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Description */}
              <p className="text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Select {product.variants[0].type}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={cn(
                          "px-6 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 min-w-[3rem]",
                          selectedVariant === variant.id
                            ? "border-purple-500 bg-purple-500 text-white shadow-glow"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
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
                  <div className="flex items-center justify-between sm:justify-start bg-white/5 rounded-full p-1 border border-white/10 sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 rounded-full h-12 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-glow hover:shadow-glow-lg transition-all duration-300"
                  >
                    Add to Cart • {formatPrice(product.price * quantity)}
                  </Button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Truck, label: 'Free Shipping', desc: 'On orders over ₹2000' },
                    { icon: RotateCcw, label: 'Free Returns', desc: 'Within 30 days' },
                    { icon: Shield, label: 'Secure Checkout', desc: 'SSL Encry  ed' },
                    { icon: Check, label: 'Authentic', desc: '100% Original' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                      <feature.icon className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white text-sm">{feature.label}</p>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
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
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white font-heading">
                  You Might Also Like
                </h2>
                <Link href="/products" className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="h-4 w-4" />
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
