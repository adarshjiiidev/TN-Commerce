'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
    _id: string
    name: string
    price: number
    originalPrice?: number
    images: string[]
    category: string
}

interface SearchBarProps {
    isMobile?: boolean
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<Product[]>([])
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches')
        if (saved) {
            setRecentSearches(JSON.parse(saved))
        }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        setLoading(true)
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`)
                const data = await response.json()
                if (data.success) {
                    setResults(data.data.products)
                }
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return

        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('recentSearches', JSON.stringify(updated))

        // Navigate to search results
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
        setIsOpen(false)
        setQuery('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query)
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem('recentSearches')
    }

    const popularSearches = ['T-Shirts', 'Hoodies', 'Jeans', 'Sneakers', 'Accessories']

    return (
        <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'hidden md:flex flex-1 max-w-sm'}`}>
            <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-black transition-colors duration-300 z-10" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={isMobile ? "SEARCH..." : "Search for products..."}
                    className={`w-full bg-white border-2 border-gray-200 rounded-none pl-11 pr-10 py-3 text-black text-base font-semibold placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:border-black transition-all duration-300 ${isMobile ? 'uppercase font-bold tracking-widest placeholder:font-bold' : ''
                        }`}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('')
                            setResults([])
                            inputRef.current?.focus()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors z-10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 w-full bg-white border border-black/5 shadow-2xl z-50 max-h-96 overflow-y-auto"
                    >
                        {/* Loading State */}
                        {loading && (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">Searching...</p>
                            </div>
                        )}

                        {/* Search Results */}
                        {!loading && query.length >= 2 && results.length > 0 && (
                            <div className="p-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">
                                    Products ({results.length})
                                </p>
                                {results.map((product) => (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        onClick={() => {
                                            setIsOpen(false)
                                            setQuery('')
                                        }}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="relative w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                                            {product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-black text-black uppercase tracking-tight truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mt-0.5">
                                                {product.category}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-black text-black">₹{product.price}</p>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <p className="text-xs text-gray-500 line-through font-semibold">₹{product.originalPrice}</p>
                                            )}
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                                <button
                                    onClick={() => handleSearch(query)}
                                    className="w-full mt-2 p-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                                >
                                    View All Results
                                    <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {/* No Results */}
                        {!loading && query.length >= 2 && results.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-sm font-black text-black uppercase tracking-tighter mb-2">No products found</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
                                    Try searching for something else
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setQuery(term)
                                                handleSearch(term)
                                            }}
                                            className="px-3 py-1.5 bg-gray-50 border border-black/5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent & Popular Searches */}
                        {!loading && query.length === 0 && (
                            <div className="p-4 space-y-4">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-600" />
                                                <p className="text-sm font-black text-black uppercase tracking-wide">
                                                    Recent Searches
                                                </p>
                                            </div>
                                            <button
                                                onClick={clearRecentSearches}
                                                className="text-xs font-bold text-gray-600 hover:text-black uppercase tracking-wide transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        {recentSearches.map((term, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setQuery(term)
                                                    handleSearch(term)
                                                }}
                                                className="w-full text-left px-3 py-2 text-base font-semibold text-black hover:bg-gray-50 transition-colors flex items-center justify-between group"
                                            >
                                                <span className="font-semibold">{term}</span>
                                                <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Popular Searches */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="h-4 w-4 text-gray-600" />
                                        <p className="text-sm font-black text-black uppercase tracking-wide">
                                            Popular Searches
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => {
                                                    setQuery(term)
                                                    handleSearch(term)
                                                }}
                                                className="px-4 py-2 bg-gray-100 border border-gray-300 text-xs font-black uppercase tracking-wide hover:bg-black hover:text-white hover:border-black transition-all"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
