'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProjectCard({ title, description, link }: { title: string, description: string, link: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/30 h-full flex flex-col"
    >
      <div className='flex flex-col gap-1 flex-grow'>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-cyan-300">{title}</h3>
        <p className="text-sm sm:text-md font-semibold text-gray-300 flex-grow">{description}</p>
        <Link 
          href={link}
          className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mt-3 w-full sm:w-auto sm:inline-block self-start cursor-pointer'
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
        </Link>
      </div>
    </motion.div>
  )
}