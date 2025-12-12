"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cookie, Settings, BarChart3, Shield, Target, Clock, ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    functional: false
  })

  const [saved, setSaved] = useState(false)

  const handlePreferenceChange = (type: string) => {
    if (type === 'essential') return // Can't disable essential cookies

    // @ts-ignore
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }))
  }

  const cookieTypes = [
    {
      title: 'Essential Cookies',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Shopping cart functionality', 'Security features', 'Login sessions', 'Form submissions'],
      required: true,
      type: 'essential'
    },
    {
      title: 'Analytics Cookies',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Page views and traffic sources', 'Popular products and pages', 'User journey analysis', 'Performance metrics'],
      required: false,
      type: 'analytics'
    },
    {
      title: 'Marketing Cookies',
      icon: Target,
      gradient: 'from-orange-500 to-red-500',
      description: 'These cookies are used to deliver relevant advertisements and track campaign effectiveness.',
      examples: ['Personalized product recommendations', 'Retargeting ads', 'Social media integration', 'Email campaign tracking'],
      required: false,
      type: 'marketing'
    },
    {
      title: 'Functional Cookies',
      icon: Settings,
      gradient: 'from-green-500 to-emerald-500',
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Region settings', 'Customized content', 'Remember preferences'],
      required: false,
      type: 'functional'
    }
  ]

  const handleSavePreferences = () => {
    // In a real app, this would save to localStorage and update consent
    console.log('Cookie preferences saved:', preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] py-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
            <span className="gradient-text">Cookie Policy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Learn about how we use cookies to improve your browsing experience.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>Last updated: August 31, 2025</span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* What Are Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Cookie className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">What Are Cookies?</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p>
                We use cookies to enhance your browsing experience, analyze website traffic, personalize content,
                and provide social media features. You can control cookie settings using the controls below.
              </p>
            </div>
          </motion.div>

          {/* Cookie Types */}
          <div className="grid grid-cols-1 gap-6">
            {cookieTypes.map((cookieType, index) => (
              <motion.div
                key={cookieType.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-8 transition-all hover-glow"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${cookieType.gradient} shadow-lg`}>
                      <cookieType.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white font-heading">{cookieType.title}</h2>
                      {cookieType.required && (
                        <span className="inline-block bg-white/10 text-blue-300 text-xs px-2 py-1 rounded-full mt-1 border border-blue-500/30">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  {!cookieType.required && (
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[cookieType.type as keyof typeof preferences]}
                        onChange={() => handlePreferenceChange(cookieType.type)}
                        className="sr-only"
                      />
                      <div className={`relative w-12 h-7 rounded-full transition-colors ${preferences[cookieType.type as keyof typeof preferences]
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-white/10'
                        }`}>
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${preferences[cookieType.type as keyof typeof preferences] ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                      </div>
                    </label>
                  )}
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed border-b border-white/5 pb-6">
                  {cookieType.description}
                </p>

                <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider opacity-80">Examples</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cookieType.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r ${cookieType.gradient}`} />
                      <span className="text-gray-400 text-sm">{example}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Cookie Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 font-heading">Managing Your Cookie Preferences</h2>
            <p className="text-gray-400 mb-8 max-w-3xl">
              You can manage your cookie preferences using the toggles above. Additionally, most browsers allow you to refuse cookies
              or alert you when cookies are being sent. Check your browser's help section for instructions.
            </p>

            <div className="flex justify-center">
              <motion.button
                onClick={handleSavePreferences}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2"
              >
                {saved ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Cookie Preferences
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="glass-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20"
          >
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 shadow-glow">
              <Cookie className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 font-heading">Questions About Cookies?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              If you have any questions about our use of cookies, please don't hesitate to reach out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:privacy@limitup.com">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Email Privacy Team
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
