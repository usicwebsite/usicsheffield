import Link from 'next/link';

/**
 * Footer component with links and copyright information
 * This component appears at the bottom of every page
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 px-6 sm:px-10 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About This Template</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              A beginner-friendly Next.js template with TailwindCSS and TypeScript.
              Perfect for starting your next web project.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://nextjs.org/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
                >
                  Next.js Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://tailwindcss.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
                >
                  Tailwind CSS Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://www.typescriptlang.org/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
                >
                  TypeScript Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {currentYear} Next.js Template. All rights reserved.</p>
          <p className="mt-2">
            Created with{' '}
            <a 
              href="https://cursor.sh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Cursor Agent
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
} 