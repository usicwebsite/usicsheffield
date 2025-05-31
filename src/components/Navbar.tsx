"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change navbar style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#18384D] shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and site name */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Image
              src="/1. USIC Full Logo.svg"
              alt="USIC Logo"
              width={60}
              height={60}
              className="w-auto h-12"
              style={{ filter: 'invert(1)' }} // Make the black SVG white
            />
            <Link href="/" className="font-bold text-xl md:text-2xl text-white">
              USIC
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-blue-200 transition duration-300">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-blue-200 transition duration-300">
              About Us
            </Link>
            <Link href="/events" className="text-white hover:text-blue-200 transition duration-300">
              Events
            </Link>
            <Link href="/membership" className="text-white hover:text-blue-200 transition duration-300">
              Membership
            </Link>
            <Link href="/resources" className="text-white hover:text-blue-200 transition duration-300">
              Resources
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-200 transition duration-300">
              Blog
            </Link>
            <Link href="/sponsors" className="text-white hover:text-blue-200 transition duration-300">
              Sponsors
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-[#234b64]/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#18384D] shadow-lg">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/events" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/membership" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Membership
            </Link>
            <Link 
              href="/resources" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              href="/blog" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/sponsors" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sponsors
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 