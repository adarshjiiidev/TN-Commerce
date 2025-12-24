"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function BrandStatement() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-black/[0.03]">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-black leading-[1.1] tracking-tighter uppercase italic">
                        Quality is the <span className="text-gray-500">New Cool</span>.
                        <br />
                        Minimalist <span className="not-italic">Store</span> for the
                        <br />
                        Next <span className="underline decoration-black decoration-4 underline-offset-8">Generation</span>.
                    </h2>
                </motion.div>
            </div>
        </section>
    )
}
