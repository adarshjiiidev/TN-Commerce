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
        console.error('Failed to fetch products')
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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Product Management</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Manage your boutique inventory and listings</p>
              </div>
            </div>
            <Link href="/admin/products/add">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Filters */}
        <div className="bg-gray-50/50 border border-black/[0.03] p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all"
              />
            </div>
            <div className="md:col-span-4 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black appearance-none focus:outline-none focus:border-black/10 transition-all"
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
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] text-gray-400 hover:text-black hover:bg-white transition-all"
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-black p-6 flex flex-wrap items-center justify-between gap-6"
            >
              <div className="flex items-center space-x-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {selectedProducts.length} Products selected
                </span>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkSale(true)}
                  disabled={bulkLoading}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  Set Sale
                </button>
                <button
                  onClick={() => handleBulkSale(false)}
                  disabled={bulkLoading}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-white/20 text-white hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                  Remove Sale
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkLoading}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Delete Selected
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        <div className="bg-white border border-black/[0.03] overflow-hidden">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8">
                <Box className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">No products found</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-w-sm mb-12">
                Adjust your search or category filters to find what you're looking for.
              </p>
              <Link href="/admin/products/add">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest"
                >
                  Add New Product
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-black/[0.03]">
                  <tr>
                    <th className="px-8 py-6 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 border-black/[0.1] rounded-none checked:bg-black focus:ring-0"
                      />
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Product / SKU</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Inventory</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-8">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleSelectProduct(product._id)}
                          className="w-4 h-4 border-black/[0.1] rounded-none checked:bg-black focus:ring-0"
                        />
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative h-16 w-16 bg-gray-50 overflow-hidden shrink-0">
                            <Image
                              src={product.images[0] || '/placeholder-image.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-black text-black uppercase tracking-tight line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                              ID: {product._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-black/[0.03] px-3 py-1 bg-gray-50/50">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-sm font-black text-black">
                          {formatPrice(product.price)}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-500" : "text-red-600"
                        )}>
                          {product.stock} units
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-wrap gap-2">
                          {product.isOnSale && (
                            <span className="px-2 py-0.5 text-[9px] font-black bg-red-600 text-white uppercase tracking-widest">SALE</span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-0.5 text-[9px] font-black bg-black text-white uppercase tracking-widest">FEATURED</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/products/edit/${product._id}`}>
                            <button className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-black/[0.03] transition-all">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
            <div className="px-8 py-10 bg-gray-50/50 border-t border-black/[0.03]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.totalItems)} of {pagination.totalItems} Boutique Products
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                    disabled={pagination.current === 1}
                    className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] text-gray-400 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                    disabled={pagination.current === pagination.total}
                    className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] text-gray-400 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

