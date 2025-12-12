"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, ShoppingCart, Shield, AlertTriangle, Scale, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      content: [
        'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement',
        'These terms apply to all visitors, users, and others who access or use the service',
        'If you do not agree to abide by the above, please do not use this service',
        'We reserve the right to modify these terms at any time without prior notice'
      ]
    },
    {
      title: 'Use License',
      icon: Scale,
      gradient: 'from-purple-500 to-pink-500',
      content: [
        'Permission is granted to temporarily download one copy of the materials on Limit//Up\'s website for personal, non-commercial transitory viewing only',
        'This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials',
        'Use the materials for any commercial purpose or for any public display',
        'Attempt to reverse engineer any software contained on the website',
        'Remove any copyright or other proprietary notations from the materials'
      ]
    },
    {
      title: 'Product Information',
      icon: ShoppingCart,
      gradient: 'from-orange-500 to-red-500',
      content: [
        'We strive to provide accurate product descriptions, images, and pricing',
        'Colors may vary slightly due to monitor settings and photography',
        'We reserve the right to correct any errors, inaccuracies, or omissions',
        'Product availability is subject to change without notice',
        'Prices are subject to change without prior notice'
      ]
    },
    {
      title: 'Order Terms',
      icon: ShoppingCart,
      gradient: 'from-green-500 to-emerald-500',
      content: [
        'All orders are subject to acceptance and availability',
        'We reserve the right to refuse or cancel any order for any reason',
        'Payment must be received before order processing',
        'Shipping costs and delivery times are estimates only',
        'Risk of loss and title for items pass to you upon delivery'
      ]
    },
    {
      title: 'Privacy and Data',
      icon: Shield,
      gradient: 'from-cyan-500 to-blue-500',
      content: [
        'Your privacy is protected in accordance with our Privacy Policy',
        'We collect information necessary to process orders and improve services',
        'Personal information is not sold or shared with unauthorized third parties',
        'Cookies may be used to enhance your browsing experience',
        'You have rights regarding your personal data as outlined in our Privacy Policy'
      ]
    },
    {
      title: 'Prohibited Uses',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-rose-500',
      content: [
        'Violate any applicable laws or regulations',
        'Transmit any worms, viruses, or any code of a destructive nature',
        'Collect or track personal information of others',
        'Spam, phish, pharm, pretext, spider, crawl, or scrape',
        'Use the service for any obscene or immoral purpose',
        'Interfere with or circumvent security features of the service'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#0d0d12] py-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
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
            <span className="gradient-text">Terms of Service</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Please read these terms and conditions carefully before using our service.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>Last updated: August 31, 2025</span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 sm:p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-6 font-heading">Welcome to Limit//Up</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                These Terms of Service ("Terms") govern your use of our website located at www.limitup.com
                and any related services provided by Limit//Up ("we," "us," or "our").
              </p>
              <p>
                Please read these Terms carefully before using our service. By accessing or using our service,
                you agree to be bound by these Terms. If you disagree with any part of these terms, then you
                may not access the service.
              </p>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-8 hover-glow transition-all"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.gradient} shadow-lg`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2 font-heading">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-4 ml-3">
                  {section.content.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      className="flex items-start gap-3 text-gray-400 group"
                      whileHover={{ x: 4, color: '#e5e7eb' }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r ${section.gradient}`} />
                      <span className="transition-colors">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 font-heading">Governing Law</h2>
            <p className="text-gray-400 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the
              jurisdiction in which Limit//Up operates, and you irrevocably submit to the exclusive jurisdiction
              of the courts in that state or location.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="glass-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20"
          >
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-glow">
              <FileText className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 font-heading">Questions About These Terms?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              If you have any questions or concerns about these Terms of Service, please don't hesitate to reach out to our legal team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:legal@limitup.com">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Email Legal Team
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors"
                >
                  Contact Support
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
