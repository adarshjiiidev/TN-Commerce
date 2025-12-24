'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Zap } from 'lucide-react'

interface Settings {
    flashSaleEnabled: boolean
    flashSaleEndTime: string
    flashSaleTitle: string
    flashSaleDescription: string
    flashSaleProducts: string[]
}

interface Product {
    _id: string
    name: string
    price: number
    originalPrice?: number
    images: string[]
    category: string
}

export default function FlashSaleSettingsPage() {
    const { data: session, status } = useSession()
    const [settings, setSettings] = useState<Settings>({
        flashSaleEnabled: false,
        flashSaleEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        flashSaleTitle: 'Flash Sale',
        flashSaleDescription: 'Limited Time Collection',
        flashSaleProducts: []
    })
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (status === 'loading') return

        if (!session || !session.user.isAdmin) {
            redirect('/auth/signin')
            return
        }

        fetchSettings()
    }, [session, status])

    const fetchSettings = async () => {
        try {
            const [settingsRes, productsRes] = await Promise.all([
                fetch('/api/admin/settings'),
                fetch('/api/products?limit=100')
            ])

            const settingsData = await settingsRes.json()
            const productsData = await productsRes.json()

            if (settingsData.success) {
                setSettings({
                    flashSaleEnabled: settingsData.data.flashSaleEnabled || false,
                    flashSaleEndTime: settingsData.data.flashSaleEndTime
                        ? new Date(settingsData.data.flashSaleEndTime).toISOString().slice(0, 16)
                        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    flashSaleTitle: settingsData.data.flashSaleTitle || 'Flash Sale',
                    flashSaleDescription: settingsData.data.flashSaleDescription || 'Limited Time Collection',
                    flashSaleProducts: settingsData.data.flashSaleProducts || []
                })
            }

            if (productsData.success) {
                setAllProducts(productsData.data.products)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })

            const data = await response.json()

            if (data.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' })
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save settings' })
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            setMessage({ type: 'error', text: 'Failed to save settings' })
        } finally {
            setSaving(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
            </div>
        )
    }

    if (!session || !session.user.isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <br /><br /><br />
            <div className="bg-white border-b border-black/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/admin" className="text-black hover:text-gray-600 transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black text-black uppercase tracking-tighter italic flex items-center gap-3">
                                    <Zap className="h-7 w-7" />
                                    Flash Sale Settings
                                </h1>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                                    Manage flash sale visibility and timing
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-4 border ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        <p className="text-sm font-bold uppercase tracking-widest">{message.text}</p>
                    </motion.div>
                )}

                <div className="bg-gray-50 border border-black/5 p-8 space-y-8">
                    {/* Enable Flash Sale */}
                    <div className="flex items-center justify-between pb-6 border-b border-black/5">
                        <div>
                            <h3 className="text-sm font-black text-black uppercase tracking-tighter italic">Enable Flash Sale</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                Show flash sale section on homepage
                            </p>
                        </div>
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, flashSaleEnabled: !prev.flashSaleEnabled }))}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${settings.flashSaleEnabled ? 'bg-black' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.flashSaleEnabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Sale Title */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Sale Title
                        </label>
                        <input
                            type="text"
                            value={settings.flashSaleTitle}
                            onChange={(e) => setSettings(prev => ({ ...prev, flashSaleTitle: e.target.value }))}
                            className="w-full bg-white border border-black/5 px-4 py-3 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all font-medium"
                            placeholder="Flash Sale"
                        />
                    </div>

                    {/* Sale Description */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Sale Description
                        </label>
                        <input
                            type="text"
                            value={settings.flashSaleDescription}
                            onChange={(e) => setSettings(prev => ({ ...prev, flashSaleDescription: e.target.value }))}
                            className="w-full bg-white border border-black/5 px-4 py-3 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all font-medium"
                            placeholder="Limited Time Collection"
                        />
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Sale End Time
                        </label>
                        <input
                            type="datetime-local"
                            value={settings.flashSaleEndTime}
                            onChange={(e) => setSettings(prev => ({ ...prev, flashSaleEndTime: e.target.value }))}
                            className="w-full bg-white border border-black/5 px-4 py-3 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black/20 transition-all font-medium"
                        />
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                            Timer will count down to this date/time
                        </p>
                    </div>

                    {/* Product Selection */}
                    <div className="pt-6 border-t border-black/5">
                        <h3 className="text-sm font-black text-black uppercase tracking-tighter italic mb-4">
                            Select Products for Flash Sale
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
                            {settings.flashSaleProducts.length} product{settings.flashSaleProducts.length !== 1 ? 's' : ''} selected
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                            {allProducts.map((product) => {
                                const isSelected = settings.flashSaleProducts.includes(product._id)
                                return (
                                    <motion.div
                                        key={product._id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setSettings(prev => ({
                                                ...prev,
                                                flashSaleProducts: isSelected
                                                    ? prev.flashSaleProducts.filter(id => id !== product._id)
                                                    : [...prev.flashSaleProducts, product._id]
                                            }))
                                        }}
                                        className={`cursor-pointer border-2 ${isSelected ? 'border-black bg-black/5' : 'border-black/10 bg-white'
                                            } p-2 transition-all`}
                                    >
                                        <div className="aspect-square bg-gray-100 mb-2 relative overflow-hidden">
                                            {product.images[0] && (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center">
                                                        ✓
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-black truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 mt-1">
                                            ₹{product.price}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="mt-8 bg-black text-white p-8 border border-black/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Preview</p>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-2">
                        {settings.flashSaleTitle || 'Flash Sale'}
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
                        {settings.flashSaleDescription || 'Limited Time Collection'}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest">
                        {settings.flashSaleEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const dynamic = 'force-dynamic'
