"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Code2,
  Palette,
  BarChart4,
  TrendingUp,
  Wallet,
  Globe,
  ArrowRight,
  Sparkles,
  Zap,
  Users2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const team = [
  {
    name: 'VINAY PRAKASH TIWARI',
    role: 'CHAIRMAN & STRATEGIC DIRECTIONER',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The MD of School Daddy\'s International School and our primary fundraiser. The visionary force guiding our journey from Chandauli to the world.'
  },
  {
    name: 'ADARSH',
    role: 'CHIEF TECHNOLOGY OFFICER',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Lead architect and developer. Transforming the visionary goals of our leadership into a high-performance commerce engine.'
  },
  {
    name: 'DAKSH',
    role: 'CREATIVE DIRECTOR',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Master of aesthetics, ensuring every pixel aligns with our premium design philosophy.'
  },
  {
    name: 'SAMIKSHA',
    role: 'VISUAL DESIGNER',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Crafting the visual language that defines the Showroom Se Bhi Sasta brand identity.'
  },
  {
    name: 'TARUN',
    role: 'OPERATIONS MANAGER',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The management backbone keeping the boutique operations fluid and efficient.'
  },
  {
    name: 'AYUSH',
    role: 'GROWTH & SALES',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Strategic lead for market expansion and customer relationship management.'
  },
  {
    name: 'SPARSH',
    role: 'FINANCIAL CONTROLLER',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Expert oversight of accountancy and financial planning for sustainable growth.'
  }
]

const values = [
  {
    icon: Zap,
    title: 'RAPID INNOVATION',
    description: 'We move fast, breaking the conventional boundaries of school-age potential.',
  },
  {
    icon: Sparkles,
    title: 'PREMIUM QUALITY',
    description: 'Only the finest materials and code find their way into our ecosystem.',
  },
  {
    icon: Globe,
    title: 'GLOBAL VISION',
    description: 'Started in a hostel, built for the world.',
  },
  {
    icon: Users2,
    title: 'COMMUNITY DRIVEN',
    description: 'Empowering our clientele with exclusive boutique access.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-12 sm:pt-24 sm:pb-16 border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6"
            >
              ESTABLISHED IN ROOM 302
            </motion.p>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-black uppercase tracking-tighter italic leading-[0.85] mb-8">
              The Boutique <br />
              <span className="text-gray-200">Genesis</span>
            </h1>
            <p className="text-sm sm:text-lg max-w-2xl mx-auto text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              Crafting premium commerce experiences <br className="hidden sm:block" />
              from the heart of a student hostel.
            </p>
          </motion.div>
        </div>

        {/* Decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.015] select-none">
          <h2 className="text-[30vw] font-black uppercase italic whitespace-nowrap">HOSTEL LIFE</h2>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-12 bg-white border-b border-black/[0.03] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden border border-black/[0.03]">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                  alt="Hostel Lab"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-black p-8 hidden sm:block">
                <p className="text-white text-5xl font-black italic tracking-tighter">01.</p>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mt-4">THE LAB CONCEPT</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-tighter italic leading-tight">
                From Chandauli <br /> To Global Scales.
              </h2>
              <div className="space-y-6 text-gray-500 font-semibold leading-relaxed">
                <p>
                  Showroom Se Bhi Sasta wasn't born in a Silicon Valley boardroom. It was forged under the leadership of <span className="text-black font-black">VINAY PRAKASH TIWARI</span>, the Managing Director of School Daddy's International School (Kanta Bishunpura, Chandauli, UP).
                </p>
                <p>
                  As our primary fundraiser and strategic directioner, he empowered a team of visionary school students to turn a hostel-room concept into a professional reality.
                </p>
                <p>
                  Led technically by <span className="text-black font-black">ADARSH</span>, we proved that with the right guidance, age is no barrier to excellence. What started with shared Wi-Fi in the school hostel is now a sophisticated commerce platform.
                </p>
              </div>
              <div className="pt-8">
                <button className="flex items-center gap-4 group">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black border-b-2 border-black pb-2 transition-all group-hover:pr-4">
                    Explore the Registry
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white border-b border-black/[0.03] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-5xl sm:text-7xl font-black text-black uppercase tracking-tighter italic mb-2">
              The <span className="text-gray-200">Collective</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">BOARD OF DIRECTORS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[3/4] bg-gray-50 mb-8 overflow-hidden border border-black/[0.03] relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-6">
                    <p className="text-white text-[10px] font-bold leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight italic mb-1">
                  {member.name}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white border-b border-black/[0.03] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 bg-gray-50/50 border border-black/[0.03] hover:border-black/10 transition-all group"
                >
                  <div className="p-4 bg-black text-white inline-block mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 " />
                  </div>
                  <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">
                    {value.title}
                  </h3>
                  <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter italic mb-8">
              Join the <br /> Revolution
            </h2>
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all"
            >
              Enter Boutique
            </motion.a>
          </motion.div>
        </div>

        {/* Decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] select-none">
          <h2 className="text-[40vw] font-black uppercase italic text-white whitespace-nowrap">INITIATE</h2>
        </div>
      </section>
    </div>
  )
}
