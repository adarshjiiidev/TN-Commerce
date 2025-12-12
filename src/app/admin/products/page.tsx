'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Search, Filter, Trash2, Edit, Tag, Box, Star, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  stock: number
  isFeatured: boolean
  isOnSale: boolean
  rating: number
  reviewCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      current: number
      total: number
      count: number
      totalItems: number
    }
  }
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalItems: 0
  })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchProducts()
  }, [session, status, pagination.current, search, category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '10',
        ...(search && { search }),
        ...(category && { category })
      })

      const response = await fetch(`/api/admin/products?${params}`)
      const data: ProductsResponse = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setPagination(data.data.pagination)
      } else {
        console.error('Failed to fetch products:', data.error) //data.error might not exist on interface but assume it does for now or strict types issue
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        // alert('Product deleted successfully')
        fetchProducts() // Refresh list
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const toggleSale = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          isOnSale: !product.isOnSale,
          // If putting on sale and no original price, set it
          ...((!product.isOnSale && !product.originalPrice) && {
            originalPrice: product.price * 1.25 // 25% markup as original
          })
        })
      })
      const data = await response.json()

      if (data.success) {
        fetchProducts() // Refresh list
      } else {
        alert('Failed to update sale status')
      }
    } catch (error) {
      console.error('Error updating sale status:', error)
      alert('Error updating sale status')
    }
  }

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p._id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) return

    setBulkLoading(true)
    try {
      const promises = selectedProducts.map(productId =>
        fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      )

      await Promise.all(promises)
      // alert(`${selectedProducts.length} products deleted successfully`)
      setSelectedProducts([])
      fetchProducts()
    } catch (error) {
      console.error('Error deleting products:', error)
      alert('Error deleting products')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkSale = async (onSale: boolean) => {
    if (selectedProducts.length === 0) return

    setBulkLoading(true)
    try {
      const promises = selectedProducts.map(async (productId) => {
        const product = products.find(p => p._id === productId)
        if (!product) return

        return fetch(`/api/admin/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...product,
            isOnSale: onSale,
            // If putting on sale and no original price, set it
            ...((onSale && !product.originalPrice) && {
              originalPrice: product.price * 1.25
            })
          })
        })
      })

      await Promise.all(promises)
      setSelectedProducts([])
      fetchProducts()
    } catch (error) {
      console.error('Error updating products:', error)
      alert('Error updating products')
    } finally {
      setBulkLoading(false)
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
                <h1 className="text-2xl font-bold font-heading">Product Management</h1>
                <p className="text-sm text-gray-400">Manage your inventory, prices, and listings</p>
              </div>
            </div>
            <Link href="/admin/products/add">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25 border-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-[#1a1a24]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="md:col-span-4 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">All Categories</option>
                <option value="tshirts">T-Shirts</option>
                <option value="shirts">Shirts</option>
                <option value="jeans">Jeans</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('')
                  setPagination(prev => ({ ...prev, current: 1 }))
                }}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors text-sm font-medium border border-white/5"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-400 pl-2">
                  {selectedProducts.length} selected
                </span>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkSale(true)} disabled={bulkLoading}>
                  <Tag className="h-4 w-4 mr-2" />
                  Set Sale
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkSale(false)} disabled={bulkLoading}>
                  <Tag className="h-4 w-4 mr-2" />
                  Remove Sale
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={bulkLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Box className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400 max-w-sm mb-6">
                Try adjusting your filters or add a new product to your inventory.
              </p>
              <Link href="/admin/products/add">
                <Button>Add New Product</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400 font-medium">
                  <tr>
                    <th className="px-6 py-4 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-white/20 bg-white/5 checked:bg-purple-500 text-purple-500 focus:ring-0 focus:ring-offset-0"
                      />
                    </th>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Stock</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleSelectProduct(product._id)}
                          className="rounded border-white/20 bg-white/5 checked:bg-purple-500 text-purple-500 focus:ring-0 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                            <Image
                              src={product.images[0] || '/placeholder-image.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {product._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white font-heading">
                          {formatPrice(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "text-sm font-medium",
                          product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-yellow-400" : "text-red-400"
                        )}>
                          {product.stock} units
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isOnSale && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">SALE</span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">FEATURED</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/products/edit/${product._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="px-6 py-4 border-t border-white/5 bg-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.totalItems)} of {pagination.totalItems} products
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                    disabled={pagination.current === 1}
                    className="border-white/10 hover:bg-white/10"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                    disabled={pagination.current === pagination.total}
                    className="border-white/10 hover:bg-white/10"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
