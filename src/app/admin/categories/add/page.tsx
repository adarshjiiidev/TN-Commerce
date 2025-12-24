'use client'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Category } from '@/types'
import { ArrowLeft, Layers, CheckCircle, Power, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function AddCategory() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
    isActive: true
  })

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
      const response = await fetch('/api/admin/categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Category initialized successfully!')
        router.push('/admin/categories')
      } else {
        alert('Failed to initialize: ' + data.error)
      }
    } catch (error) {
      alert('Failed to initialize: ' + error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
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
              <Link href="/admin/categories" className="p-3 bg-gray-50 border border-black/[0.03] text-gray-400 hover:text-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Initialize Taxonomy</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Registry of boutique collection hierarchies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gray-50/50 border border-black/[0.03] p-10 md:p-16">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 gap-12">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Taxonomy Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all placeholder:text-gray-200"
                  placeholder="e.g. LUXURY EYEWEAR"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Identifier Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-mono"
                  placeholder="luxury-eyewear"
                  required
                />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-3 flex items-center gap-2">
                  <span className="p-1 bg-gray-50 border border-black/[0.03]">URL-PTR</span> Auto-generated boutique pointer
                </p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Aesthetic Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all min-h-[150px]"
                  placeholder="Detailed registry of the collection's visual and conceptual identity..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Visual Pointer (Image URL)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-mono"
                  placeholder="https://cdn.boutique.com/assets/eyewear.jpg"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Taxonomic Hierarchy</label>
                <div className="relative">
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                    className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black appearance-none focus:outline-none focus:border-black/10 transition-all"
                  >
                    <option value="">None (Master Collection)</option>
                    {categories.filter(cat => !cat.parentId).map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <Layers className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center pt-6">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={cn(
                    "px-8 py-4 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-3",
                    formData.isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-400 border-black/[0.03]"
                  )}
                >
                  {formData.isActive ? <CheckCircle className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                  {formData.isActive ? 'Active Display' : 'Archived Registry'}
                </button>
              </div>
            </div>

            <div className="flex gap-6 pt-12 border-t border-black/[0.02]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-5 px-10 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" /> {loading ? 'Initializing...' : 'Initialize Taxonomy'}
              </motion.button>
              <Link
                href="/admin/categories"
                className="flex-1 bg-white border border-black/[0.03] text-gray-400 py-5 px-10 text-[10px] font-black uppercase tracking-widest hover:text-black hover:border-black/10 transition-all flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" /> Cancel Registry
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

