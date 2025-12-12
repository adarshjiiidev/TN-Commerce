"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Truck, RotateCcw, Clock, Shield, Package, CreditCard, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d12] py-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-heading">
            <span className="gradient-text">Shipping & Returns</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about our shipping and return policies
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all group">
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Standard Shipping</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span><strong>Free</strong> on orders over ₹1000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>₹99 for orders under ₹1000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>5-7 business days delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Available across India</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all group">
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Express Shipping</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>₹199 for all orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>2-3 business days delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>Available in major cities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>Priority processing</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <h4 className="font-bold text-white">Order Processing Time</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Orders placed before 2:00 PM (Monday-Friday) are processed the same day.
                Weekend orders are processed on the next business day.
              </p>
            </div>
          </motion.div>

          {/* Returns & Exchanges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-2xl p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Returns & Exchanges
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all group">
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-green-400 transition-colors">Return Policy</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>30-day return window</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>Items must be unworn and unwashed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>Original tags must be attached</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>Free return shipping</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all group">
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">Exchange Policy</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Size exchanges within 30 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Color exchanges subject to availability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>One free exchange per order</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Additional exchanges: ₹99 fee</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <h4 className="font-bold text-white">Quality Guarantee</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-8">
                Not satisfied with your purchase? We offer a 100% satisfaction guarantee.
                Contact us within 30 days for a full refund or exchange.
              </p>
            </div>
          </motion.div>

          {/* How to Return */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card rounded-2xl p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                How to Return an Item
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Initiate Return', desc: 'Contact us or visit your account to start a return request', color: 'blue' },
                { step: 2, title: 'Pack Items', desc: 'Place items in original packaging with tags attached', color: 'purple' },
                { step: 3, title: 'Ship Back', desc: 'Use our prepaid return label to send items back', color: 'pink' },
                { step: 4, title: 'Get Refund', desc: 'Receive your refund within 5-7 business days', color: 'green' }
              ].map((item, index) => (
                <div key={index} className="text-center relative group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-xl">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment & Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="glass-card rounded-2xl p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Refunds & Payment
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Refund Methods</h3>
                <p className="text-gray-400 mb-4">
                  Refunds are processed back to your original payment method:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Credit/Debit Cards: 3-5 business days',
                    'UPI/Digital Wallets: 1-3 business days',
                    'Net Banking: 3-7 business days',
                    'Cash on Delivery: Bank transfer within 7 business days'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-400 bg-white/5 p-3 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                <h4 className="font-bold text-white mb-3">Important Notes</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                    Shipping charges are non-refundable (except for defective items)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                    Sale items marked "Final Sale" cannot be returned
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                    Custom or personalized items are not eligible for return
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                    Items must be returned in original condition
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
