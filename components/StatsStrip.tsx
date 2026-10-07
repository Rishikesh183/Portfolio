'use client'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type Stat = {
  value: number
  suffix?: string
  prefix?: string
  label: string
  sub: string
}

const stats: Stat[] = [
  { value: 590, suffix: '+', label: 'DSA problems', sub: '343 LeetCode · 247 GFG' },
  { value: 3, label: 'Products shipped', sub: 'Voice AI · Content gen · Social' },
  { value: 2, suffix: 'x', label: 'Hackathon finalist', sub: 'Meta AI x HF · OpenAI Codex' },
  { value: 174, suffix: 'k', label: 'Stars on Bootstrap', sub: 'Merged PR #42416' },
]

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    // Reduced motion snaps on the first frame rather than setting state
    // synchronously inside the effect body.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : durationMs

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = duration <= 0 ? 1 : Math.min((now - start) / duration, 1)
      // easeOutCubic so the number decelerates into its final value
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, durationMs])

  return value
}

function StatTile({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const count = useCountUp(stat.value, active)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition hover:border-cyan-400/30"
    >
      <p className="text-3xl font-bold text-cyan-300 md:text-4xl">
        {stat.prefix}
        {count}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{stat.label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{stat.sub}</p>
    </motion.div>
  )
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatTile key={stat.label} stat={stat} active={inView} index={index} />
      ))}
    </div>
  )
}
