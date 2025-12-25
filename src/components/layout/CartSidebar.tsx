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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-black/5 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                  Shopping Bag
                </h2>
                <div className="bg-gray-50 px-2 py-1 text-[10px] font-bold text-black border border-black/5">
                  {itemCount} items
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-black mb-4 uppercase tracking-tighter">
                    Empty Bag
                  </h3>
                  <p className="text-gray-500 text-sm mb-8 max-w-xs font-medium">
                    Your shopping bag is currently empty.
                  </p>
                  <Button
                    onClick={closeCart}
                    className="bg-black text-white hover:bg-gray-900 px-12 py-6 rounded-none font-bold text-sm uppercase tracking-widest"
                    asChild
                  >
                    <Link href="/products">Shop Now</Link>
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
                      <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 border border-black/5 transition-all duration-500">
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
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-black leading-tight line-clamp-2">
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
                          <p className="text-sm font-black text-black">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-50 border border-black/5">
                            <button
                              className="p-1.5 text-gray-400 hover:text-black transition-colors"
                              onClick={() => updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variantId
                              )}
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="w-8 text-center text-xs text-black font-bold">
                              {item.quantity}
                            </span>

                            <button
                              className="p-1.5 text-gray-400 hover:text-black transition-colors"
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
              <div className="border-t border-black/5 p-8 space-y-4 bg-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Shipping</span>
                    <span className="text-black">Calculated later</span>
                  </div>
                  <div className="flex items-center justify-between text-xl font-black text-black pt-4 border-t border-black/5 uppercase tracking-tighter">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    className="w-full bg-black hover:bg-gray-900 text-white font-black h-14 rounded-none text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/checkout">
                      Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-black hover:bg-gray-50 h-10 rounded-none text-[10px] font-black uppercase tracking-widest"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/cart">View Cart</Link>
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
