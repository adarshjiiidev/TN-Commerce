"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingCart, User, LogOut, Menu, X, Globe, ChevronDown } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useCartStore } from '@/stores/cart'
import { useSearchParams } from 'next/navigation'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'New Arrivals', href: '/products?new=true' },
  { name: 'Men', href: '/products?category=men' },
  { name: 'Women', href: '/products?category=women' },
  { name: 'Sale', href: '/products?onSale=true', highlight: true },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const { itemCount, toggleCart } = useCartStore()
  const searchParams = useSearchParams()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check for auth query parameter on mount and when search params change
  useEffect(() => {
    const authParam = searchParams?.get('auth')
    if (authParam === 'signin') {
      setAuthModal('signin')
      window.history.replaceState({}, '', '/')
    } else if (authParam === 'signup') {
      setAuthModal('signup')
      window.history.replaceState({}, '', '/')
    }
  }, [searchParams])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-[#0d0d12]/80 backdrop-blur-xl border-b border-white/5 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center"
            >
              <span className="text-2xl font-black tracking-tight text-white font-horizon">
                Limit<span className="text-purple-500">//</span>Up
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    link.highlight
                      ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <Heart className="h-4 w-4" />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center gap-2 pl-1 pr-1 sm:pl-1 sm:pr-3 h-10 rounded-full bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200",
                  session?.user && "pr-4"
                )}
              >
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {(session?.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium">
                  {session ? (
                    ""
                  ) : (
                    <User className="h-4 w-4 m-2" />
                  )}
                </span>
                {session && <ChevronDown className="h-3 w-3 text-gray-400" />}
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl overflow-hidden border border-white/10 z-50 origin-top-right"
                  >
                    {session ? (
                      <>
                        <div className="p-4 border-b border-white/10 bg-white/5">
                          <p className="text-sm font-semibold text-white truncate font-heading">{session.user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <ShoppingBagIcon className="h-4 w-4" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="h-4 w-4" />
                            Wishlist
                          </Link>
                        </div>
                        <div className="p-2 border-t border-white/10">
                          <button
                            onClick={() => {
                              signOut()
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setAuthModal('signin')
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white font-medium hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            setAuthModal('signup')
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[8px]">+</div>
                          Create Account
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0d0d12]/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Mobile Nav Links */}
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block py-3 px-4 rounded-xl transition-colors font-medium text-lg",
                        link.highlight ? "text-red-400 bg-red-400/5" : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Globe className="h-6 w-6 text-purple-400 mb-2" />
                  <span className="text-sm text-gray-300">Contact</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Heart className="h-6 w-6 text-pink-400 mb-2" />
                  <span className="text-sm text-gray-300">Wishlist</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      <SignInModal
        isOpen={authModal === 'signin'}
        onClose={() => setAuthModal(null)}
        onSwitchToSignUp={() => setAuthModal('signup')}
      />
      <SignUpModal
        isOpen={authModal === 'signup'}
        onClose={() => setAuthModal(null)}
        onSwitchToSignIn={() => setAuthModal('signin')}
      />
    </header>
  )
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
  )
}
