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
    <section className="py-24 relative overflow-hidden bg-white border-y border-black/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-gray-50 border border-black/5 flex items-center justify-center">
              <Gift className="h-8 w-8 text-black" />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6 uppercase tracking-tighter italic">
            First Order? 15% Off
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-12 max-w-2xl mx-auto">
            Join the community and get exclusive access to new drops & style tips.
          </p>
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-0 border border-black/10">
                <div className="relative flex-1">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-0 text-black placeholder:text-gray-400 rounded-none pl-12 pr-6 h-16 text-xs uppercase tracking-widest font-bold focus:ring-0"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="bg-black text-white hover:bg-gray-900 font-black px-12 h-16 text-xs uppercase tracking-widest transition-all"
                >
                  {isLoading ? 'Submitting...' : 'Join Now'}
                </motion.button>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6 italic">
                🎁 Exclusive access to private sales included.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black px-12 py-6 border border-black"
            >
              <p className="text-white font-black text-xs uppercase tracking-widest">
                ✓ Welcome to the club. Check your inbox.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
