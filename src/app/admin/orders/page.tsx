'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Filter, Box, ChevronDown, CheckCircle, Truck, Package, XCircle, Clock, RotateCcw } from 'lucide-react'
import { Order, OrderStatus } from '@/types'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils'
import { Button } from '@/components/ui/button'

const statusConfig: Record<OrderStatus, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Clock className="w-3 h-3" /> },
  confirmed: { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <CheckCircle className="w-3 h-3" /> },
  processing: { color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: <Package className="w-3 h-3" /> },
  shipped: { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: <Truck className="w-3 h-3" /> },
  delivered: { color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { color: 'text-red-600 bg-red-50 border-red-100', icon: <XCircle className="w-3 h-3" /> },
  refunded: { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: <RotateCcw className="w-3 h-3" /> }
}

export default function OrdersManagement() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchOrders()
  }, [session, status])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ))
      } else {
        alert('Failed to update order')
      }
    } catch (error) {
      alert('Failed to update order')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Order Management</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">View and manage boutique customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Filters */}
        <div className="bg-gray-50/50 border border-black/[0.03] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Query order # or customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black appearance-none focus:outline-none focus:border-black/10 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-black/[0.03] overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8">
                <Box className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">No orders found</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-w-sm">
                {searchTerm || statusFilter !== 'all' ? 'Refine your search parameters to find results.' : 'The boutique hasn\'t received any orders yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-black/[0.03]">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Order Reference</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Customer ID</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Value</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Dated</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {filteredOrders.map((order) => {
                    const statusMeta = statusConfig[order.status] || { color: 'text-gray-400 uppercase', icon: null }
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-8 py-8">
                          <div className="text-sm font-black text-black uppercase tracking-tight break-all font-mono">{order.orderNumber}</div>
                          {order.trackingNumber && (
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2 flex items-center gap-1.5">
                              <Truck className="h-3 w-3" /> TRK: {order.trackingNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-8">
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 break-all">{order.userId.slice(-12).toUpperCase()}</div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="text-sm font-black text-black">
                            {formatPrice(order.total)}
                          </div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                            {order.items.length} units
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                            statusMeta.color
                          )}>
                            {statusMeta.icon}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-8">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value as OrderStatus)}
                            className="text-[10px] font-black uppercase tracking-widest bg-white border border-black/[0.03] px-4 py-2 text-black focus:outline-none focus:border-black transition-all cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'


