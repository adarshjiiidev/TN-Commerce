"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function Loading({ className, size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn(
        'border-2 border-black border-t-transparent rounded-full animate-spin',
        sizeClasses[size]
      )} />
      {text && (
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">{text}</span>
      )}
    </div>
  )
}
