"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthStatus from './AuthStatus';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMembershipDropdownOpen, setIsMembershipDropdownOpen] = useState(false);
  const membershipDropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside to close membership dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (membershipDropdownRef.current && !membershipDropdownRef.current.contains(event.target as Node)) {
        setIsMembershipDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-blue-200 transition duration-300">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-blue-200 transition duration-300">
              About Us
            </Link>
            <Link href="/events" className="text-white hover:text-blue-200 transition duration-300">
              Events
            </Link>
            
            {/* Membership Dropdown */}
            <div className="relative" ref={membershipDropdownRef}>
              <button
                onClick={() => setIsMembershipDropdownOpen(!isMembershipDropdownOpen)}
                className="flex items-center space-x-1 text-white hover:text-blue-200 transition duration-300"
              >
                <span>Membership</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isMembershipDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMembershipDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      href="/membership"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                      onClick={() => setIsMembershipDropdownOpen(false)}
                    >
                      Journey
                    </Link>
                    <Link
                      href="/pricing"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                      onClick={() => setIsMembershipDropdownOpen(false)}
                    >
                      Pricing
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/resources" className="text-white hover:text-blue-200 transition duration-300">
              Resources
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-200 transition duration-300">
              Forum
            </Link>
            <Link href="/sponsors" className="text-white hover:text-blue-200 transition duration-300">
              Sponsors
            </Link>
            
            {/* Authentication Status - Desktop */}
            <div className="ml-4">
              <AuthStatus />
            </div>
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
            {/* Membership Section - Mobile */}
            <div className="px-3 py-2">
              <div className="text-base font-medium text-white mb-2">Membership</div>
              <div className="ml-4 space-y-1">
                <Link 
                  href="/membership" 
                  className="block px-3 py-2 rounded-md text-sm text-blue-200 hover:bg-[#234b64] hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Journey
                </Link>
                <Link
                  href="/pricing"
                  className="block px-3 py-2 rounded-md text-sm text-blue-200 hover:bg-[#234b64] hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
              </div>
            </div>
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
              Forum
            </Link>
            <Link 
              href="/sponsors" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sponsors
            </Link>
            
            {/* Authentication Status - Mobile */}
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="px-3 py-2">
                <AuthStatus />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 