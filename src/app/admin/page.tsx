'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  Users,
  DollarSign,
  Tag,
  Star,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  LayoutDashboard,
  Settings as SettingsIcon,
  FileText,
  BarChart3,
  FolderOpen,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statCards = [
  {
    title: 'Total Products',
    key: 'totalProducts' as const,
    icon: Package,
    gradient: 'from-vibrant-purple to-vibrant-pink',
    bgGlow: 'shadow-glow',
  },
  {
    title: 'Total Users',
    key: 'totalUsers' as const,
    icon: Users,
    gradient: 'from-vibrant-cyan to-vibrant-blue',
    bgGlow: 'shadow-glow-cyan',
    trendKey: 'userTrend' as const
  },
  {
    title: 'Total Revenue',
    key: 'totalRevenue' as const,
    trendKey: 'revenueTrend' as const,
    icon: DollarSign,
    gradient: 'from-vibrant-orange to-vibrant-pink',
    bgGlow: 'shadow-glow-pink',
    prefix: '₹'
  },
  {
    title: 'On Sale',
    key: 'onSaleProducts' as const,
    icon: Tag,
    gradient: 'from-vibrant-pink to-vibrant-purple',
    bgGlow: 'shadow-glow',
  },
]

const secondaryStats = [
  {
    title: 'Featured Products',
    key: 'featuredProducts' as const,
    icon: Star,
  },
  {
    title: 'Out of Stock',
    key: 'outOfStockProducts' as const,
    icon: AlertTriangle,
  },
  {
    title: 'Total Orders',
    key: 'totalOrders' as const,
    trendKey: 'orderTrend' as const,
    icon: ShoppingCart,
  },
]

const quickActions = [
  {
    title: 'Product Management',
    description: 'Manage your product catalog, add new items, update inventory.',
    icon: Package,
    actions: [
      { label: 'Manage Products', href: '/admin/products', variant: 'primary' as const },
      { label: 'Add New Product', href: '/admin/products/add', variant: 'success' as const },
      { label: 'Manage Sales', href: '/admin/sales', variant: 'danger' as const },
    ],
  },
  {
    title: 'User Management',
    description: 'View and manage user accounts, admin permissions.',
    icon: Users,
    actions: [
      { label: 'Manage Users', href: '/admin/users', variant: 'primary' as const },
      { label: 'Admin Users', href: '/admin/users/admins', variant: 'secondary' as const },
    ],
  },
  {
    title: 'Order Management',
    description: 'Track orders, update status, manage fulfillment.',
    icon: ShoppingCart,
    actions: [
      { label: 'Manage Orders', href: '/admin/orders', variant: 'primary' as const },
      { label: 'Pending Orders', href: '/admin/orders/pending', variant: 'warning' as const },
    ],
  },
  {
    title: 'Analytics',
    description: 'View sales reports, analytics, and insights.',
    icon: TrendingUp,
    actions: [
      { label: 'View Analytics', href: '/admin/analytics', variant: 'primary' as const },
      { label: 'Sales Reports', href: '/admin/reports', variant: 'secondary' as const },
    ],
  },
  {
    title: 'Categories',
    description: 'Manage product categories and organization.',
    icon: FolderOpen,
    actions: [
      { label: 'Manage Categories', href: '/admin/categories', variant: 'primary' as const },
      { label: 'Add Category', href: '/admin/categories/add', variant: 'success' as const },
    ],
  },
  {
    title: 'Banner Management',
    description: 'Manage homepage slideshow banners and promotional content.',
    icon: ImageIcon,
    actions: [
      { label: 'Manage Banners', href: '/admin/banners', variant: 'primary' as const },
    ],
  },
  {
    title: 'Flash Sale',
    description: 'Control flash sale visibility, timing, and content.',
    icon: Tag,
    actions: [
      { label: 'Flash Sale Settings', href: '/admin/flash-sale', variant: 'danger' as const },
    ],
  },
]

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalUsers: 0,
    userTrend: 0,
    totalProducts: 0,
    productTrend: 0,
    totalInventoryValue: 0,
    featuredProducts: 0,
    onSaleProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    orderTrend: 0,
    totalRevenue: 0,
    revenueTrend: 0,
    totalCategories: 0,
    categoryTrend: 0
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    // Fetch admin stats
    fetchAdminStats()
  }, [session, status])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        console.error('Failed to fetch stats:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user.isAdmin) {
    return null // Will redirect
  }

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-black text-white hover:bg-gray-900 border border-transparent'
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 border border-transparent'
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 border border-transparent'
      case 'warning':
        return 'bg-amber-500 text-white hover:bg-amber-600 border border-transparent'
      case 'secondary':
        return 'bg-gray-50 border border-black/[0.03] text-black hover:bg-black hover:text-white'
      default:
        return 'bg-gray-50 border border-black/[0.03] text-black hover:bg-black hover:text-white'
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-black/[0.03]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-10">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 bg-black flex items-center justify-center"
              >
                <LayoutDashboard className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Admin Dashboard</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                  Access Level: <span className="text-black">Administrator</span> — {session.user.name}
                </p>
              </div>
            </div>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Back to Store
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            const value = (stats as any)[stat.key]
            const trend = (stat as any).trendKey ? (stats as any)[(stat as any).trendKey] : 0
            const displayValue = stat.prefix ? `${stat.prefix}${value.toLocaleString()}` : value
            const isPositive = trend >= 0

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-gray-50/50 border border-black/[0.03] p-8 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="p-3 bg-black text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  {(stat as any).trendKey && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                      className={cn(
                        "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                        isPositive ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{isPositive ? '+' : ''}{trend}%</span>
                    </motion.div>
                  )}
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.title}</h3>
                <p className="text-4xl font-black text-black tracking-tighter italic leading-none">{displayValue}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {secondaryStats.map((stat, index) => {
            const Icon = stat.icon
            const value = (stats as any)[stat.key]

            return (
              <motion.div
                key={stat.key}
                whileHover={{ y: -2 }}
                className="bg-gray-50/50 border border-black/[0.03] p-8 flex items-center gap-6 cursor-pointer"
              >
                <div className="p-3 bg-black text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.title}</h3>
                  <p className="text-3xl font-black text-black tracking-tighter italic leading-none">{value}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {quickActions.map((action, index) => {
              const Icon = action.icon

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-gray-50/50 border border-black/[0.03] p-8 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-black text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">{action.title}</h3>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 leading-relaxed">{action.description}</p>
                  <div className="space-y-2">
                    {action.actions.map((btn) => (
                      <Link key={btn.href} href={btn.href}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all ${getVariantClasses(btn.variant)}`}
                        >
                          {btn.label}
                        </motion.button>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* System Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-gray-50/50 border border-black/[0.03] p-8"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="p-2 bg-black text-white">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">System Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/settings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-50 border border-black/[0.03] text-black py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                <SettingsIcon className="w-4 h-4 inline-block mr-2" />
                System Settings
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (confirm('Are you sure you want to seed the database?')) {
                  fetch('/api/seed', { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                      alert(data.message)
                      fetchAdminStats()
                    })
                    .catch(err => alert('Error: ' + err.message))
                }
              }}
              className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all font-bold"
            >
              <Activity className="w-4 h-4 inline-block mr-2" />
              Seed Database
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (confirm('Are you sure you want to delete ALL products? This action cannot be undone.')) {
                  fetch('/api/admin/products/clear', { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        alert(data.message)
                        fetchAdminStats()
                      } else {
                        alert('Error: ' + data.error)
                      }
                    })
                    .catch(err => alert('Error: ' + err.message))
                }
              }}
              className="w-full bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all font-bold"
            >
              <AlertTriangle className="w-4 h-4 inline-block mr-2" />
              Clear All Products
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

