import { Phone, Mail, GitBranch, Linkedin } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-black w-full py-4 md:py-6 text-white flex justify-center items-center px-3'>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-6 text-xs sm:text-sm md:text-md max-w-full">
        <a href="tel:+917013848045" className="flex items-center gap-1 md:gap-2 hover:text-purple-300 transition-colors">
          <Phone size={16} />
          <span>+91-7013848045</span>
        </a>
        <a href="mailto:rishikeshdevarashetty@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 hover:text-purple-300 transition-colors">
          <Mail size={16} />
          <span className="truncate max-w-32 sm:max-w-none">rishikeshdevarashetty@gmail.com</span>
        </a>
        <a href="https://linkedin.com/in/rishikesh24" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 hover:text-purple-300 transition-colors">
          <Linkedin size={16} />
          <span>Linkedin</span>
        </a>
        <a href="https://github.com/Rishikesh183" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 hover:text-purple-300 transition-colors">
          <GitBranch size={16} />
          <span>Github</span>
        </a>
      </div>
    </footer>
  )
}

export default Footer