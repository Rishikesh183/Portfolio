'use client'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function ProjectCard({
  title,
  description,
  link,
}: {
  title: string
  description: string
  link: string
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-cyan-400/30"
    >
      <h3 className="text-xl font-bold text-cyan-200">{title}</h3>

      <p className="mt-3 flex-grow text-sm leading-6 text-slate-300">{description}</p>

      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
      >
        View project
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </motion.article>
  )
}
