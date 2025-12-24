"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Loading from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sortBy') || 'createdAt')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [onSale, setOnSale] = useState(searchParams.get('onSale') === 'true')
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true')
  const searchQuery = searchParams.get('search') || ''

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'accessories', label: 'Accessories' },
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
  ]

  useEffect(() => {
    fetchProducts()
    document.title = `${getPageTitle()} | Showroom Se Bhi Sasta`
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (onSale) params.append('onSale', 'true')
      if (inStock) params.append('inStock', 'true')

      // Handle sorting
      if (selectedSort === 'price-asc') {
        params.append('sortBy', 'price')
        params.append('sortOrder', 'asc')
      } else if (selectedSort === 'price-desc') {
        params.append('sortBy', 'price')
        params.append('sortOrder', 'desc')
      } else {
        params.append('sortBy', selectedSort)
        params.append('sortOrder', 'desc')
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFilters = (updates: Record<string, string | boolean>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === false) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedSort('createdAt')
    setMinPrice('')
    setMaxPrice('')
    setOnSale(false)
    setInStock(false)
    router.push('/products')
  }

  const getPageTitle = () => {
    if (searchQuery) return `Search: "${searchQuery}"`
    if (selectedCategory) {
      return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')
    }
    return 'All Products'
  }

  const activeFiltersCount = [
    selectedCategory,
    minPrice,
    maxPrice,
    onSale,
    inStock
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">
              {getPageTitle()}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mt-2">
              Showing {products.length} Items
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-gray-50 border border-black/5 p-1 gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-black text-white hover:bg-black rounded-none shadow-none' : 'text-gray-400 hover:text-black hover:bg-gray-100 rounded-none'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-black text-white hover:bg-black rounded-none shadow-none' : 'text-gray-400 hover:text-black hover:bg-gray-100 rounded-none'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-gray-50 border-black/5 text-black hover:bg-black hover:text-white rounded-none font-bold uppercase tracking-widest text-[10px] h-10 shadow-none px-6"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-black text-white px-2 py-0.5 text-[8px] rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-80 flex-shrink-0 bg-gray-50 border border-black/5 p-6 sticky top-24 h-fit"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-tighter italic">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        updateFilters({ category: e.target.value })
                      }}
                      className="w-full bg-white border-2 border-gray-200 p-3 text-base font-semibold text-black focus:outline-none focus:border-black"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
                      Sort By
                    </label>
                    <select
                      value={selectedSort}
                      onChange={(e) => {
                        setSelectedSort(e.target.value)
                        updateFilters({ sortBy: e.target.value })
                      }}
                      className="w-full bg-white border-2 border-gray-200 p-3 text-base font-semibold text-black focus:outline-none focus:border-black"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 p-3 text-base font-semibold text-black placeholder:text-gray-500 focus:outline-none focus:border-black"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 p-3 text-base font-semibold text-black placeholder:text-gray-500 focus:outline-none focus:border-black"
                      />
                    </div>
                    <button
                      onClick={() => updateFilters({ minPrice, maxPrice })}
                      className="mt-2 w-full bg-black text-white p-3 text-xs font-black uppercase tracking-widest hover:bg-gray-900"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-3 border-t border-black/5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => {
                          setOnSale(e.target.checked)
                          updateFilters({ onSale: e.target.checked })
                        }}
                        className="w-5 h-5"
                      />
                      <span className="text-base font-bold uppercase tracking-wide text-black">On Sale</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => {
                          setInStock(e.target.checked)
                          updateFilters({ inStock: e.target.checked })
                        }}
                        className="w-5 h-5"
                      />
                      <span className="text-base font-bold uppercase tracking-wide text-black">In Stock</span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full mt-4 p-3 border border-black/10 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-black hover:text-white transition-all"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <Loading className="h-32" text="Loading products..." />
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {products.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-16"
                  >
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter italic mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-10">
                      Try adjusting filters or search.
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="bg-black text-white hover:bg-gray-900 border-0 rounded-none h-14 px-10 font-bold uppercase tracking-widest text-[10px]"
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent mx-auto mb-4"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
