'use client'

import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ContainerScrollProps {
  titleComponent: ReactNode
  children: ReactNode
}

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row"
    >
      <div className="w-full md:sticky md:top-32 md:w-1/3">{titleComponent}</div>
      <motion.div
        style={{ scale, y: translateY }}
        className="w-full md:w-2/3 rounded-3xl border border-slate-200 bg-slate-900 shadow-2xl shadow-slate-900/40 overflow-hidden min-h-[320px] flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  )
}

