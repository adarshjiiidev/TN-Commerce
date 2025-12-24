import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // For trend calculation, get previous period data
    const lastPeriodStartDate = new Date(startDate)
    lastPeriodStartDate.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()))

    const [orders, users, lastPeriodOrders, lastPeriodUsers] = await Promise.all([
      Order.find({
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      }).lean(),
      User.find({ createdAt: { $gte: startDate } }).lean(),
      Order.find({
        createdAt: { $gte: lastPeriodStartDate, $lt: startDate },
        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
      }).lean(),
      User.find({ createdAt: { $gte: lastPeriodStartDate, $lt: startDate } }).lean()
    ])

    // Simplified top products: find products with most order occurrences in this period
    const topSellingAggregation = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', salesCount: { $sum: '$items.quantity' } } },
      { $sort: { salesCount: -1 } },
      { $limit: 10 }
    ]);

    const topProductIds = topSellingAggregation.map(item => item._id);
    const topProducts = await Product.find({ _id: { $in: topProductIds } }).lean();

    // Map back the salesCount
    const productsWithSales = topProducts.map((p: any) => {
      const aggItem = topSellingAggregation.find(a => a._id.toString() === p._id.toString());
      return { ...p, stock: aggItem?.salesCount || 0 };
    }).sort((a: any, b: any) => (b.stock || 0) - (a.stock || 0));

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
    const lastPeriodRevenue = lastPeriodOrders.reduce((sum: number, order: any) => sum + order.total, 0)

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    const analytics = {
      totalRevenue,
      revenueTrend: calculateGrowth(totalRevenue, lastPeriodRevenue),
      totalOrders: orders.length,
      ordersTrend: calculateGrowth(orders.length, lastPeriodOrders.length),
      totalUsers: users.length,
      usersTrend: calculateGrowth(users.length, lastPeriodUsers.length),
      totalProducts: productsWithSales.length,
      conversionRate: users.length > 0 ? (orders.length / users.length) * 100 : 0,
      conversionTrend: calculateGrowth(
        users.length > 0 ? (orders.length / users.length) : 0,
        lastPeriodUsers.length > 0 ? (lastPeriodOrders.length / lastPeriodUsers.length) : 0
      ),
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      aovTrend: calculateGrowth(
        orders.length > 0 ? (totalRevenue / orders.length) : 0,
        lastPeriodOrders.length > 0 ? (lastPeriodRevenue / lastPeriodOrders.length) : 0
      ),
      topSellingProducts: productsWithSales,
      recentOrders: await Order.find().sort({ createdAt: -1 }).limit(10).lean(),
      salesData: [] as any[]
    }

    // Generate sales data by day
    const dayMs = 24 * 60 * 60 * 1000
    const totalDays = Math.ceil((now.getTime() - startDate.getTime()) / dayMs)

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate.getTime() + i * dayMs)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= dayStart && orderDate <= dayEnd
      })

      const dayUsers = users.filter(user => {
        const userDate = new Date(user.createdAt)
        return userDate >= dayStart && userDate <= dayEnd
      })

      analytics.salesData.push({
        date: date.toISOString().split('T')[0],
        revenue: dayOrders.reduce((sum: number, order: any) => sum + order.total, 0),
        orders: dayOrders.length,
        users: dayUsers.length
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Admin analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
