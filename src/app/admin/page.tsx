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
  },
  {
    title: 'Inventory Value',
    key: 'totalInventoryValue' as const,
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
]

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalInventoryValue: 0,
    featuredProducts: 0,
    onSaleProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
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
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
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
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white'
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
      case 'secondary':
        return 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
      default:
        return 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
              >
                <LayoutDashboard className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white font-heading">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {session.user.name}</p>
              </div>
            </div>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-glow hover:shadow-glow-lg transition-all"
              >
                Back to Store
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            const value = stats[stat.key]
            const displayValue = stat.prefix ? `${stat.prefix}${value}` : value

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 hover-glow transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                    className="text-green-400 flex items-center gap-1 text-sm font-medium"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>12%</span>
                  </motion.div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{displayValue}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {secondaryStats.map((stat, index) => {
            const Icon = stat.icon
            const value = stats[stat.key]

            return (
              <motion.div
                key={stat.key}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-2xl p-6 flex items-center gap-4 cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-white/5">
                  <Icon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-white">{value}</p>
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
          <h2 className="text-xl font-bold text-white mb-6 font-heading">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-2xl p-6 hover-lift transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white/5">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{action.description}</p>
                  <div className="space-y-2">
                    {action.actions.map((btn) => (
                      <Link key={btn.href} href={btn.href}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${getVariantClasses(btn.variant)}`}
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
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white font-heading">System Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/settings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all"
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
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
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
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-rose-600 transition-all"
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
