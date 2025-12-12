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
  pending: { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: <Clock className="w-3 h-3" /> },
  confirmed: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: <CheckCircle className="w-3 h-3" /> },
  processing: { color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: <Package className="w-3 h-3" /> },
  shipped: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: <Truck className="w-3 h-3" /> },
  delivered: { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <XCircle className="w-3 h-3" /> },
  refunded: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: <RotateCcw className="w-3 h-3" /> }
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
        console.error('Failed to fetch orders:', data.error)
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
        alert('Failed to update order: ' + data.error)
      }
    } catch (error) {
      alert('Failed to update order: ' + error)
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
                <h1 className="text-2xl font-bold font-heading">Order Management</h1>
                <p className="text-sm text-gray-400">View and manage customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-[#1a1a24]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by order number or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Box className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
              <p className="text-gray-400 max-w-sm">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria.' : 'No orders have been placed yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400 font-medium">
                  <tr>
                    <th className="px-6 py-4 text-left">Order Number</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const statusMeta = statusConfig[order.status] || { color: 'text-gray-400', icon: null }
                    return (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white font-mono break-all">{order.orderNumber}</div>
                          {order.trackingNumber && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Truck className="h-3 w-3" /> {order.trackingNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300 break-all">{order.userId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white font-heading">
                            {formatPrice(order.total)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items.length} items
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                            statusMeta.color
                          )}>
                            {statusMeta.icon}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value as OrderStatus)}
                            className="text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer hover:bg-black/60 transition-colors"
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
