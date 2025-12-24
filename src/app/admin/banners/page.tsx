'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Banner } from '@/types'
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  X,
  ArrowLeft,
  CheckCircle,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function AdminBanners() {
  const { data: session, status } = useSession()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    link: '',
    buttonText: 'Shop Now',
    displayOrder: 0,
    isActive: true
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchBanners()
  }, [session, status])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners')
      const data = await response.json()

      if (data.success) {
        setBanners(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that we have an image (either uploaded file or existing image for edit)
    if (!selectedFile && !formData.image) {
      alert('Please select an image for the banner')
      return
    }

    setUploading(true)

    try {
      let imageUrl = formData.image

      // Upload new image if a file is selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      // Prepare banner data
      const bannerData = {
        ...formData,
        image: imageUrl
      }

      const url = editingBanner
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners'

      const method = editingBanner ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchBanners()
        resetForm()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchBanners()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchBanners()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      buttonText: banner.buttonText || 'Shop Now',
      displayOrder: banner.displayOrder,
      isActive: banner.isActive
    })
    // Clear upload states when editing
    setSelectedFile(null)
    setImagePreview('')
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      link: '',
      buttonText: 'Shop Now',
      displayOrder: 0,
      isActive: true
    })
    setSelectedFile(null)
    setImagePreview('')
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setEditingBanner(null)
    setShowAddForm(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const event = { target: { files: [file] } } as any
      handleFileSelect(event)
    }
  }

  const removeSelectedImage = () => {
    setSelectedFile(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/admin/upload/banner', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.imageUrl
  }

  const updateDisplayOrder = async (bannerId: string, newOrder: number) => {
    const banner = banners.find(b => b._id === bannerId)
    if (!banner) return

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          displayOrder: newOrder
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchBanners()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  if (status === 'loading' || loading) {
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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Banners & Displays</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Registry of boutique visual assets & sales velocity</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center"
            >
              {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {showAddForm ? 'Close Editor' : 'Initialize Asset'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/50 border border-black/[0.03] p-8">
            <div className="flex items-center gap-6">
              <div className="bg-black text-white p-4">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Assets</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter italic">{banners.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 border border-black/[0.03] p-8">
            <div className="flex items-center gap-6">
              <div className="bg-black text-white p-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Active Displays</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter italic">{banners.filter(b => b.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 border border-black/[0.03] p-8">
            <div className="flex items-center gap-6">
              <div className="bg-black text-white p-4">
                <MoveUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Max Order</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter italic">{Math.max(0, ...banners.map(b => b.displayOrder))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50/50 border border-black/[0.03] p-10"
            >
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-10">
                {editingBanner ? 'Refine Visual Asset' : 'Initialize New Asset'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block font-sans">Headline Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white border border-black/[0.03] px-5 py-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-sans"
                        required
                        placeholder="SUMMER COLLECTION 2024"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block font-sans">Sub-Headline Text</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full bg-white border border-black/[0.03] px-5 py-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-sans"
                        placeholder="LIMITED TIME OFFERS"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block font-sans">Description Registry</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white border border-black/[0.03] px-5 py-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-sans min-h-[120px]"
                        placeholder="Detailed registry of the collection's aesthetic and core value proposition..."
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block font-sans">Visual Asset (16:9 Mandatory) *</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-full aspect-video border border-black/[0.03] bg-white relative group cursor-pointer overflow-hidden transition-all hover:bg-black group",
                          (imagePreview || formData.image) ? "p-0" : "flex flex-col items-center justify-center p-10"
                        )}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        {(imagePreview || formData.image) ? (
                          <>
                            <Image
                              src={imagePreview || formData.image}
                              alt="Asset Registry"
                              fill
                              className="object-cover transition-all group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Registry Image</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-200 group-hover:text-white transition-colors mb-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors text-center">
                              Drag Visual Archive or Initialize Browser Selection
                            </span>
                          </>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block font-sans">Navigation Pointer (URL)</label>
                        <input
                          type="url"
                          value={formData.link}
                          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                          className="w-full bg-white border border-black/[0.03] px-5 py-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-sans font-mono"
                          placeholder="/collections/summer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block font-sans">Action Text</label>
                        <input
                          type="text"
                          value={formData.buttonText}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          className="w-full bg-white border border-black/[0.03] px-5 py-4 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                            className="w-20 bg-white border border-black/[0.03] px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all font-sans text-center"
                          />
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-sans">Velocity Order Index</label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                          className={cn(
                            "px-6 py-3 text-[9px] font-black uppercase tracking-widest border transition-all",
                            formData.isActive ? "bg-black text-white border-black" : "bg-white text-gray-400 border-black/[0.03]"
                          )}
                        >
                          {formData.isActive ? 'Active Display' : 'Archived Registry'}
                        </button>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploading}
                          className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          {uploading ? 'Processing Archive...' : (editingBanner ? 'Update Asset' : 'Initialize Asset')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Banners List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-black/[0.03] pb-6">
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Asset Registry ({banners.length})</h2>
            <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Sorted by Velocity Order Index
            </div>
          </div>

          {banners.length === 0 ? (
            <div className="bg-gray-50 p-24 text-center border border-black/[0.03]">
              <Layers className="h-12 w-12 text-gray-200 mx-auto mb-8" />
              <h3 className="text-xl font-black text-black uppercase tracking-tighter italic mb-4">No assets identified</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initialize your first boutique display asset above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {banners.sort((a, b) => a.displayOrder - b.displayOrder).map((banner, index) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-black/[0.03] flex flex-col lg:flex-row group overflow-hidden hover:border-black/10 transition-all"
                >
                  <div className="lg:w-1/3 aspect-video relative overflow-hidden bg-gray-50">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        #{banner.displayOrder}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic">{banner.title}</h3>
                          {banner.isActive ? (
                            <span className="p-1.5 bg-green-50 text-green-600 border border-green-100"><CheckCircle className="h-3 w-3" /></span>
                          ) : (
                            <span className="p-1.5 bg-gray-50 text-gray-400 border border-black/[0.03]"><EyeOff className="h-3 w-3" /></span>
                          )}
                        </div>
                        {banner.subtitle && (
                          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">{banner.subtitle}</p>
                        )}
                        {banner.description && (
                          <p className="text-[11px] font-bold text-gray-500 line-clamp-2 max-w-xl leading-relaxed">
                            {banner.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(banner)}
                          className="p-3 border border-black/[0.02] text-gray-300 hover:text-black hover:bg-gray-50 transition-all"
                          title={banner.isActive ? 'Archived' : 'Active'}
                        >
                          {banner.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="p-3 border border-black/[0.02] text-gray-300 hover:text-black hover:bg-gray-50 transition-all"
                          title="Refine Asset"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-3 border border-black/[0.02] text-gray-300 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                          title="Delete Registry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-black/[0.02] mt-10">
                      <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-black text-white"><MoveUp className="h-3 w-3" /></div>
                          <button
                            disabled={banner.displayOrder === 0}
                            onClick={() => updateDisplayOrder(banner._id, banner.displayOrder - 1)}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all disabled:opacity-30"
                          >
                            Increment Priority
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-black text-white"><MoveDown className="h-3 w-3" /></div>
                          <button
                            onClick={() => updateDisplayOrder(banner._id, banner.displayOrder + 1)}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                          >
                            Decrement Priority
                          </button>
                        </div>
                      </div>
                      {banner.link && (
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-all font-mono italic">
                          POINTER: {banner.link}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

