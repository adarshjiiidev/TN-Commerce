'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Category } from '@/types'
import { ArrowLeft, Plus, Search, Layers, Calendar, Trash2, Power } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function CategoriesManagement() {
  const { data: session, status } = useSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchCategories()
  }, [session, status])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      const data = await response.json()

      if (data.success) {
        setCategories(categories.map(category =>
          category._id === categoryId ? { ...category, isActive: !isActive } : category
        ))
      } else {
        alert('Failed to update category')
      }
    } catch (error) {
      alert('Failed to update category')
    }
  }

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setCategories(categories.filter(category => category._id !== categoryId))
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      alert('Failed to delete category')
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-2 border-black border-t-transparent"></div>
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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Boutique Taxonomies</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Refine and organize boutique collections</p>
              </div>
            </div>
            <Link href="/admin/categories/add">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Category
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Search */}
        <div className="bg-gray-50/50 border border-black/[0.03] p-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Query taxonomies by name or identifier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white border border-black/[0.03] p-8 group hover:border-black/10 transition-all">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  {category.image ? (
                    <div className="h-16 w-16 bg-gray-50 overflow-hidden relative">
                      <img
                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        src={category.image}
                        alt={category.name}
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-50 flex items-center justify-center text-gray-200">
                      <Layers className="h-8 w-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">{category.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">ID: /{category.slug}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                  category.isActive ? "text-blue-600 border-blue-100 bg-blue-50" : "text-gray-400 border-gray-100 bg-gray-50"
                )}>
                  {category.isActive ? 'Active' : 'Archived'}
                </div>
              </div>

              {category.description && (
                <p className="text-[11px] font-bold text-gray-500 mb-8 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}

              <div className="space-y-3 pt-8 border-t border-black/[0.02]">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Initialized</span>
                  <span className="text-black">{new Date(category.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                {category.parentId && (
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><Layers className="h-3 w-3" /> Hierarchy</span>
                    <span className="text-black">{categories.find(c => c._id === category.parentId)?.name || 'Root'}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => toggleCategoryStatus(category._id, category.isActive)}
                  className={cn(
                    "flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                    category.isActive
                      ? "text-red-400 border-red-50/50 hover:bg-black hover:text-white hover:border-black"
                      : "text-blue-600 border-blue-50 hover:bg-black hover:text-white hover:border-black"
                  )}
                >
                  <Power className="h-3 w-3" /> {category.isActive ? 'Deactivate' : 'Reactivate'}
                </button>
                <button
                  onClick={() => deleteCategory(category._id)}
                  className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="bg-gray-50 p-32 text-center">
            <div className="w-24 h-24 bg-white/50 mx-auto flex items-center justify-center mb-8 border border-black/[0.03]">
              <Layers className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">No taxonomies identified</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">
              {searchTerm ? 'Refine your query parameters.' : 'Initialize your first boutique collection.'}
            </p>
            <Link href="/admin/categories/add">
              <button className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all">
                Initialize Collection
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

