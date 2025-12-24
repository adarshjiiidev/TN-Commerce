'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Filter, Trash2, Shield, User as UserIcon, MoreHorizontal, Mail, Calendar, ChevronDown, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { User } from '@/types'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { cn } from '@/lib/utils'

export default function UsersManagement() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !session.user.isAdmin) {
      redirect('/auth/signin')
      return
    }

    fetchUsers()
  }, [session, status])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
      } else {
        console.error('Failed to fetch users:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      })

      const data = await response.json()
      if (data.success) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, isAdmin: !isAdmin } : user
        ))
      } else {
        alert('Failed to update user: ' + data.error)
      }
    } catch (error) {
      alert('Failed to update user: ' + error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        setUsers(users.filter(user => user._id !== userId))
      } else {
        alert('Failed to delete user: ' + data.error)
      }
    } catch (error) {
      alert('Failed to delete user: ' + error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' ||
      (filter === 'admin' && user.isAdmin) ||
      (filter === 'user' && !user.isAdmin)
    return matchesSearch && matchesFilter
  })

  if (status === 'loading' && loading) {
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
                <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">User Management</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Manage boutique access and permissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/50 border border-black/[0.03] p-8">
            <div className="flex items-center gap-6">
              <div className="bg-black text-white p-4">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Clientele</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter italic">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 border border-black/[0.03] p-8">
            <div className="flex items-center gap-6">
              <div className="bg-black text-white p-4">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Administrators</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter italic">{users.filter(u => u.isAdmin).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 border border-black/[0.03] p-8">
            <div className="flex items-center gap-6">
              <div className="bg-black text-white p-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Verification</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter italic">SECURE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50/50 border border-black/[0.03] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clientele by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'admin' | 'user')}
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.03] text-sm font-bold text-black appearance-none focus:outline-none focus:border-black/10 transition-all"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-black/[0.03] overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8">
                <UserIcon className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">No users found</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-w-sm">
                Refine your selection to find the desired user profiles.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-black/[0.03]">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Client Profile</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Email Address</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Auth Level</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Member Since</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <div className="h-12 w-12 bg-gray-50 overflow-hidden relative">
                            <img
                              className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=000&color=fff`}
                              alt={user.name}
                            />
                          </div>
                          <div className="text-sm font-black text-black uppercase tracking-tight">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 gap-2">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                          user.isAdmin
                            ? "bg-black text-white border-black"
                            : "bg-gray-50 text-gray-400 border-black/[0.03]"
                        )}>
                          {user.isAdmin ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                          {user.isAdmin ? 'Administrator' : 'Client'}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                            className={cn(
                              "px-6 py-2 text-[9px] font-black uppercase tracking-widest border transition-all",
                              user.isAdmin
                                ? "text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
                                : "text-black border-black/[0.03] hover:bg-black hover:text-white"
                            )}
                          >
                            {user.isAdmin ? 'Revoke Access' : 'Grant Admin'}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
