"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Chrome, ArrowLeft, Eye, EyeOff, X, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
  callbackUrl?: string
}

export default function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  callbackUrl = '/'
}: SignInModalProps) {
  const [authMode, setAuthMode] = useState<'password' | 'email'>('password')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes('verify your email')) {
          setError('Please verify your email before signing in.')
        } else {
          setError('Invalid email or password')
        }
      } else if (result?.ok) {
        onClose()
        window.location.href = callbackUrl
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email: formData.email,
        callbackUrl,
        redirect: false,
      })

      if (result?.ok) {
        setEmailSent(true)
      }
    } catch (error) {
      console.error('Email sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Google sign in error:', error)
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setEmailSent(false)
    setAuthMode('password')
    setFormData({ email: '', password: '' })
    setError('')
    setShowPassword(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (emailSent) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-[#0d0d12]/90 backdrop-blur-3xl border border-white/10 text-white p-0 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />

          <div className="relative p-6 pt-12 text-center">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-glow"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>

            <DialogTitle className="text-2xl font-bold mb-3 text-white font-heading">Check Your Inbox</DialogTitle>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              We've sent a magic link to <br />
              <span className="text-white font-medium bg-white/5 px-2 py-1 rounded-md border border-white/5">{formData.email}</span>
            </p>

            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 h-12 rounded-xl"
              onClick={() => setEmailSent(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[#0d0d12]/90 backdrop-blur-3xl border border-white/10 text-white p-0 gap-0 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        <DialogHeader className="p-8 pb-4 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <DialogTitle className="text-3xl font-bold text-center text-white mb-2 font-heading tracking-tight">
                Welcome to Limit<span className="text-purple-500">//</span>Up
              </DialogTitle>
              <p className="text-sm text-gray-400">
                Enter your details to access your account
              </p>
            </motion.div>
          </div>
        </DialogHeader>

        <div className="p-8 pt-2 space-y-6 relative z-10">
          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-100 border-0 h-12 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition-all"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-[#0e0e14] px-3 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setAuthMode('password')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                authMode === 'password' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
              )}
            >
              Password
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                authMode === 'email' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
              )}
            >
              Magic Link
            </button>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <form onSubmit={authMode === 'password' ? handlePasswordSignIn : handleEmailSignIn} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/10 h-12 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              {authMode === 'password' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-medium text-gray-400">Password</label>
                    <a href="/auth/reset-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/10 h-12 rounded-xl transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.email || (authMode === 'password' && !formData.password)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 rounded-xl font-bold shadow-lg hover:shadow-purple-500/25 transition-all mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                authMode === 'password' ? 'Sign In' : 'Send Magic Link'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 pb-2">
            New here?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="font-bold text-white hover:text-purple-400 transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
