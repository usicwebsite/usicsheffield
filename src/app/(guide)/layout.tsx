"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Navigation items for the sidebar
const navigationItems = [
  {
    title: "Getting Started",
    href: "/getting-started",
    subitems: [
      { title: "Installing Cursor", href: "/getting-started/installation" },
      { title: "Setting Up Your Environment", href: "/getting-started/environment" },
      { title: "Cursor Interface Overview", href: "/getting-started/interface" },
    ],
  },
  {
    title: "Building Your Website",
    href: "/building-website",
    subitems: [
      { title: "Creating a New Project", href: "/building-website/new-project" },
      { title: "HTML & CSS Basics", href: "/building-website/html-css" },
      { title: "Adding JavaScript", href: "/building-website/javascript" },
      { title: "Responsive Design", href: "/building-website/responsive" },
    ],
  },
  {
    title: "Integrations",
    href: "/integrations",
    subitems: [
      { title: "Firebase Setup", href: "/integrations/firebase" },
      { title: "Vercel Deployment", href: "/integrations/vercel" },
      { title: "Authentication", href: "/integrations/authentication" },
      { title: "Databases", href: "/integrations/databases" },
    ],
  },
  {
    title: "Advanced Features",
    href: "/advanced-features",
    subitems: [
      { title: "AI Code Completion", href: "/advanced-features/ai-completion" },
      { title: "Debugging Tools", href: "/advanced-features/debugging" },
      { title: "Version Control", href: "/advanced-features/version-control" },
      { title: "Extensions", href: "/advanced-features/extensions" },
    ],
  },
  {
    title: "Troubleshooting",
    href: "/troubleshooting",
    subitems: [
      { title: "Common Errors", href: "/troubleshooting/common-errors" },
      { title: "Performance Issues", href: "/troubleshooting/performance" },
      { title: "Installation Problems", href: "/troubleshooting/installation" },
    ],
  },
  {
    title: "Feedback & Q&A",
    href: "/feedback",
    subitems: [],
  },
];

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // Initialize expanded sections based on current path
  useEffect(() => {
    const currentSection = navigationItems.find(item => 
      pathname.startsWith(item.href)
    );
    
    if (currentSection) {
      setExpandedSections(prev => 
        prev.includes(currentSection.href) ? prev : [...prev, currentSection.href]
      );
    }
  }, [pathname]);
  
  // Toggle section expansion
  const toggleSection = (href: string) => {
    setExpandedSections(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href) 
        : [...prev, href]
    );
  };
  
  // Check if a nav item is active
  const isActive = (href: string) => pathname === href;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 bottom-4 right-4 md:hidden bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">Cursor Guide</span>
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href} className="mb-2">
                <div className="flex flex-col">
                  <div 
                    className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer ${
                      isActive(item.href) ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      if (item.subitems.length > 0) {
                        toggleSection(item.href);
                      }
                    }}
                  >
                    <Link 
                      href={item.href}
                      className="flex-grow font-medium"
                      onClick={(e) => {
                        if (item.subitems.length > 0) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {item.title}
                    </Link>
                    
                    {item.subitems.length > 0 && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`transform transition-transform ${
                          expandedSections.includes(item.href) ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </div>
                  
                  {/* Subitems */}
                  {item.subitems.length > 0 && expandedSections.includes(item.href) && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-gray-200 pl-2">
                      {item.subitems.map((subitem) => (
                        <li key={subitem.href}>
                          <Link
                            href={subitem.href}
                            className={`block px-3 py-2 rounded-md text-sm ${
                              isActive(subitem.href)
                                ? "bg-indigo-50 text-indigo-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {subitem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 