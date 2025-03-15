import Link from 'next/link';
import Image from 'next/image';

/**
 * Header component with navigation links
 * This component appears at the top of every page
 */
export default function Header() {
  return (
    <header className="w-full py-4 px-6 sm:px-10 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and site name */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="Next.js Template Logo" 
            width={32} 
            height={32}
            className="dark:invert"
          />
          <span className="font-bold text-xl">Next.js Template</span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            About
          </Link>
          <Link 
            href="https://github.com/your-username/nextjs-template" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            GitHub
          </Link>
        </nav>

        {/* Mobile menu button - in a real app, you would implement a mobile menu */}
        <button className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
} 