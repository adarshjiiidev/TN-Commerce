"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  User,
  Package,
  Heart,
  Settings,
  ShoppingBag,
  MapPin,
  CreditCard,
  Gift,
  ChevronRight,
  Calendar,
  Truck,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  Mail,
  Phone,
  Copy,
  Share2,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loading from '@/components/ui/loading'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import AddressBook from '@/components/dashboard/AddressBook'

interface Order {
  id: string
  orderNumber: string
  total: number
  items: number
  status: 'confirmed' | 'preparing' | 'picked_up' | 'delivered'
  estimatedDelivery: string
  deliveryTime: string
  date: string
}

interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
  inStock: boolean
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'wallet'
  last4?: string
  brand?: string
  balance?: number
  isDefault: boolean
}

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

interface UserProfile {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = (searchParams.get('section') || 'orders') as 'profile' | 'list' | 'orders' | 'payments' | 'addresses'
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous' | 'scheduled'>('upcoming')

  // Real-time state management
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '', email: '', phone: '', dateOfBirth: '', gender: '',
    notifications: { email: true, sms: false, push: true }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [referralCode, setReferralCode] = useState('')
  const [referralStats, setReferralStats] = useState({ totalReferrals: 0, earnings: 0 })

  // Load user data on mount
  useEffect(() => {
    if (session?.user) {
      loadUserData()
    }
  }, [session])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      // Initialize with session data
      setUserProfile({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        notifications: { email: true, sms: false, push: true }
      })

      // Generate referral code based on user email
      const code = session?.user?.email?.split('@')[0]?.toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
      setReferralCode(code || '')
      setReferralStats({ totalReferrals: 0, earnings: 0 })

      // Load data (in a real app, these would be API calls)
      await Promise.all([
        loadOrders(),
        loadWishlist(),
        loadPaymentMethods(),
        loadAddresses()
      ])
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrders = async () => {
    // In a real app, this would be an API call
    setOrders([])
  }

  const loadWishlist = async () => {
    setWishlist([])
  }

  const loadPaymentMethods = async () => {
    setPaymentMethods([])
  }

  const loadAddresses = async () => {
    setAddresses([])
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      isDefault: addresses.length === 0
    }
    setAddresses([...addresses, newAddress])
  }

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  const addPaymentMethod = () => {
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: '0000',
      brand: 'Visa',
      isDefault: paymentMethods.length === 0
    }
    setPaymentMethods([...paymentMethods, newPayment])
  }

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id))
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Loading className="h-64" text="Loading dashboard..." />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic mb-4">Access Denied</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Please sign in to access your dashboard.</p>
          <Button className="bg-black text-white hover:bg-gray-900 rounded-none px-8 py-6 text-[10px] font-black uppercase tracking-widest">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { key: 'profile', icon: User, label: 'My Profile' },
    { key: 'list', icon: Heart, label: 'My List' },
    { key: 'orders', icon: Package, label: 'My Orders' },
    { key: 'payments', icon: CreditCard, label: 'Payments', badge: '₹10' },
    { key: 'addresses', icon: MapPin, label: 'Address Book' }
  ] as const

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600'
      case 'preparing': return 'text-yellow-600'
      case 'picked_up': return 'text-orange-600'
      case 'delivered': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return <div className="w-2 h-2 bg-blue-600" />
      case 'preparing': return <div className="w-2 h-2 bg-yellow-600" />
      case 'picked_up': return <div className="w-2 h-2 bg-orange-600" />
      case 'delivered': return <div className="w-2 h-2 bg-green-600" />
      default: return <div className="w-2 h-2 bg-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-80 min-h-screen p-8 border-r border-black/[0.03]"
        >
          {/* Profile Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4 mb-12"
          >
            <div className="w-14 h-14 bg-black flex items-center justify-center rounded-none group overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={56}
                  height={56}
                  className="grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-black uppercase tracking-tighter italic leading-none">{session.user.name}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 truncate max-w-[150px]">{session.user.email}</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarItems.map((item, idx) => {
              const isActive = section === item.key
              return (
                <motion.button
                  key={item.key}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => router.push(`/dashboard?section=${item.key}`)}
                  className={`w-full text-left flex items-center justify-between p-4 transition-all ${isActive
                    ? 'bg-black text-white'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-black'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {'badge' in item && item.badge && (
                      <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 ${isActive ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </div>
                </motion.button>
              )
            })}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-12">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic mb-2">
              {section === 'orders' && 'My Orders'}
              {section === 'profile' && 'My Profile'}
              {section === 'list' && 'My List'}
              {section === 'payments' && 'Payments'}
              {section === 'addresses' && 'Address Book'}
            </h1>
          </motion.div>

          {/* Orders Section */}
          {section === 'orders' && (
            <div>
              <div className="flex border-b border-black/[0.03] mb-10">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'upcoming'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                  Upcoming Orders (1)
                </button>
                <button
                  onClick={() => setActiveTab('previous')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ml-8 ${activeTab === 'previous'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                  Previous Orders (2)
                </button>
                <button
                  onClick={() => setActiveTab('scheduled')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ml-8 ${activeTab === 'scheduled'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                >
                  Scheduled Orders (0)
                </button>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-50/50 border border-black/[0.03] p-24 text-center"
                  >
                    <Package className="mx-auto h-16 w-16 text-gray-200 mb-6" />
                    <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">No orders yet</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">When you place your first order, it will appear here.</p>
                    <Link href="/products">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Start Shopping
                      </motion.button>
                    </Link>
                  </motion.div>
                ) : (
                  orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-black/[0.03] p-8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                          {/* Order Icon */}
                          <div className="w-16 h-16 bg-gray-50 flex items-center justify-center">
                            <Package className="w-6 h-6 text-black" />
                          </div>

                          {/* Order Details */}
                          <div>
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-sm font-black text-black uppercase tracking-widest">Order no {order.orderNumber}</h3>
                              <span className="text-xl font-black text-black tracking-tighter">₹{order.total.toFixed(2)}</span>
                            </div>

                            {/* Status Progress */}
                            <div className="flex items-center space-x-6 mb-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon('confirmed')}
                                <span className="text-[10px] font-black uppercase tracking-widest text-black">Confirmed</span>
                              </div>
                              <div className="h-px w-8 bg-black/[0.03]"></div>
                              <div className="flex items-center space-x-2 opacity-50">
                                {getStatusIcon('preparing')}
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preparing</span>
                              </div>
                            </div>

                            {/* Order Info */}
                            <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-400 font-bold">
                              <span>{order.items} Items</span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              <span>{order.deliveryTime}</span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                              <span className="flex items-center space-x-1">
                                <Truck className="h-3 w-3" />
                                <span>{order.estimatedDelivery}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] text-gray-400 hover:text-black transition-all">
                            Cancel Order
                          </button>
                          <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 transition-all">
                            Order Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Section */}
          {section === 'profile' && (
            <div className="max-w-4xl space-y-12">
              <div className="bg-white border border-black/[0.03] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Personal Information</h2>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] hover:bg-black hover:text-white transition-all"
                  >
                    {isEditing ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                    <input
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-gray-50 border border-black/[0.03] p-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                    <input value={userProfile.email} disabled className="w-full bg-gray-50 border border-black/[0.03] p-4 text-sm font-bold text-black opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                    <input
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+91 00000 00000"
                      className="w-full bg-gray-50 border border-black/[0.03] p-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date of Birth</label>
                    <input
                      type="date"
                      value={userProfile.dateOfBirth}
                      onChange={(e) => setUserProfile({ ...userProfile, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-gray-50 border border-black/[0.03] p-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/[0.03] p-10">
                <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-10">Account Actions</h2>
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-8 border-b border-black/[0.03]">
                    <div>
                      <h4 className="text-sm font-black text-black uppercase tracking-widest mb-1">Change Password</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Update your security credentials</p>
                    </div>
                    <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] hover:bg-black hover:text-white transition-all">
                      Update
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-black uppercase tracking-widest mb-1">Sign Out</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logout from this device</p>
                    </div>
                    <button onClick={() => signOut()} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 transition-all">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Section */}
          {section === 'list' && (
            <div className="space-y-8">
              {wishlist.length === 0 ? (
                <div className="bg-gray-50/50 border border-black/[0.03] p-24 text-center">
                  <Heart className="mx-auto h-16 w-16 text-gray-200 mb-6" />
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">Your wishlist is empty</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">Start adding items you love to keep track of them.</p>
                  <Link href="/products">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-white border border-black/[0.03] p-6 group">
                      <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        )}
                      </div>
                      <h3 className="text-[10px] font-black text-black uppercase tracking-widest mb-2 leading-none">{item.name}</h3>
                      <p className="text-xl font-black text-black tracking-tighter italic mb-6">₹{item.price}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all">
                          Add to Cart
                        </button>
                        <button className="p-4 border border-black/[0.03] text-gray-400 hover:text-black transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payments Section */}
          {section === 'payments' && (
            <div className="max-w-4xl space-y-8">
              <div className="bg-white border border-black/[0.03] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Payment Methods</h2>
                  <button onClick={addPaymentMethod} className="flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] hover:bg-black hover:text-white transition-all">
                    <Plus className="w-3 h-3" />
                    New Method
                  </button>
                </div>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-200 mb-6" />
                    <h3 className="text-sm font-black text-black uppercase tracking-widest mb-1">No payment methods</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add a method to make purchases easier.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-6 bg-gray-50 border border-black/[0.03]">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-black text-white">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-black uppercase tracking-widest">
                              {method.brand} •••• {method.last4}
                            </p>
                            {method.isDefault && (
                              <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Default Method</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removePaymentMethod(method.id)}
                          className="p-3 text-gray-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Addresses Section */}
          {section === 'addresses' && <AddressBook />}

          {/* Admin Badge */}
          {session.user.isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-20"
            >
              <div className="bg-black p-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-1">Admin Access</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    You have administrative privileges for this platform.
                  </p>
                </div>
                <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all font-bold">
                  <Link href="/admin">Admin Panel</Link>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Loading className="h-64" text="Loading dashboard..." />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'

