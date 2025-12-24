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
        <DialogContent className="sm:max-w-md bg-white border border-black/5 text-black p-0 overflow-hidden shadow-2xl">

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
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-black"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>

            <DialogTitle className="text-2xl font-black mb-3 text-black uppercase tracking-tighter italic">Check Your Inbox</DialogTitle>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
              We've sent a magic link to <br />
              <span className="text-black font-bold bg-gray-50 px-2 py-1 border border-black/5">{formData.email}</span>
            </p>

            <Button
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-900 h-14 rounded-none font-bold uppercase tracking-widest text-xs"
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
      <DialogContent className="sm:max-w-md bg-white border border-black/5 text-black p-0 gap-0 shadow-2xl overflow-hidden">

        <DialogHeader className="p-8 pb-4 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <DialogTitle className="text-3xl font-black text-center text-black mb-2 uppercase tracking-tighter italic">
                Limit<span className="text-gray-400">//</span>Up
              </DialogTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Access your account
              </p>
            </motion.div>
          </div>
        </DialogHeader>

        <div className="p-8 pt-2 space-y-6 relative z-10">
          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-gray-50 text-black hover:bg-gray-100 border border-black/5 h-12 rounded-none font-bold uppercase tracking-widest text-xs transition-all"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-white px-3 text-gray-400 font-bold">Or</span>
            </div>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex bg-gray-50 p-1 border border-black/5">
            <button
              onClick={() => setAuthMode('password')}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                authMode === 'password' ? "bg-black text-white" : "text-gray-400 hover:text-black"
              )}
            >
              Password
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                authMode === 'email' ? "bg-black text-white" : "text-gray-400 hover:text-black"
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
                className="p-3 text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 flex items-center gap-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <form onSubmit={authMode === 'password' ? handlePasswordSignIn : handleEmailSignIn} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 bg-gray-50 border-black/5 text-black placeholder:text-gray-400 focus:border-black/20 focus:bg-white h-12 rounded-none transition-all"
                    required
                  />
                </div>
              </div>

              {authMode === 'password' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                    <a href="/auth/reset-password" className="text-[10px] font-black uppercase tracking-widest text-black hover:underline transition-colors">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-10 bg-gray-50 border-black/5 text-black placeholder:text-gray-400 focus:border-black/20 focus:bg-white h-12 rounded-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
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
              className="w-full bg-black hover:bg-gray-900 text-white border-0 h-14 rounded-none font-black uppercase tracking-widest text-xs transition-all mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                authMode === 'password' ? 'Sign In' : 'Send Magic Link'
              )}
            </Button>
          </form>

          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 pb-2">
            No account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="font-black text-black hover:underline transition-colors"
            >
              Create One
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
