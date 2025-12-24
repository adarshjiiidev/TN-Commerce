'use client'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Package,
  TrendingUp,
  Camera,
  Plus,
  CheckCircle,
  Tag,
  LayoutGrid
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ProductForm {
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory: string
  images: string[]
  stock: number
  isFeatured: boolean
  isOnSale: boolean
  tags: string[]
}

export default function AddProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    category: 'tshirts',
    subcategory: 'casual',
    images: [],
    stock: 0,
    isFeatured: false,
    isOnSale: false,
    tags: []
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }
  }, [session, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || formData.price <= 0) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.images.length === 0) {
      alert('Please add at least one product image')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Product initialized successfully!')
        router.push('/admin/products')
      } else {
        alert('Failed to initialize: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    } finally {
      setLoading(false)
    }
  }


  const removeImage = (index: number) => {
    setFormData((prev: ProductForm) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev: ProductForm) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev: ProductForm) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploadLoading(true)
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const uploadedImageUrl = await uploadImage(file)

      setFormData((prev: ProductForm) => ({
        ...prev,
        images: [...prev.images, uploadedImageUrl]
      }))

      setSelectedFile(null)
      setImagePreview('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file: ' + error)
    } finally {
      setUploadLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/admin/upload/product', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.imageUrl
  }

  const removeSelectedImage = () => {
    setSelectedFile(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setShowCamera(true)

      // Simple camera implementation - would be more robust in production
      setTimeout(() => {
        setShowCamera(false)
        stream.getTracks().forEach(track => track.stop())
      }, 3000)

    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Error accessing camera. Please check permissions.')
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
              <Link href="/admin/products" className="p-3 bg-gray-50 border border-black/[0.03] text-gray-400 hover:text-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Initialize Product</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Registry of boutique master assets & inventory control</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Inventory Status</p>
                <p className="text-xs font-black uppercase tracking-tight text-blue-600">Awaiting Entry</p>
              </div>
              <div className="h-10 w-px bg-black/[0.03]" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {loading ? 'Processing...' : 'Register Asset'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-gray-50/50 border border-black/[0.03] p-10 space-y-10">
              <h2 className="text-xl font-black text-black uppercase tracking-tighter italic border-b border-black/[0.03] pb-6">Product Registry</h2>

              <div className="space-y-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Asset Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev: ProductForm) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                    placeholder="e.g. VINTAGE OVERSIZED SILK BLAZER"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Asset Description *</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.description}
                    onChange={(e) => setFormData((prev: ProductForm) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white border border-black/[0.03] px-6 py-5 text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all min-h-[200px]"
                    placeholder="Detailed registry of materials, craftsmanship, and aesthetic purpose..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 border border-black/[0.03] p-10 space-y-10">
              <h2 className="text-xl font-black text-black uppercase tracking-tighter italic border-b border-black/[0.03] pb-6">Visual Archives</h2>

              <div className="space-y-8">
                <div
                  className="w-full border border-black/[0.03] bg-white p-16 text-center hover:bg-black group transition-all cursor-pointer relative"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AnimatePresence>
                    {uploadLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center flex-col gap-4"
                      >
                        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent mx-auto"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black">Uploading to Archive...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Upload className="h-10 w-10 text-gray-200 group-hover:text-white transition-colors mx-auto mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                    Drag Visual Assets or Initialize Browser Selection
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-4 group-hover:text-gray-500">
                    Max Size: 5MB Per Instance
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {formData.images.map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group aspect-square bg-white border border-black/[0.03] overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`Archive ${index + 1}`}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="absolute top-2 right-2 bg-black text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center pt-8 border-t border-black/[0.02]">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all flex items-center gap-3"
                  >
                    <Camera className="h-4 w-4" /> Initialize Live Capture
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-12">
            <div className="bg-gray-50/50 border border-black/[0.03] p-10 space-y-10">
              <h2 className="text-xl font-black text-black uppercase tracking-tighter italic border-b border-black/[0.03] pb-6">Valuation & Stock</h2>

              <div className="space-y-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block font-sans italic">Primary Valuation (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev: ProductForm) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-white border border-black/[0.03] px-5 py-4 text-xl font-black text-black focus:outline-none focus:border-black/10 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block font-sans italic">Registry Valuation (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData((prev: ProductForm) => ({
                      ...prev,
                      originalPrice: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    className="w-full bg-white border border-black/[0.03] px-5 py-4 text-sm font-bold text-gray-400 focus:outline-none focus:border-black/10 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block font-sans italic">Inventory Volume</label>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-black text-white"><Package className="h-5 w-5" /></div>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev: ProductForm) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="flex-1 bg-white border border-black/[0.03] px-5 py-4 text-sm font-black text-black focus:outline-none focus:border-black/10 transition-all text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 border border-black/[0.03] p-10 space-y-10">
              <h2 className="text-xl font-black text-black uppercase tracking-tighter italic border-b border-black/[0.03] pb-6">Taxonomy & Pointer</h2>

              <div className="space-y-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Master Classification</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData((prev: ProductForm) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white border border-black/[0.03] px-6 py-5 text-[10px] font-black uppercase tracking-widest text-black appearance-none focus:outline-none focus:border-black/10 transition-all"
                  >
                    <option value="tshirts">T-SHIRTS</option>
                    <option value="shirts">SHIRTS</option>
                    <option value="accessories">ACCESSORIES</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Sub-Classification</label>
                  <select
                    required
                    value={formData.subcategory}
                    onChange={(e) => setFormData((prev: ProductForm) => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full bg-white border border-black/[0.03] px-6 py-5 text-[10px] font-black uppercase tracking-widest text-black appearance-none focus:outline-none focus:border-black/10 transition-all"
                  >
                    <option value="casual">CASUAL</option>
                    <option value="premium">PREMIUM</option>
                    <option value="vintage">VINTAGE</option>
                    <option value="limited">LIMITED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 border border-black/[0.03] p-10 space-y-10">
              <h2 className="text-xl font-black text-black uppercase tracking-tighter italic border-b border-black/[0.03] pb-6">Strategic Metadata</h2>

              <div className="space-y-8">
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData((prev: ProductForm) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    className={cn(
                      "w-full py-4 text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-between px-6",
                      formData.isFeatured ? "bg-black text-white border-black" : "bg-white text-gray-400 border-black/[0.03]"
                    )}
                  >
                    <span>Featured Placement</span>
                    <TrendingUp className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev: ProductForm) => ({ ...prev, isOnSale: !prev.isOnSale }))}
                    className={cn(
                      "w-full py-4 text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-between px-6",
                      formData.isOnSale ? "bg-black text-white border-black" : "bg-white text-gray-400 border-black/[0.03]"
                    )}
                  >
                    <span>Archive Sale Display</span>
                    <Tag className="h-3 w-3" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Metadata Tags</label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 bg-white border border-black/[0.03] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black focus:outline-none"
                      placeholder="e.g. SILK"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      Initialize
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 px-3 py-1.5 border border-black/[0.03] flex items-center gap-2 group hover:text-black hover:border-black/10 transition-all cursor-pointer"
                        onClick={() => removeTag(index)}
                      >
                        {tag} <X className="h-2 w-2" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

