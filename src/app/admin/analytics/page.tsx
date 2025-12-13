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
                <h1 className="text-2xl font-bold font-heading">Analytics Dashboard</h1>
                <p className="text-sm text-gray-400">Track your store performance and metrics</p>
              </div>
            </div>
            <Link href="/admin/reports">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 border-0">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Time Range Selector */}
        <div className="flex justify-end">
          <div className="bg-[#1a1a24]/80 backdrop-blur-md rounded-xl p-1 border border-white/10 inline-flex">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  timeRange === range
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatPrice(analytics.totalRevenue)}
                icon={<DollarSign className="h-6 w-6 text-green-400" />}
                trend="+12.5%"
                trendUp={true}
                color="green"
              />
              <MetricCard
                title="Total Orders"
                value={analytics.totalOrders.toString()}
                icon={<ShoppingBag className="h-6 w-6 text-blue-400" />}
                trend="+8.2%"
                trendUp={true}
                color="blue"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${analytics.conversionRate.toFixed(2)}%`}
                icon={<Activity className="h-6 w-6 text-purple-400" />}
                trend="-2.1%"
                trendUp={false}
                color="purple"
              />
              <MetricCard
                title="Avg Order Value"
                value={formatPrice(analytics.averageOrderValue)}
                icon={<BarChart3 className="h-6 w-6 text-orange-400" />}
                trend="+5.4%"
                trendUp={true}
                color="orange"
              />
            </div>

            {/* Charts Section (Placeholder visuals for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Sales Overview
                  </h3>
                </div>
                <div className="h-64 rounded-xl bg-gradient-to-b from-purple-500/10 to-transparent border border-white/5 relative overflow-hidden flex items-end justify-between px-4 pb-0 pt-10">
                  {/* Fake Chart Bars */}
                  {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95].map((h, i) => (
                    <div key={i} className="w-full mx-1 bg-purple-500/30 hover:bg-purple-500/50 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        Value: {h}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-400" />
                    Traffic Sources
                  </h3>
                </div>
                <div className="h-64 flex items-center justify-center relative">
                  <div className="w-40 h-40 rounded-full border-[16px] border-blue-500/20 border-t-blue-500 border-r-purple-500 transform rotate-45"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white">Total</span>
                    <span className="text-sm text-gray-400">Visits</span>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div> Direct
                    </div>
                    <span className="font-medium text-white">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div> Social
                    </div>
                    <span className="font-medium text-white">35%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-3 h-3 rounded-full bg-white/20"></div> Other
                    </div>
                    <span className="font-medium text-white">20%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products and Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products */}
              <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-orange-400" />
                  Top Selling Products
                </h3>
                <div className="space-y-4">
                  {analytics.topSellingProducts.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <div className="flex-shrink-0">
                        <span className={cn(
                          "inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold",
                          index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                            index === 1 ? "bg-gray-400/20 text-gray-300" :
                              index === 2 ? "bg-orange-700/20 text-orange-400" :
                                "bg-white/10 text-gray-500"
                        )}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                        {product.stock} left
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-blue-400" />
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {analytics.recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <div>
                        <p className="text-sm font-medium text-blue-400 font-mono">
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white font-heading">
                          {formatPrice(order.total)}
                        </p>
                        <div className="mt-1">
                          <span className={cn(
                            "inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm",
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
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
          <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/5">
            <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Unavailable</h3>
            <div className="text-gray-400 max-w-sm mx-auto">
              Failed to load analytics data. Please try again later.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, trendUp, color }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean, color: string }) {
  return (
    <div className="bg-[#1a1a24]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-10",
        color === 'green' ? 'from-green-500 to-emerald-500' :
          color === 'blue' ? 'from-blue-500 to-indigo-500' :
            color === 'purple' ? 'from-purple-500 to-pink-500' :
              'from-orange-500 to-red-500'
      )} />

      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl border",
          color === 'green' ? 'bg-green-500/10 border-green-500/20' :
            color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
              color === 'purple' ? 'bg-purple-500/10 border-purple-500/20' :
                'bg-orange-500/10 border-orange-500/20'
        )}>
          {icon}
        </div>
        <div className={cn("px-2 py-1 rounded text-xs font-bold", trendUp ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
          {trend}
        </div>
      </div>

      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white font-heading">{value}</p>
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

export const dynamic = 'force-dynamic'

