'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Github, Linkedin, MapPin, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const roles = [
    'Agentic AI Engineer',
    'Full Stack Developer',
    'Enthusiastic Learner',
    'LLM Explorer',
]

export default function Hero() {
    const [roleIndex, setRoleIndex] = useState(0)

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length)
        }, 2600)

        return () => window.clearInterval(intervalId)
    }, [])

    return (
        <section className="flex items-center justify-center px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-3xl"
            >
                <div className="relative mx-auto mb-5 flex w-fit justify-center p-4 md:p-6">
                    <span className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl md:h-32 md:w-32" />
                    <Image
                        src="/Dev.png"
                        alt="dev"
                        width={132}
                        height={132}
                        priority
                        className="relative h-24 w-24 rounded-full ring-2 ring-cyan-400/30 md:h-32 md:w-32"
                    />
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                    {/* <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        Open to new roles
                    </span> */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                        <MapPin size={13} /> Hyderabad, India
                    </span>
                </div>

                <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    Hi, I&apos;m <span className="text-cyan-400">Rishikesh</span>
                </h1>

                <div className="mb-4 flex h-8 items-center justify-center overflow-hidden">
                    <motion.p
                        key={roleIndex}
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -18, opacity: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300 bg-clip-text text-lg font-semibold text-transparent md:text-xl"
                    >
                        {roles[roleIndex]}
                    </motion.p>
                </div>

                <p className="mx-auto max-w-2xl text-base font-medium leading-7 text-gray-300">
                    I build LLM voice agents, content generators and real-time systems — currently
                    building products at SLRI Solutions. Meta x Hf hackathon finalist, with a
                    Open source contribution in Bootstrap.
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/resume"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-400 sm:w-auto"
                    >
                        View Resume
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                        href="/chat"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-white/5 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/60 hover:bg-white/10 sm:w-auto"
                    >
                        <MessageCircle size={16} />
                        Ask my AI anything
                    </Link>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                    <a
                        href="https://github.com/Rishikesh183"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                        <Github size={18} />
                    </a>
                    <a
                        href="https://linkedin.com/in/rishikesh24"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                        <Linkedin size={18} />
                    </a>
                </div>
            </motion.div>
        </section>
    )
}
