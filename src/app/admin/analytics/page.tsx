'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, TrendingUp, ShoppingBag, Users, DollarSign, BarChart3, PieChart, Activity, Download } from 'lucide-react'
import { Analytics } from '@/types'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils'
import { Button } from '@/components/ui/button'

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchAnalytics()
  }, [session, status, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.data)
      } else {
        console.error('Failed to fetch analytics:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Analytics Performance</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Registry of boutique metrics and sales velocity</p>
              </div>
            </div>
            <Link href="/admin/reports">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Registry
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Time Range Selector */}
        <div className="flex justify-end">
          <div className="bg-gray-50/50 border border-black/[0.03] p-1 inline-flex">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                  timeRange === range
                    ? "bg-black text-white"
                    : "text-gray-400 hover:text-black hover:bg-white"
                )}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '3 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Consolidated Revenue"
                value={formatPrice(analytics.totalRevenue)}
                icon={<DollarSign className="h-5 w-5" />}
                trend={`${analytics.revenueTrend > 0 ? '+' : ''}${analytics.revenueTrend.toFixed(1)}%`}
                trendUp={analytics.revenueTrend >= 0}
              />
              <MetricCard
                title="Boutique Orders"
                value={analytics.totalOrders.toString()}
                icon={<ShoppingBag className="h-5 w-5" />}
                trend={`${analytics.ordersTrend > 0 ? '+' : ''}${analytics.ordersTrend.toFixed(1)}%`}
                trendUp={analytics.ordersTrend >= 0}
              />
              <MetricCard
                title="Conversion Rate"
                value={`${analytics.conversionRate.toFixed(2)}%`}
                icon={<Activity className="h-5 w-5" />}
                trend={`${analytics.conversionTrend > 0 ? '+' : ''}${analytics.conversionTrend.toFixed(1)}%`}
                trendUp={analytics.conversionTrend >= 0}
              />
              <MetricCard
                title="Average Valuation"
                value={formatPrice(analytics.averageOrderValue)}
                icon={<BarChart3 className="h-5 w-5" />}
                trend={`${analytics.aovTrend > 0 ? '+' : ''}${analytics.aovTrend.toFixed(1)}%`}
                trendUp={analytics.aovTrend >= 0}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-gray-50/50 border border-black/[0.03] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter italic flex items-center gap-4">
                    <div className="p-2 bg-black text-white">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    Sales Velocity
                  </h3>
                </div>
                <div className="h-64 border-b border-l border-black/[0.05] relative overflow-hidden flex items-end justify-between px-4 pb-0 pt-10">
                  {analytics.salesData.length > 0 ? (
                    analytics.salesData.slice(-12).map((day, i) => {
                      const maxRevenue = Math.max(...analytics.salesData.map(d => d.revenue)) || 1
                      const h = (day.revenue / maxRevenue) * 90 + 5
                      return (
                        <div key={day.date} className="w-full mx-1 bg-black/5 hover:bg-black transition-all group relative" style={{ height: `${h}%` }}>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {formatPrice(day.revenue)}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                      Insufficient data for velocity mapping
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50/50 border border-black/[0.03] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter italic flex items-center gap-4">
                    <div className="p-2 bg-black text-white">
                      <PieChart className="h-4 w-4" />
                    </div>
                    Traffic Attribution
                  </h3>
                </div>
                <div className="h-64 flex items-center justify-center relative">
                  <div className="w-40 h-40 rounded-full border-[12px] border-black/[0.03] border-t-black transform rotate-45"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-black uppercase tracking-tighter italic">Source</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Analysis</span>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <div className="w-2 h-2 bg-black"></div> Organic Boutique
                    </div>
                    <span className="text-sm font-black text-black">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <div className="w-2 h-2 bg-gray-200"></div> Social Registry
                    </div>
                    <span className="text-sm font-black text-black">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <div className="w-2 h-2 bg-gray-100"></div> Direct Access
                    </div>
                    <span className="text-sm font-black text-black">20%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products and Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top Selling Products */}
              <div className="bg-gray-50/50 border border-black/[0.03] p-8">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                  <div className="p-2 bg-black text-white">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  High-Velocity Assets
                </h3>
                <div className="space-y-4">
                  {analytics.topSellingProducts.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center space-x-6 p-4 bg-white border border-black/[0.03] hover:border-black/10 transition-all group">
                      <div className="flex-shrink-0">
                        <span className="text-xl font-black text-black/10 group-hover:text-black italic tracking-tighter transition-colors">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-black uppercase tracking-tight truncate">
                          {product.name}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-1 bg-gray-50 border border-black/[0.03]">
                        {product.stock} Units
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-50/50 border border-black/[0.03] p-8">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                  <div className="p-2 bg-black text-white">
                    <ClockIcon className="h-4 w-4" />
                  </div>
                  Latest Transactions
                </h3>
                <div className="space-y-4">
                  {analytics.recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-white border border-black/[0.03] hover:border-black/10 transition-all">
                      <div>
                        <p className="text-sm font-black text-black uppercase tracking-tight">
                          ORD-{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-black">
                          {formatPrice(order.total)}
                        </p>
                        <div className="mt-1">
                          <span className={cn(
                            "inline-flex px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border",
                            order.status === 'delivered' ? 'bg-green-600 text-white border-green-600' :
                              order.status === 'pending' ? 'bg-amber-500 text-white border-amber-500' :
                                'bg-black text-white border-black'
                          )}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!analytics && !loading && (
          <div className="bg-gray-50 p-24 text-center border border-black/[0.03]">
            <BarChart3 className="h-12 w-12 text-gray-200 mx-auto mb-8" />
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">Registry Unavailable</h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-w-sm mx-auto">
              Failed to synchronize boutique metrics. Please re-initialize connection.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, trendUp }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-gray-50/50 border border-black/[0.03] p-8 transition-all group hover:border-black/10">
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-black text-white">
          {icon}
        </div>
        <div className={cn(
          "px-2 py-1 text-[9px] font-black uppercase tracking-widest border",
          trendUp ? "text-green-600 border-green-100 bg-green-50" : "text-red-600 border-red-100 bg-red-50"
        )}>
          {trend}
        </div>
      </div>

      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-black text-black tracking-tighter italic leading-none">{value}</p>
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

export const dynamic = 'force-dynamic'

