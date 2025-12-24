"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Users, Mail, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      content: [
        'Personal information you provide (name, email, phone number, address)',
        'Payment information (processed securely by our payment partners)',
        'Account information (username, password, preferences)',
        'Purchase history and product preferences',
        'Website usage data and analytics'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      gradient: 'from-purple-500 to-pink-500',
      content: [
        'Process and fulfill your orders',
        'Provide customer support and respond to inquiries',
        'Send order confirmations and shipping updates',
        'Improve our products and services',
        'Personalize your shopping experience',
        'Comply with legal obligations'
      ]
    },
    {
      title: 'Information Sharing',
      icon: Lock,
      gradient: 'from-orange-500 to-red-500',
      content: [
        'We do not sell or rent your personal information to third parties',
        'We may share information with service providers (shipping, payment processing)',
        'We may disclose information if required by law',
        'Anonymous, aggregated data may be used for analytics',
        'All third parties are bound by confidentiality agreements'
      ]
    },
    {
      title: 'Data Security',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure servers with regular security audits',
        'Access controls and authentication measures',
        'Regular security training for all employees',
        'Incident response procedures for any security breaches'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-black mb-6 uppercase tracking-tighter italic">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 text-xs text-gray-400">
            <Clock className="h-4 w-4 text-black" />
            <span className="font-bold uppercase tracking-widest">Last updated: August 31, 2025</span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 sm:p-10 bg-gray-50/50 border border-black/5 relative overflow-hidden group"
          >
            <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-tighter italic">Introduction</h2>
            <div className="space-y-4 text-gray-500 font-semibold leading-relaxed">
              <p>
                At Showroom Se Bhi Sasta, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
                our website or make a purchase from us.
              </p>
              <p>
                By using our website or services, you agree to the terms of this Privacy Policy. If you do not agree
                with the practices described in this policy, please do not use our website.
              </p>
            </div>
          </motion.div>

          {/* Policy Sections */}
          <div className="grid grid-cols-1 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="p-8 bg-gray-50/50 border border-black/5"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 bg-black shadow-lg`}>
                    <section.icon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-black mt-2 uppercase tracking-tighter italic">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-4 ml-3">
                  {section.content.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      className="flex items-start gap-3 text-gray-500 font-semibold"
                    >
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-black" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="p-8 sm:p-10 bg-gray-50/50 border border-black/5"
          >
            <h2 className="text-xl font-black text-black mb-6 uppercase tracking-tighter italic">Your Rights</h2>
            <p className="text-gray-400 mb-8 font-bold uppercase text-[10px] tracking-widest">
              You have the following rights regarding your personal information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Access & Correction', desc: 'You can access and update your personal information through your account settings or by contacting us.' },
                { title: 'Data Deletion', desc: 'You can request deletion of your personal data, subject to certain legal obligations.' },
                { title: 'Opt-Out', desc: 'You can opt out of marketing communications at any time through email preferences.' },
                { title: 'Data Portability', desc: 'You can request a copy of your data in a machine-readable format.' }
              ].map((right, idx) => (
                <div key={idx} className="bg-white p-5 border border-black/5 hover:border-black/10 transition-colors">
                  <h3 className="font-black text-black text-sm uppercase mb-2 italic tracking-tight">{right.title}</h3>
                  <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                    {right.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="p-8 sm:p-12 text-center bg-black border border-black"
          >
            <div className="inline-flex p-4 bg-white mb-6">
              <Mail className="h-6 w-6 text-black" />
            </div>

            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Questions About Privacy?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm font-semibold">
              If you have any questions about this Privacy Policy or our data practices, please don't hesitate to reach out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:privacy@showroom_sasta.com">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-black px-12 py-4 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Email Privacy Team
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent text-white border border-white/20 px-12 py-4 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
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
