"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Oversized',
    slug: 'oversized',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    gridSpan: 'md:col-span-2'
  },
  {
    name: 'Regular Fit',
    slug: 'regular',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    gridSpan: 'md:col-span-1'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    gridSpan: 'md:col-span-1'
  },
  {
    name: 'Essentials',
    slug: 'essentials',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    gridSpan: 'md:col-span-2'
  }
]

export default function CategoryGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden group cursor-pointer border border-black/5 aspect-[3/4] ${category.gridSpan || ''}`}
            >
              <Link href={`/products?category=${category.slug}`} className="block h-full relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
                  <div>
                    <span className="text-[10px] font-bold text-black bg-white px-3 py-1 uppercase tracking-widest mb-2 inline-block">
                      Collection
                    </span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{category.name}</h3>
                  </div>
                  <div className="h-10 w-10 bg-white flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="h-4 w-4 text-black" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
