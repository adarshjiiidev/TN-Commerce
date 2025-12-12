"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/components/ui/loading'

export default function WishlistRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard with list section
    router.replace('/dashboard?section=list')
  }, [router])

  return (
    <div className="min-h-screen bg-[#0d0d12] pt-20 flex items-center justify-center">
      <Loading text="Redirecting to your wishlist..." />
    </div>
  )
}
