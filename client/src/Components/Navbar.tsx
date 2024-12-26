'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, PlusSquare } from 'lucide-react'
import Image from 'next/image'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav className="bg-slate-900 p-4 fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-blue-400 font-bold text-2xl">
            <Link href="/">StartupConnect</Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center">
            <Link href="/search" className="text-white mr-4">
              <Search className="w-6 h-6" />
            </Link>
            <Link href="/create-post" className="text-white mr-4">
              <PlusSquare className="w-6 h-6" />
            </Link>
            <button onClick={toggleMobileMenu} className="text-white">
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-6 text-slate-400">
              <Link href="/" className="hover:text-blue-400">Home</Link>
              <Link href="/contact" className="hover:text-blue-400">Contact</Link>
              <Link href="/about" className="hover:text-blue-400">About</Link>
            </div>
            <Image
              src="https://via.placeholder.com/40"
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-blue-400"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed top-[64px] left-0 right-0 bottom-0 bg-slate-900 z-30
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:hidden flex items-start pt-6
        `}
      >
        <div className="flex flex-col items-center space-y-6 w-full px-6">
          <Link 
            href="/" 
            className="text-slate-200 text-xl font-medium hover:text-blue-400 transition-colors
                     border-y border-slate-700 py-3 hover:border-blue-400 w-full text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/contact" 
            className="text-slate-200 text-xl font-medium hover:text-blue-400 transition-colors
                     border-y border-slate-700 py-3 hover:border-blue-400 w-full text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className="text-slate-200 text-xl font-medium hover:text-blue-400 transition-colors
                     border-y border-slate-700 py-3 hover:border-blue-400 w-full text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar


