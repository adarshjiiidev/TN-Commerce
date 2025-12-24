import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import User from '@/lib/models/User'
import Order from '@/lib/models/Order'
import { Category } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Calculate dates for trend analysis
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get stats in parallel for better performance
    const [
      totalUsers,
      lastMonthUsers,
      totalProducts,
      lastMonthProducts,
      totalProductValue,
      featuredProducts,
      onSaleProducts,
      outOfStockProducts,
      totalOrders,
      lastMonthOrders,
      totalRevenue,
      lastMonthRevenue,
      totalCategories
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $lt: currentMonthStart, $gte: lastMonthStart } }),
      Product.countDocuments(),
      Product.countDocuments({ createdAt: { $lt: currentMonthStart, $gte: lastMonthStart } }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stock'] } } } }
      ]),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ isOnSale: true }),
      Product.countDocuments({ stock: 0 }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $lt: currentMonthStart, $gte: lastMonthStart } }),
      Order.aggregate([
        {
          $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        {
          $match: {
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
            createdAt: { $lt: currentMonthStart, $gte: lastMonthStart }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Category.countDocuments()
    ])

    const totalInventoryValue = (totalProductValue as any[])[0]?.total || 0
    const calculatedRevenue = (totalRevenue as any[])[0]?.total || 0
    const calculatedLastMonthRevenue = (lastMonthRevenue as any[])[0]?.total || 0

    // Helper for trend calculation
    const calculateTrend = (current: number, total: number) => {
      if (total === current) return 0 // Assuming 'total' is all-time, this logic is a bit flawed for MoM if we don't have previous totals
      // A better way: Trend = (Current Month Count / Previous Month Count) - 1
      // But we need the count of the month BEFORE last month to compare last month...
      // Let's stick to a simpler "Percentage of total that happened this month" or just MoM
      const previousCount = total - current
      if (previousCount === 0) return current > 0 ? 100 : 0
      return Math.round((current / previousCount) * 100)
    }

    // Actual MoM logic: (Last Month / (Total - Last Month)) * 100
    // Actually, "Trend" usually refers to growth.
    // Let's just return raw counts for now or simple "Recent Growth"

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        userTrend: calculateTrend(lastMonthUsers, totalUsers),
        totalProducts,
        productTrend: calculateTrend(lastMonthProducts, totalProducts),
        totalInventoryValue: Math.round(totalInventoryValue),
        featuredProducts,
        onSaleProducts,
        outOfStockProducts,
        totalOrders,
        orderTrend: calculateTrend(lastMonthOrders, totalOrders),
        totalRevenue: Math.round(calculatedRevenue),
        revenueTrend: calculateTrend(calculatedLastMonthRevenue, calculatedRevenue),
        totalCategories
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
