"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Grid, List, SlidersHorizontal } from 'lucide-react'
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
  const category = searchParams.get('category')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams()
        if (category) params.append('category', category)

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

    fetchProducts()
  }, [category])

  const getPageTitle = () => {
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    }
    return 'All Products'
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              {getPageTitle()}
            </h1>
            <p className="text-gray-400 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-white text-black hover:bg-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-white text-black hover:bg-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <Loading className="h-32" text="Loading products..." />
        ) : (
          <>
            {/* Products Grid */}
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
                <h3 className="text-lg font-medium text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="outline" asChild className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <a href="/products">Clear Filters</a>
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d12] pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
