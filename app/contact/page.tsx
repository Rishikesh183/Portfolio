import { Phone, Mail } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <section id="contact" className="py-12 px-4 text-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Let&apos;s Connect</h2>
        <p className="text-sm sm:text-base text-gray-300 mb-6">
          Drop me a message or connect on{" "}
          <span className="text-green-500 font-semibold">
            <a href="https://www.linkedin.com/in/rishikesh24/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
          <a
            href="mailto:rishikeshdevarashetty@gmail.com"
            className="w-full sm:w-auto text-base sm:text-lg md:text-xl bg-cyan-400 rounded-full py-2 px-4 md:p-3 flex justify-center gap-2 items-center font-bold text-white hover:bg-cyan-500 transition-colors"
          >
            <Mail size={20} /> Mail Me
          </a>
          
          <a
            href="https://wa.me/917013848045"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-base sm:text-lg md:text-xl bg-green-400 rounded-full py-2 px-4 md:p-3 flex justify-center gap-2 items-center font-bold text-white hover:bg-green-500 transition-colors"
          >
            <Phone size={20} /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default page