'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="min-h-[50vh] flex items-center justify-center text-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-3xl"
            >
                <div className='rounded-full flex justify-center p-4 md:p-8'>
                    <Image src="/Dev.png" alt='dev' width={132} height={132} className="w-24 h-24 md:w-32 md:h-32" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                    Hi, I&apos;m <span className="text-cyan-400">Rishi</span>
                </h1>
                <p className="text-base md:text-lg font-semibold mx-auto text-gray-300">
                    Aspiring Software Engineer with a passion for AI and Full Stack Development. Computer Engineering student building real-world projects and exploring modern technologies
                </p>
            </motion.div>
        </section>
    )
}