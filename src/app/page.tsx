import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Card from "@/components/Card";
import Button from "@/components/Button";

/**
 * Home page component
 * This is the main landing page of the application
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero section */}
      <Hero />
      
      {/* Main content */}
      <main className="flex-grow">
        {/* Features section */}
        <section className="py-16 px-6 sm:px-10 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Template Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                This template includes everything you need to build modern, responsive web applications with Next.js.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                }
                title="Next.js 14"
                description="Built with the latest version of Next.js, featuring the App Router for improved routing and layouts."
              />
              
              {/* Feature 2 */}
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                }
                title="TailwindCSS"
                description="Utility-first CSS framework for rapidly building custom designs without leaving your HTML."
              />
              
              {/* Feature 3 */}
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                }
                title="TypeScript"
                description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale."
              />
              
              {/* Feature 4 */}
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                }
                title="Component Library"
                description="Reusable UI components like buttons, cards, and more to help you build your application faster."
              />
              
              {/* Feature 5 */}
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                  </svg>
                }
                title="Responsive Design"
                description="Mobile-first approach ensures your application looks great on all devices, from phones to desktops."
              />
              
              {/* Feature 6 */}
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                }
                title="SEO Optimized"
                description="Built-in SEO best practices with metadata, Open Graph, and Twitter card support for better visibility."
              />
            </div>
          </div>
        </section>
        
        {/* How to use section */}
        <section className="py-16 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                How to Use This Template
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Follow these simple steps to get started with your Next.js project.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Card className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">1. Clone the Repository</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                    <code>git clone https://github.com/your-username/nextjs-template.git my-project</code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start by cloning this template repository to your local machine.
                  </p>
                </Card>
                
                <Card className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">2. Install Dependencies</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                    <code>cd my-project<br />npm install</code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Navigate to your project directory and install the required dependencies.
                  </p>
                </Card>
                
                <Card>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">3. Start Development Server</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                    <code>npm run dev</code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Run the development server and open <span className="font-mono">http://localhost:3000</span> in your browser.
                  </p>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">4. Start Building</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Modify the components and pages to build your application. The template includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                    <li>Reusable UI components</li>
                    <li>Responsive layouts</li>
                    <li>SEO optimization</li>
                    <li>TypeScript support</li>
                    <li>TailwindCSS styling</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check the README.md file for more detailed instructions.
                  </p>
                </Card>
                
                <Card>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">5. Deploy Your Application</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    When you&apos;re ready to deploy, build your application and deploy it to your favorite hosting platform.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                    <code>npm run build<br />npm run start</code>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="primary" 
                      href="https://vercel.com/new" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Deploy to Vercel
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 px-6 sm:px-10 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Start Building?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get started with this template today and build your next great web application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="white" 
                size="lg"
                href="https://github.com/your-username/nextjs-template"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-blue-700"
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
