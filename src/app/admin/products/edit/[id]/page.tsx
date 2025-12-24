'use client'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Camera, Upload, Save, AlertCircle, CheckCircle2, Tag as TagIcon, Layers, Package, DollarSign, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  _id: string
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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [tagInput, setTagInput] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchProduct()
  }, [session, status, id])

  const fetchProduct = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/admin/products/${id}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.data)
      } else {
        alert('Failed to fetch product: ' + data.error)
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Error fetching product')
      router.push('/admin/products')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product) return

    if (!product.name || !product.description || product.price <= 0) {
      alert('Please fill in all required fields')
      return
    }

    if (product.images.length === 0) {
      alert('Please add at least one product image')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })

      const data = await response.json()

      if (data.success) {
        alert('Product updated successfully!')
        router.push('/admin/products')
      } else {
        alert('Failed to update product: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

    try {
      setUploadLoading(true)

      // Convert to base64 for simple storage (in production, use cloud storage)
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setProduct(prev => prev ? ({
          ...prev,
          images: [...prev.images, base64String]
        }) : null)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setShowCamera(true)

      // Simple camera implementation - in production, use a proper camera library
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      // For now, just close the camera modal
      setTimeout(() => {
        setShowCamera(false)
        stream.getTracks().forEach(track => track.stop())
      }, 3000)

    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Error accessing camera. Please check permissions.')
    }
  }

  const removeImage = (index: number) => {
    if (product) {
      setProduct(prev => prev ? ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }) : null)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && product && !product.tags.includes(tagInput.trim())) {
      setProduct(prev => prev ? ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }) : null)
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    if (product) {
      setProduct(prev => prev ? ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }) : null)
    }
  }

  if (status === 'loading' || fetching) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-2 border-black border-t-transparent mx-auto"></div>
      </div>
    )
  }

  if (!session || !session.user.isAdmin || !product) {
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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">Edit Product</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Refine your boutique listing details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white border border-black/[0.03] p-8 space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-black/[0.02]">
                  <Info className="h-4 w-4 text-black" />
                  <h2 className="text-xl font-black text-black uppercase tracking-tighter italic">Registry Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Listing Title
                    </label>
                    <input
                      type="text"
                      required
                      value={product.name}
                      onChange={(e) => setProduct(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all placeholder:text-gray-300"
                      placeholder="e.g. Signature Oversized Tee"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Description Narrative
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={product.description}
                      onChange={(e) => setProduct(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all placeholder:text-gray-300 resize-none"
                      placeholder="Describe the essence of this piece..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/[0.03] p-8 space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-black/[0.02]">
                  <DollarSign className="h-4 w-4 text-black" />
                  <h2 className="text-xl font-black text-black uppercase tracking-tighter italic">Valuation & Stock</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Price Point (USD)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => setProduct(prev => prev ? ({ ...prev, price: parseFloat(e.target.value) || 0 }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Original / MSRP (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.originalPrice || ''}
                      onChange={(e) => setProduct(prev => prev ? ({
                        ...prev,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined
                      }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Inventory Count
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={product.stock}
                      onChange={(e) => setProduct(prev => prev ? ({ ...prev, stock: parseInt(e.target.value) || 0 }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none focus:border-black/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/[0.03] p-8 space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-black/[0.02]">
                  <Layers className="h-4 w-4 text-black" />
                  <h2 className="text-xl font-black text-black uppercase tracking-tighter italic">Visual Assets</h2>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <label className="flex-1 relative cursor-pointer bg-black text-white px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center hover:bg-gray-900 transition-all">
                      <div className="flex items-center justify-center gap-3">
                        <Upload className="h-4 w-4" />
                        {uploadLoading ? 'Processing...' : 'Upload Asset'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadLoading}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleCameraCapture}
                      className="flex-1 bg-gray-50 border border-black/[0.03] text-black px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3"
                      disabled={showCamera}
                    >
                      <Camera className="h-4 w-4" />
                      Studio Capture
                    </button>
                  </div>

                  {product.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative aspect-[3/4] group overflow-hidden border border-black/[0.03]">
                          <img
                            src={image}
                            alt={`Asset ${index + 1}`}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-black text-white w-8 h-8 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Taxonomy & Actions */}
            <div className="space-y-12">
              <div className="bg-white border border-black/[0.03] p-8 space-y-8 sticky top-32">
                <div className="flex items-center gap-3 pb-4 border-b border-black/[0.02]">
                  <Package className="h-4 w-4 text-black" />
                  <h2 className="text-xl font-black text-black uppercase tracking-tighter italic">Taxonomy</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Primary Category
                    </label>
                    <select
                      required
                      value={product.category}
                      onChange={(e) => setProduct(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="tshirts">T-Shirts</option>
                      <option value="shirts">Shirts</option>
                      <option value="jeans">Jeans</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Sub-Division
                    </label>
                    <select
                      value={product.subcategory}
                      onChange={(e) => setProduct(prev => prev ? ({ ...prev, subcategory: e.target.value }) : null)}
                      className="w-full px-4 py-4 bg-gray-50 border border-black/[0.03] text-sm font-bold text-black focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="unisex">Unisex Division</option>
                      <option value="men">Menswear</option>
                      <option value="women">Womenswear</option>
                    </select>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-black/[0.02]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">Featured Status</span>
                      <input
                        type="checkbox"
                        checked={product.isFeatured}
                        onChange={(e) => setProduct(prev => prev ? ({ ...prev, isFeatured: e.target.checked }) : null)}
                        className="w-5 h-5 border-black/[0.1] rounded-none checked:bg-black focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-black/[0.02]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">Promotional Sale</span>
                      <input
                        type="checkbox"
                        checked={product.isOnSale}
                        onChange={(e) => setProduct(prev => prev ? ({ ...prev, isOnSale: e.target.checked }) : null)}
                        className="w-5 h-5 border-black/[0.1] rounded-none checked:bg-black focus:ring-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/[0.02] space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TagIcon className="h-4 w-4 text-black" />
                    <h2 className="text-lg font-black text-black uppercase tracking-tighter italic">Tagging</h2>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1 px-4 py-3 bg-gray-50 border border-black/[0.03] text-xs font-bold text-black focus:outline-none focus:border-black/10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 bg-black text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-50 border border-black/[0.03] text-[9px] font-black uppercase tracking-widest text-black/60"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 hover:text-black"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-black/[0.02] space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Persisting Changes...' : 'Save Product Updates'}
                  </motion.button>

                  <Link href="/admin/products" className="block">
                    <button
                      type="button"
                      className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border border-black/[0.03] hover:bg-gray-50 transition-all"
                    >
                      Discard & Exit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Camera Modal - Minimalist */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-black/[0.05] p-12 max-w-md w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-gray-50 mx-auto flex items-center justify-center border border-black/[0.02]">
                <Camera className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">Studio Connectivity</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">
                  Connecting to boutique capture hardware. Camera integration is currently in simulation mode for this registry item.
                </p>
              </div>
              <button
                onClick={() => setShowCamera(false)}
                className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-widest"
              >
                Close Studio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
