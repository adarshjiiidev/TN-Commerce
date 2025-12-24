"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-white pt-24 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-black mb-4 uppercase tracking-tighter italic">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-bold uppercase text-[10px] tracking-widest">
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="SEARCH FAQS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-black/5 focus:outline-none focus:border-black/10 text-xs font-black text-black placeholder:text-gray-300 transition-all uppercase tracking-widest"
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
              className="border border-black/5 overflow-hidden bg-gray-50/50"
            >
              <div className="p-6 border-b border-black/5 bg-white">
                <h2 className="text-sm font-black text-black flex items-center uppercase tracking-widest italic">
                  <div className="p-2 bg-black mr-3">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  {category.category}
                </h2>
              </div>

              <div className="divide-y divide-black/5">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  return (
                    <div key={faqIndex}>
                      <motion.button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full px-6 py-5 text-left transition-colors hover:bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-black uppercase tracking-tight pr-4">{faq.question}</h3>
                          <motion.div
                            animate={{ rotate: openFAQ === globalIndex ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
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
                            <div className="px-6 pb-5 bg-white">
                              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed uppercase tracking-tighter">{faq.answer}</p>
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
          className="mt-16 p-8 sm:p-12 text-center bg-black border border-black"
        >
          <div className="inline-flex p-4 bg-white mb-6">
            <MessageCircle className="h-6 w-6 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Still have questions?</h2>
          <p className="text-gray-400 mb-8 font-bold uppercase text-[10px] tracking-widest">
            Can't find what you're looking for? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="contents">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </motion.button>
            </Link>
            <Link href="mailto:support@showroom_sasta.com" className="contents">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-transparent text-white border border-white/20 px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
