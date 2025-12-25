"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils'
import { useSession } from 'next-auth/react'

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore()
    const { data: session } = useSession()
    const [isOrdered, setIsOrdered] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: session?.user?.email || '',
        address: '',
        city: '',
        zipCode: '',
        phone: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would hit an API
        setIsOrdered(true)
        setTimeout(() => {
            clearCart()
        }, 2000)
    }

    if (isOrdered) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-black flex items-center justify-center mx-auto rounded-full">
                        <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Order Placed!</h1>
                        <p className="text-gray-500 text-sm font-black uppercase tracking-widest leading-relaxed">
                            Thank you for your purchase. We've received your order and are processing it now.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-black text-white hover:bg-gray-900 px-12 py-8 rounded-none font-black text-sm uppercase tracking-[0.3em] w-full"
                    >
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </motion.div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center space-y-8">
                    <ShoppingBag className="h-16 w-16 mx-auto text-gray-200" />
                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic">Your cart is empty</h2>
                    <Button asChild className="bg-black text-white px-10 py-6 font-black uppercase tracking-widest">
                        <Link href="/products">Go to Store</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left: Checkout Form */}
                    <div className="flex-1 space-y-12">
                        <div className="space-y-4">
                            <Link
                                href="/cart"
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-all mb-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to Cart
                            </Link>
                            <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter italic leading-none">
                                Checkout
                            </h1>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-12">
                            {/* Shipping Information */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-black italic">01</div>
                                    <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Shipping Information</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-gray-500">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-gray-500">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode" className="text-[10px] font-black uppercase tracking-widest text-gray-500">ZIP / Postal Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="rounded-none border-black/10 focus:border-black h-12 text-sm uppercase font-bold"
                                    />
                                </div>
                            </section>

                            {/* Payment Method - Mock */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-black italic">02</div>
                                    <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Payment Method</h2>
                                </div>

                                <div className="p-8 border border-black bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <CreditCard className="h-8 w-8 text-black" />
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-widest text-black">Pay Securely</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Credit Card, UPI, Wallets</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-5 bg-black/5 border border-black/5 rounded-sm"></div>
                                        <div className="w-8 h-5 bg-black/5 border border-black/5 rounded-sm"></div>
                                        <div className="w-8 h-5 bg-black/5 border border-black/5 rounded-sm"></div>
                                    </div>
                                </div>
                            </section>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-gray-900 h-20 rounded-none font-black text-lg uppercase tracking-[0.3em] transition-all"
                            >
                                Place Order • {formatPrice(total)}
                            </Button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:w-[450px]">
                        <div className="sticky top-32 space-y-8 bg-gray-50 border border-black/5 p-10">
                            <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Review Order</h2>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-6">
                                        <div className="relative w-20 h-24 bg-white border border-black/5 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-[10px] font-black flex items-center justify-center">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-black leading-tight mb-1">{item.name}</h4>
                                            {item.variantId && <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Var: {item.variantId}</p>}
                                            <p className="text-xs font-black text-black mt-2">{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-black/10" />

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-black">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-xl font-black text-black uppercase tracking-tighter italic">Total</span>
                                    <span className="text-3xl font-black text-black tracking-tighter">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <Truck className="h-5 w-5 text-gray-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fast Ship</p>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-2 border-x border-black/5">
                                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Secure</p>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Authentic</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
