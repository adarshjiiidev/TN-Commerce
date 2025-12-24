"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@limitup.com',
    description: 'We\'ll respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri 9am-6pm EST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: '123 Fashion St, NYC 10001',
    description: 'Showroom open by appointment',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-black mb-4 uppercase tracking-tighter italic">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-bold uppercase text-xs tracking-widest">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Mail,
              title: 'Email Us',
              value: 'support@showroom_sasta.com',
              description: 'We\'ll respond within 24 hours',
            },
            {
              icon: Phone,
              title: 'Call Us',
              value: '+91 9876543210',
              description: 'Mon-Sun 10am-8pm IST',
            },
            {
              icon: MapPin,
              title: 'Visit Us',
              value: 'Kanta Bishunpura, Chandauli, UP',
              description: 'Showroom open by appointment',
            },
          ].map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50/50 border border-black/5 p-8 text-center"
              >
                <div className="inline-flex p-4 bg-black mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-black text-black mb-2 uppercase tracking-widest italic">
                  {method.title}
                </h3>
                <p className="text-black font-black text-xs mb-1 uppercase tracking-tighter">
                  {method.value}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {method.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-50/50 border border-black/5 p-8 sm:p-12"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-black text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">
                  Send us a Message
                </h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                  Fill in the form below and we'll get back to you soon
                </p>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex p-4 bg-black mb-6">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter italic">
                  Message Sent!
                </h3>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-black/5 px-4 py-4 text-black text-xs font-bold placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all uppercase tracking-widest"
                      placeholder="NAME"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-black/5 px-4 py-4 text-black text-xs font-bold placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all uppercase tracking-widest"
                      placeholder="EMAIL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border border-black/5 px-4 py-4 text-black text-xs font-bold placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all uppercase tracking-widest"
                    placeholder="HOW CAN WE HELP?"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
                    Message
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full bg-white border border-black/5 px-4 py-4 text-black text-xs font-bold placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all resize-none uppercase tracking-widest"
                    placeholder="TELL US MORE..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  className="w-full bg-black text-white py-5 px-6 font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SEND MESSAGE
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Response Time Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Clock className="w-4 h-4" />
            <span>Average response time: 2-4 hours</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
