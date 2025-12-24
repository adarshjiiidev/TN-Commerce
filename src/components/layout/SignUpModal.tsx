"use client"

import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Chrome, Eye, EyeOff, CheckCircle, ArrowLeft, Clock, X, User, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface SignUpModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToSignIn: () => void
}

export default function SignUpModal({
    isOpen,
    onClose,
    onSwitchToSignIn
}: SignUpModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [step, setStep] = useState<'signup' | 'verify-otp'>('signup')
    const [otp, setOtp] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [resendLoading, setResendLoading] = useState(false)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required')
            setIsLoading(false)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.error || 'Failed to send verification code')
                setIsLoading(false)
                return
            }

            setStep('verify-otp')
            setCountdown(600)
            setIsLoading(false)

        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit code')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    code: otp,
                    name: formData.name,
                    password: formData.password,
                    purpose: 'email_verification'
                }),
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.error || 'Invalid verification code')
                setIsLoading(false)
                return
            }

            setSuccess(true)

            setTimeout(async () => {
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                })

                if (result?.ok) {
                    onClose()
                    window.location.href = '/dashboard'
                }
            }, 1500)

        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setResendLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    purpose: 'email_verification'
                }),
            })

            const data = await response.json()

            if (data.success) {
                setCountdown(600)
                setOtp('')
            } else {
                setError(data.error || 'Failed to resend code')
            }
        } catch (error) {
            setError('Failed to resend verification code')
        } finally {
            setResendLoading(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleGoogleSignUp = async () => {
        await signIn('google', { callbackUrl: '/dashboard' })
    }

    const resetModal = () => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
        setStep('signup')
        setOtp('')
        setError('')
        setSuccess(false)
        setCountdown(0)
        setShowPassword(false)
        setShowConfirmPassword(false)
    }

    const handleClose = () => {
        resetModal()
        onClose()
    }

    if (success) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md bg-white border border-black/5 text-black p-0 shadow-2xl overflow-hidden">

                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black transition-all z-10"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>

                    <div className="relative p-8 text-center pt-12">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-black"
                        >
                            <CheckCircle className="h-8 w-8 text-white" />
                        </motion.div>
                        <DialogTitle className="text-2xl font-black mb-3 text-black uppercase tracking-tighter italic">Success</DialogTitle>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Welcome to Limit//Up.<br />Signing you in...
                        </p>
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
                        <DialogTitle className="text-3xl font-black text-center text-black mb-2 uppercase tracking-tighter italic">
                            {step === 'signup' ? 'Join Us' : 'Verify'}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {step === 'signup'
                                ? 'Join the community'
                                : `Code sent to ${formData.email}`
                            }
                        </p>
                    </div>
                </DialogHeader>

                <div className="p-8 pt-2 space-y-6 relative z-10">
                    {step === 'signup' ? (
                        <>
                            {/* Google Sign Up */}
                            <Button
                                onClick={handleGoogleSignUp}
                                disabled={isLoading}
                                className="w-full bg-gray-50 text-black hover:bg-gray-100 border border-black/5 h-12 rounded-none font-bold uppercase tracking-widest text-xs transition-all"
                            >
                                <Chrome className="mr-2 h-4 w-4" />
                                Google Sign Up
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-black/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                    <span className="bg-white px-3 text-gray-400 font-bold">Or</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 bg-gray-50 border-black/5 text-black placeholder:text-gray-400 focus:border-black/20 focus:bg-white h-12 rounded-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 bg-gray-50 border-black/5 text-black placeholder:text-gray-400 focus:border-black/20 focus:bg-white h-12 rounded-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full pl-4 pr-10 bg-gray-50 border-black/5 text-black placeholder:text-gray-400 focus:border-black/20 focus:bg-white h-12 rounded-none transition-all text-sm"
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

                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                placeholder="Confirm"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full pl-4 pr-10 bg-gray-50 border-black/5 text-black placeholder:text-gray-400 focus:border-black/20 focus:bg-white h-12 rounded-none transition-all text-sm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">Min. 6 characters</p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black hover:bg-gray-900 text-white border-0 h-14 rounded-none font-black uppercase tracking-widest text-xs transition-all mt-4"
                                >
                                    {isLoading ? (
                                        'Processing...'
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </form>

                            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 pb-2">
                                Already member?{' '}
                                <button
                                    type="button"
                                    onClick={onSwitchToSignIn}
                                    className="font-black text-black hover:underline transition-colors"
                                >
                                    Sign In
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            {/* OTP Verification Form */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gray-50 border border-black/5"
                                >
                                    <Mail className="h-8 w-8 text-black" />
                                </motion.div>
                            </div>

                            <form onSubmit={handleOTPSubmit} className="space-y-6">
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

                                <div>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                            setOtp(value)
                                            setError('')
                                        }}
                                        className="w-full text-center text-4xl font-black tracking-[0.5em] bg-gray-50 border-black/5 text-black placeholder:text-gray-200 focus:border-black/20 focus:bg-white h-20 rounded-none shadow-inner"
                                        maxLength={6}
                                        autoFocus
                                        required
                                    />
                                </div>

                                {countdown > 0 && (
                                    <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 py-3">
                                        <Clock className="h-3 w-3 mr-2 text-black" />
                                        Expire in <span className="ml-1 text-black font-black">{formatTime(countdown)}</span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="w-full bg-black hover:bg-gray-900 text-white border-0 h-14 rounded-none font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </Button>
                            </form>

                            <div className="text-center space-y-4 pt-4 border-t border-white/5">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    No code?{' '}
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={resendLoading || countdown > 540}
                                        className="font-black text-black hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend'}
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        setStep('signup')
                                        setOtp('')
                                        setError('')
                                        setCountdown(0)
                                    }}
                                    className="flex items-center justify-center w-full text-[10px] font-black uppercase tracking-widest text-black hover:underline transition-colors gap-2 group"
                                >
                                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                                    Change Email
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
