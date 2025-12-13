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
      <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session || !session.user.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0d0d12]/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-heading">User Management</h1>
                <p className="text-sm text-gray-400">Manage user accounts and permissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a24]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/20">
                <UserIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a24]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/20">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Administrators</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.isAdmin).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a24]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Today</p>
                <p className="text-2xl font-bold text-white">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a24]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'admin' | 'user')}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
              <p className="text-gray-400 max-w-sm">
                {searchTerm || filter !== 'all' ? 'Try adjusting your search criteria.' : 'No users have registered yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400 font-medium">
                  <tr>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
                            <img
                              className="h-full w-full object-cover"
                              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                              alt={user.name}
                            />
                          </div>
                          <div className="font-medium text-white">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-400 gap-2">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                          user.isAdmin
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        )}>
                          {user.isAdmin ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                            className={cn(
                              "h-8 text-xs border-white/10 bg-black/20 hover:bg-white/10",
                              user.isAdmin ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"
                            )}
                          >
                            {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteUser(user._id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
