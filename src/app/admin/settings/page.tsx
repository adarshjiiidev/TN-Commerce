'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Database, Settings, Trash2, RefreshCw, AlertTriangle, Shield, CheckCircle, Bell, Globe, ShoppingBag, Activity } from 'lucide-react'
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
      console.error('Failed to fetch settings')
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
      console.error('Failed to fetch stats')
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
        alert('Settings persisted successfully.')
      } else {
        alert('Failed to persist settings.')
      }
    } catch (error) {
      alert('Failed to persist settings.')
    } finally {
      setSaving(false)
    }
  }

  const seedDatabase = async () => {
    if (!confirm('Proceed with database seeding? This adds sample boutique data.')) return

    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      alert(data.message)
      fetchStats()
    } catch (error) {
      alert('Seeding operation failed.')
    }
  }

  const clearAllProducts = async () => {
    if (!confirm('Purge ALL products? This action is irreversible.')) return

    try {
      const response = await fetch('/api/admin/products/clear', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchStats()
      } else {
        alert('Purge operation failed.')
      }
    } catch (error) {
      alert('Purge operation failed.')
    }
  }

  const clearAllUsers = async () => {
    if (!confirm('Purge ALL secondary users? This action is irreversible.')) return

    try {
      const response = await fetch('/api/admin/users/clear', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchStats()
      } else {
        alert('Purge operation failed.')
      }
    } catch (error) {
      alert('Purge operation failed.')
    }
  }

  const clearAllOrders = async () => {
    if (!confirm('Purge ALL order history? This action is irreversible.')) return

    try {
      const response = await fetch('/api/admin/orders/clear', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchStats()
      } else {
        alert('Purge operation failed.')
      }
    } catch (error) {
      alert('Purge operation failed.')
    }
  }

  if (status === 'loading' && loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-2 border-black border-t-transparent mx-auto"></div>
      </div>
    )
  }

  if (!session || !session.user.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="border-b border-black/[0.03] bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-10">
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="p-3 bg-gray-50 border border-black/[0.03] text-gray-400 hover:text-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">System Configuration</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Global boutique preferences & database controls</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
              disabled={saving}
              className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Syncing...' : 'Sync Changes'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Settings Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* General Settings */}
            <div className="bg-white border border-black/[0.03] p-10">
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                <Globe className="h-6 w-6 text-black" />
                Regional Parameters
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Boutique Identifier</label>
                  <input
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Brand Narrative</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Base Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Commerce Settings */}
            <div className="bg-white border border-black/[0.03] p-10">
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                <ShoppingBag className="h-6 w-6 text-black" />
                Fiscal Controllers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Tax Obligation (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Logistics Tariff (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.shippingRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, shippingRate: parseInt(e.target.value) }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Floor Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.minOrderValue}
                    onChange={(e) => setSettings(prev => ({ ...prev, minOrderValue: parseInt(e.target.value) }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Ceiling Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.maxOrderValue}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxOrderValue: parseInt(e.target.value) }))}
                    className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white border border-black/[0.03] p-10">
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                <Bell className="h-6 w-6 text-black" />
                Alert Infrastructure
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 border border-black/[0.03]">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-black">Email Dispatch</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Broadcast new orders and system updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="w-5 h-5 border-black/[0.1] rounded-none checked:bg-black focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-6 bg-gray-50 border border-black/[0.03]">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-black">Cellular Alerts</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">High-priority SMS notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="w-5 h-5 border-black/[0.1] rounded-none checked:bg-black focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-6 bg-red-50 border border-red-100">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Maintenance Protocol
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mt-1">Cease public boutique operations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="w-5 h-5 border-red-200 rounded-none checked:bg-red-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* System Stats */}
            <div className="bg-white border border-black/[0.03] p-8">
              <h3 className="text-xl font-black text-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                <Activity className="h-5 w-5 text-black" />
                Live Telemetry
              </h3>
              <div className="space-y-4">
                <StatRow label="Universe of Clientele" value={stats.totalUsers} />
                <StatRow label="Inventory Depth" value={stats.totalProducts} />
                <StatRow label="Transaction Volume" value={stats.totalOrders} />
                <StatRow label="Collection Scarcity" value={stats.totalCategories} />
              </div>
            </div>

            {/* Database Operations */}
            <div className="bg-white border border-black/[0.03] p-8">
              <h3 className="text-xl font-black text-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                <Database className="h-5 w-5 text-black" />
                Registry Core
              </h3>
              <div className="space-y-4">
                <button
                  onClick={seedDatabase}
                  className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all"
                >
                  Seed Registry
                </button>
                <div className="pt-8 border-t border-black/[0.02] space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Terminal Deletion</p>
                  <button
                    onClick={clearAllProducts}
                    className="w-full text-left py-3 px-4 text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>Flush Products</span>
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={clearAllUsers}
                    className="w-full text-left py-3 px-4 text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>Flush Users</span>
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={clearAllOrders}
                    className="w-full text-left py-3 px-4 text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>Flush Transactional History</span>
                    <Trash2 className="h-3 w-3" />
                  </button>
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
    <div className="flex justify-between items-center py-4 border-b border-black/[0.02] last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-xs font-black text-black font-mono">{value.toLocaleString()}</span>
    </div>
  )
}

export const dynamic = 'force-dynamic'

