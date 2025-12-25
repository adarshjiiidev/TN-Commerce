"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils'
import { cn } from '@/lib/utils'

export default function CartPage() {
    const {
        items,
        total,
        itemCount,
        removeItem,
        updateQuantity
    } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-24 h-24 bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-black/5">
                        <ShoppingBag className="h-10 w-10 text-gray-300" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-black mb-6 uppercase tracking-tighter italic">
                        Your Bag is Empty
                    </h1>
                    <p className="text-gray-500 text-sm mb-12 max-w-sm mx-auto font-black uppercase tracking-widest">
                        Looks like you haven't added anything to your cart yet. Explore our latest arrivals to get started.
                    </p>
                    <Button
                        asChild
                        className="bg-black text-white hover:bg-gray-900 px-12 py-8 rounded-none font-black text-sm uppercase tracking-[0.3em] transition-all"
                    >
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-12 pb-8 border-b border-black/5">
                            <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter italic">
                                Shopping Bag
                            </h1>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                                {itemCount} Items
                            </span>
                        </div>

                        <div className="space-y-12">
                            {items.map((item) => (
                                <div
                                    key={`${item.productId}-${item.variantId || 'default'}`}
                                    className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-black/5 last:border-0"
                                >
                                    {/* Product Image */}
                                    <div className="relative aspect-[3/4] sm:w-48 bg-gray-50 border border-black/5 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-black text-black uppercase tracking-tighter italic leading-none mb-2">
                                                        {item.name}
                                                    </h3>
                                                    {item.variantId && (
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            Variant: {item.variantId}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId, item.variantId)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-end justify-between gap-6 pt-6">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center bg-gray-50 border border-black/5 p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center text-sm font-black text-black">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                                                <p className="text-2xl font-black text-black tracking-tighter">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black hover:gap-3 transition-all"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:w-96">
                        <div className="sticky top-32 bg-gray-50 border border-black/5 p-8 lg:p-10 space-y-8">
                            <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-black">Calculated at next step</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Estimated Tax</span>
                                    <span>{formatPrice(0)}</span>
                                </div>
                            </div>

                            <div className="h-px bg-black/10" />

                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black text-black uppercase tracking-tighter italic">Total</span>
                                <span className="text-3xl font-black text-black tracking-tighter">{formatPrice(total)}</span>
                            </div>

                            <Button
                                asChild
                                className="w-full bg-black text-white hover:bg-gray-900 h-16 rounded-none font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                            >
                                <Link href="/checkout">
                                    Proceed to Checkout
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>

                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center leading-relaxed">
                                    Shipping and taxes calculated during checkout. Secure payments guaranteed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
