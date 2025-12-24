'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, MapPin, Home, Building, User, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import AddressAutocomplete from './AddressAutocomplete'
import { useAddresses, type Address, type AddressInput } from '@/hooks/useAddresses'
import { toast } from 'sonner'

interface AddressFormData extends AddressInput {
  name: string
}

export default function AddressBook() {
  const { addresses, loading, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<AddressFormData>({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      isDefault: false
    })
    setEditingAddress(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
      coordinates: address.coordinates,
      placeId: address.placeId
    })
    setIsDialogOpen(true)
  }

  const handleAddressSelect = (addressComponents: any) => {
    setFormData(prev => ({
      ...prev,
      street: addressComponents.street,
      city: addressComponents.city,
      state: addressComponents.state,
      zip: addressComponents.zip,
      country: addressComponents.country,
      coordinates: addressComponents.coordinates,
      placeId: addressComponents.placeId
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim() || !formData.country.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData)
      } else {
        await addAddress(formData)
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleDelete = async (addressId: string) => {
    await deleteAddress(addressId)
  }

  const handleSetDefault = async (addressId: string) => {
    await setDefaultAddress(addressId)
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />
      case 'work':
        return <Building className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Home'
      case 'work':
        return 'Work'
      default:
        return 'Other'
    }
  }

  if (loading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-white border border-black/[0.03] p-8">
        <div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Address Book</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Manage your saved delivery addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddDialog}
              className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white border-none rounded-none p-10">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-black text-black uppercase tracking-tighter italic">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'home' | 'work' | 'other') =>
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-black/[0.03] rounded-none">
                      <SelectItem value="home" className="text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Home className="h-3 w-3" />
                          Home
                        </div>
                      </SelectItem>
                      <SelectItem value="work" className="text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3" />
                          Work
                        </div>
                      </SelectItem>
                      <SelectItem value="other" className="text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Label</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Home"
                    required
                    className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Search Address</Label>
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="Street, City, Country..."
                  defaultValue={editingAddress ? `${formData.street}, ${formData.city}, ${formData.state}` : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="123 Main Street"
                  required
                  className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="New York"
                    required
                    className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-[10px] font-black uppercase tracking-widest text-gray-400">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="NY"
                    required
                    className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-[10px] font-black uppercase tracking-widest text-gray-400">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="10001"
                    required
                    className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="United States"
                    required
                    className="bg-gray-50 border border-black/[0.03] rounded-none py-6 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="default"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isDefault: checked as boolean }))
                  }
                  className="border-black/[0.1] data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <Label htmlFor="default" className="text-[10px] font-black uppercase tracking-widest text-black/70">Set as default delivery address</Label>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all">
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" />}
                  {editingAddress ? 'Update Changes' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] hover:bg-black hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-gray-50 border border-black/[0.03] p-24 text-center">
          <MapPin className="h-16 w-16 text-gray-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">No addresses saved</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">Add your delivery addresses to speed up checkout.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddDialog}
            className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add First Address
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address._id} className={`bg-white border p-8 flex flex-col justify-between group transition-all ${address.isDefault ? 'border-black ring-1 ring-black' : 'border-black/[0.03]'}`}>
              <div className="flex justify-between items-start mb-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                    {getAddressIcon(address.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-black uppercase tracking-widest leading-none mb-2">{address.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-gray-50 border border-black/[0.03] text-gray-400">
                        {getAddressTypeLabel(address.type)}
                      </span>
                      {address.isDefault && (
                        <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-black text-white">Default</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditDialog(address)}
                    className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white rounded-none border-none p-10">
                      <AlertDialogHeader className="mb-8">
                        <AlertDialogTitle className="text-2xl font-black text-black uppercase tracking-tighter italic leading-none">Delete Address</AlertDialogTitle>
                        <AlertDialogDescription className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                          Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-4">
                        <AlertDialogCancel className="rounded-none border-black/[0.03] text-[10px] font-black uppercase tracking-widest px-8 py-6 hover:bg-black hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(address._id)}
                          className="bg-red-600 hover:bg-red-700 rounded-none text-[10px] font-black uppercase tracking-widest px-8 py-6"
                        >
                          Delete Permanent
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="space-y-1 mb-10">
                <p className="text-sm font-bold text-black">{address.street}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{address.city}, {address.state} {address.zip}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{address.country}</p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  disabled={loading}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest border border-black/[0.03] text-gray-400 hover:text-black hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

