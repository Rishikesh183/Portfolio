'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full px-4 py-4 md:p-8 bg-black z-50 flex justify-between items-center"
    >
      <div className="text-lg md:text-xl text-white font-bold">
        <Link href="/">Rishi Dev</Link>
      </div>

      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop navigation */}
      <nav className="hidden md:block space-x-6">
        <Link href="/resume" className="text-white hover:text-cyan-400 transition-colors">Resume</Link>
        <Link href="/projects" className="text-white hover:text-cyan-400 transition-colors">Projects</Link>
        <Link href="/contact" className="text-white hover:text-cyan-400 transition-colors">Contact</Link>
        {/* <Link href="/chat" className="text-white hover:text-cyan-400 transition-colors">Chat</Link> */}
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 right-0 bg-black z-50 flex flex-col items-center py-4 shadow-lg"
        >
          <Link 
            href="/resume" 
            className="text-white hover:text-cyan-400 py-3 w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Resume
          </Link>
          <Link 
            href="/projects" 
            className="text-white hover:text-cyan-400 py-3 w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>
          <Link 
            href="/contact" 
            className="text-white hover:text-cyan-400 py-3 w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </motion.div>
      )}
    </motion.header>
  )
}