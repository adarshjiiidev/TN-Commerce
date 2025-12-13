'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Database, Settings, Trash2, RefreshCw, AlertTriangle, Shield, CheckCircle, Bell, Globe, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SystemSettings {
  siteName: string
  siteDescription: string
  currency: string
  taxRate: number
  shippingRate: number
  minOrderValue: number
  maxOrderValue: number
  emailNotifications: boolean
  smsNotifications: boolean
  maintenanceMode: boolean
}

export default function AdminSettings() {
  const { data: session, status } = useSession()
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'TN E-Commerce',
    siteDescription: 'Your premier online shopping destination',
    currency: 'INR',
    taxRate: 18,
    shippingRate: 50,
    minOrderValue: 500,
    maxOrderValue: 100000,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchSettings()
    fetchStats()
  }, [session, status])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()

      if (data.success && data.data) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          totalUsers: data.data.totalUsers || 0,
          totalProducts: data.data.totalProducts || 0,
          totalOrders: data.data.totalOrders || 0,
          totalCategories: data.data.totalCategories || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings: ' + data.error)
      }
    } catch (error) {
      alert('Failed to save settings: ' + error)
    } finally {
      setSaving(false)
    }
  }

  const seedDatabase = async () => {
    if (!confirm('Are you sure you want to seed the database? This will add sample data.')) return

    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      alert(data.message)
      fetchStats() // Refresh stats after seeding
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const clearAllProducts = async () => {
    if (!confirm('Are you sure you want to delete ALL products? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/admin/products/clear', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchStats()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const clearAllUsers = async () => {
    if (!confirm('Are you sure you want to delete ALL non-admin users? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/admin/users/clear', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchStats()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const clearAllOrders = async () => {
    if (!confirm('Are you sure you want to delete ALL orders? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/admin/orders/clear', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchStats()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  if (status === 'loading' && loading) {
    return (
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session || !session.user.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0d0d12]/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-heading">System Settings</h1>
                <p className="text-sm text-gray-400">Configure your store preferences and database</p>
              </div>
            </div>
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-900/20 border-0"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings */}
            <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                General Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Commerce Settings */}
            <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-purple-400" />
                Commerce Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tax Rate (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                    className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Shipping Rate (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.shippingRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, shippingRate: parseInt(e.target.value) }))}
                    className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Min Order Value (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.minOrderValue}
                    onChange={(e) => setSettings(prev => ({ ...prev, minOrderValue: parseInt(e.target.value) }))}
                    className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Max Order Value (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxOrderValue}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxOrderValue: parseInt(e.target.value) }))}
                    className="bg-black/20 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-400" />
                Notifications & Maintenance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-gray-400">Receive emails for new orders and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="rounded border-white/20 bg-white/5 checked:bg-orange-500 text-orange-500 focus:ring-0 focus:ring-offset-0 h-5 w-5"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium text-white">SMS Notifications</p>
                    <p className="text-xs text-gray-400">Receive text messages for critical alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="rounded border-white/20 bg-white/5 checked:bg-orange-500 text-orange-500 focus:ring-0 focus:ring-offset-0 h-5 w-5"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors">
                  <div>
                    <p className="font-medium text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-red-400/70">Disable public access to the store</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="rounded border-red-500/30 bg-red-500/10 checked:bg-red-500 text-red-500 focus:ring-0 focus:ring-offset-0 h-5 w-5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Stats */}
            <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                System Overview
              </h3>
              <div className="space-y-4">
                <StatRow label="Total Users" value={stats.totalUsers} />
                <StatRow label="Total Products" value={stats.totalProducts} />
                <StatRow label="Total Orders" value={stats.totalOrders} />
                <StatRow label="Total Categories" value={stats.totalCategories} />
              </div>
            </div>

            {/* Database Operations */}
            <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Database className="h-5 w-5 text-red-400" />
                Database Operations
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={seedDatabase}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white border-0"
                >
                  Seed Database
                </Button>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Danger Zone</p>
                  <Button
                    onClick={clearAllProducts}
                    variant="destructive"
                    className="w-full justify-start text-red-100 bg-red-900/40 hover:bg-red-900/60 border-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Products
                  </Button>
                  <Button
                    onClick={clearAllUsers}
                    variant="destructive"
                    className="w-full justify-start text-red-100 bg-red-900/40 hover:bg-red-900/60 border-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Users
                  </Button>
                  <Button
                    onClick={clearAllOrders}
                    variant="destructive"
                    className="w-full justify-start text-red-100 bg-red-900/40 hover:bg-red-900/60 border-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Orders
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-white font-mono">{value}</span>
    </div>
  )
}

function Activity({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
}

export const dynamic = 'force-dynamic'

