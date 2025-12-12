"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, Mail, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (trackingNumber.toLowerCase().includes('invalid')) {
        setError('Order not found. Please check your tracking number and try again.')
        setOrderData(null)
      } else {
        setOrderData({
          id: trackingNumber,
          status: 'shipped',
          estimatedDelivery: '2025-09-03',
          items: [
            { name: 'Classic White T-Shirt', quantity: 2, price: 599 },
            { name: 'Navy Blue T-Shirt', quantity: 1, price: 699 }
          ],
          timeline: [
            { status: 'Order Placed', date: '2025-08-29', completed: true },
            { status: 'Payment Confirmed', date: '2025-08-29', completed: true },
            { status: 'Processing', date: '2025-08-30', completed: true },
            { status: 'Shipped', date: '2025-08-31', completed: true },
            { status: 'Out for Delivery', date: '2025-09-03', completed: false },
            { status: 'Delivered', date: '', completed: false }
          ]
        })
      }
      setLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-400" />
    }

    switch (status) {
      case 'Processing':
        return <Package className="h-5 w-5 text-blue-400" />
      case 'Shipped':
      case 'Out for Delivery':
        return <Truck className="h-5 w-5 text-purple-400" />
      default:
        return <div className="h-5 w-5 bg-white/10 rounded-full border border-white/20" />
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] pt-20 pb-12">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-6">
            <Truck className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Order</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Enter your order number or tracking ID to see real-time updates on your shipment.
          </p>
        </motion.div>

        {/* Tracking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 mb-8"
        >
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 ml-1">
                Order Number / Tracking ID
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., TN-2025-8392"
                  className="w-full pl-12 pr-4 py-6 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/10 rounded-xl text-lg tracking-wide transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Track Shipment <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
              >
                <div className="p-1 bg-red-500/20 rounded-full mt-0.5">
                  <XIcon className="h-3 w-3 text-red-400" />
                </div>
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Order Details */}
        <AnimatePresence>
          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 font-heading">Order Details</h2>
                    <p className="text-gray-400 text-sm">View shipment status and timeline</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">Order Number</p>
                      <p className="text-white font-mono font-medium">{orderData.id}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
                      <p className="text-white font-medium">{orderData.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Items in Shipment</h3>
                  <div className="space-y-3">
                    {orderData.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-white font-heading">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-8 font-heading">Shipment Progress</h2>
                <div className="relative space-y-8 pl-2">
                  {/* Vertical Line */}
                  <div className="absolute top-4 bottom-4 left-[21px] w-[2px] bg-white/10" />

                  {orderData.timeline.map((step: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative flex items-center space-x-6 z-10"
                    >
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                        step.completed
                          ? "bg-[#0d0d12] border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                          : index === 4 // Current step logic approximation
                            ? "bg-[#0d0d12] border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            : "bg-[#0d0d12] border-white/10 text-gray-600"
                      )}>
                        {getStatusIcon(step.status, step.completed)}
                      </div>

                      <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <h3 className={cn(
                            "font-semibold text-lg",
                            step.completed ? "text-white" : "text-gray-500"
                          )}>
                            {step.status}
                          </h3>
                          {step.date && (
                            <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">
                              {step.date}
                            </div>
                          )}
                        </div>
                        {step.completed && (
                          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Completed
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 text-center border border-white/10 backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Mail className="h-8 w-8 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-heading">Need Assistance?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            If you have any questions about your order or shipment status, our support team is ready to help 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 h-11 px-6 rounded-full">
              <Mail className="h-4 w-4 mr-2" />
              support@limitup.com
            </Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 h-11 px-6 rounded-full">
              <Phone className="h-4 w-4 mr-2" />
              +1 (555) 012-3456
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
  )
}
