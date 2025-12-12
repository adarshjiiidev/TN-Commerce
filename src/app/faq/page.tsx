"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 5-7 business days and is free on orders over ₹1000. Express shipping takes 2-3 business days for ₹199."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order on our Track Your Order page."
        },
        {
          question: "Can I change or cancel my order?",
          answer: "You can cancel or modify your order within 2 hours of placing it. After that, please contact our customer service team."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer 30-day returns on all items. Items must be unworn, unwashed, and have original tags attached. Return shipping is free."
        },
        {
          question: "How do I return an item?",
          answer: "Contact us or log into your account to initiate a return. We'll provide a prepaid return label and instructions."
        },
        {
          question: "Can I exchange for a different size?",
          answer: "Yes! Size exchanges are free within 30 days. Color exchanges are subject to availability."
        }
      ]
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          question: "How do I find my size?",
          answer: "Check our Size Guide page for detailed measurements and fit information. When in doubt, size up for a more comfortable fit."
        },
        {
          question: "Are your t-shirts pre-shrunk?",
          answer: "Yes, all our t-shirts are pre-shrunk to minimize shrinkage after washing. Follow our care instructions for best results."
        },
        {
          question: "What materials do you use?",
          answer: "We use high-quality 100% cotton and cotton blends. Each product page lists the specific fabric composition."
        }
      ]
    },
    {
      category: "Account & Payment",
      questions: [
        {
          question: "Do I need an account to place an order?",
          answer: "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and speed up future checkouts."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Cash on delivery is available in select areas."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption and secure payment gateways to protect your information."
        }
      ]
    }
  ]

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-heading">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our products and services
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-lg text-white placeholder:text-gray-500 transition-all"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <h2 className="text-xl font-bold text-white flex items-center font-heading">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  {category.category}
                </h2>
              </div>

              <div className="divide-y divide-white/10">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  return (
                    <div key={faqIndex}>
                      <motion.button
                        onClick={() => toggleFAQ(globalIndex)}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        className="w-full px-6 py-5 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white pr-4">{faq.question}</h3>
                          <motion.div
                            animate={{ rotate: openFAQ === globalIndex ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          </motion.div>
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {openFAQ === globalIndex && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 bg-white/5">
                              <p className="text-gray-300">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 glass-card rounded-3xl p-8 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2 font-heading">Still have questions?</h2>
          <p className="text-gray-400 mb-6">
            Can't find what you're looking for? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-glow hover:shadow-glow-lg inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </motion.a>
            <motion.a
              href="mailto:support@limitup.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
