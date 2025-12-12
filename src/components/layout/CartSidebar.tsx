"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils'
import { cn } from '@/lib/utils'

export default function CartSidebar() {
  const {
    items,
    isOpen,
    total,
    itemCount,
    closeCart,
    removeItem,
    updateQuantity
  } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0d0d12]/95 backdrop-blur-3xl border-l border-white/10 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white font-heading">
                  Shopping Cart
                </h2>
                <div className="bg-white/10 px-2 py-1 rounded-full text-xs text-white border border-white/5">
                  {itemCount} items
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-heading">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-xs">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <Button
                    onClick={closeCart}
                    className="bg-white text-black hover:bg-gray-100 px-8 py-6 rounded-full font-bold text-lg"
                    asChild
                  >
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId || 'default'}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 group"
                    >
                      {/* Product Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1 -mr-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {item.variantId && (
                            <p className="text-xs text-gray-400">
                              Variant: {item.variantId}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-bold text-white font-heading">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center bg-white/5 rounded-lg border border-white/5">
                            <button
                              className="p-1.5 text-gray-400 hover:text-white transition-colors"
                              onClick={() => updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variantId
                              )}
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="w-8 text-center text-xs text-white font-medium">
                              {item.quantity}
                            </span>

                            <button
                              className="p-1.5 text-gray-400 hover:text-white transition-colors"
                              onClick={() => updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.variantId
                              )}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4 bg-[#0d0d12]/50 backdrop-blur-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">Calculated at checkout</span>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold text-white pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold h-12 rounded-xl text-lg shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/checkout">
                      Checkout <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 h-12 rounded-xl"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/cart">View Full Cart</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
