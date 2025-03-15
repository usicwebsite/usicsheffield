import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import Button from "@/components/Button";

/**
 * About page component
 * This page provides more information about the template
 */
export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 px-6 sm:px-10 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                About This Template
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Learn more about this Next.js template and how it can help you build better web applications.
              </p>
            </div>
          </div>
        </section>
        
        {/* About section */}
        <section className="py-16 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  What is this template?
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    This is a beginner-friendly Next.js template designed to help you get started with building modern web applications quickly and efficiently. It includes everything you need to build a production-ready website, including:
                  </p>
                  <ul>
                    <li>Next.js 14 with the App Router for improved routing and layouts</li>
                    <li>TypeScript for type safety and better developer experience</li>
                    <li>TailwindCSS for utility-first styling</li>
                    <li>Responsive design that works on all devices</li>
                    <li>SEO optimization with metadata, Open Graph, and Twitter card support</li>
                    <li>Reusable UI components for faster development</li>
                    <li>Dark mode support</li>
                  </ul>
                  <p>
                    This template is perfect for beginners who want to learn Next.js and TailwindCSS, as well as experienced developers who want to save time setting up a new project.
                  </p>
                  <h3>Why use this template?</h3>
                  <p>
                    Building a web application from scratch can be time-consuming and overwhelming, especially for beginners. This template provides a solid foundation with best practices already implemented, allowing you to focus on building your application&apos;s unique features.
                  </p>
                  <p>
                    The template is also highly customizable, so you can easily modify it to fit your specific needs. Whether you&apos;re building a personal website, a blog, or a complex web application, this template can help you get started quickly.
                  </p>
                  <h3>How to use this template</h3>
                  <p>
                    Using this template is easy. Simply clone the repository, install the dependencies, and start building your application. The template includes detailed documentation and comments to help you understand how everything works.
                  </p>
                  <p>
                    Check out the README.md file for step-by-step instructions on how to get started.
                  </p>
                </div>
              </div>
              
              <div>
                <Card className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technologies Used</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Next.js 14</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>TypeScript</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>TailwindCSS</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>ESLint</span>
                    </li>
                  </ul>
                </Card>
                
                <Card className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Resources</h3>
                  <ul className="space-y-3">
                    <li>
                      <a 
                        href="https://nextjs.org/docs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Next.js Documentation
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://tailwindcss.com/docs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        TailwindCSS Documentation
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.typescriptlang.org/docs/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        TypeScript Documentation
                      </a>
                    </li>
                  </ul>
                </Card>
                
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    href="/"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 