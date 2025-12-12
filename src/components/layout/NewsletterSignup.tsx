"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Mail, Gift } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
    }, 1000)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />

      {/* Animated Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
              <Gift className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            GET 15% OFF YOUR FIRST ORDER
          </h2>

          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join our community and be the first to know about new drops, exclusive deals & style tips!
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 rounded-full pl-12 pr-6 py-6 text-base focus:border-white/50 focus:ring-0"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 hover:bg-white/90 font-bold rounded-full px-10 py-6 text-base shadow-2xl transition-all"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                </motion.button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                🎁 Plus, get exclusive access to private sales
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/20 backdrop-blur-xl rounded-2xl px-8 py-6 inline-block border border-white/30"
            >
              <p className="text-white font-bold text-xl">
                ✓ Welcome to the VIP club! Check your inbox 📧
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
