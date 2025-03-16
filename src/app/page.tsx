import Link from "next/link";
import Image from "next/image";

/**
 * Landing page component
 * A modern, visually appealing landing page that introduces the Cursor website building guide
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Cursor Logo" width={32} height={32} className="w-8 h-8" />
          <span className="font-bold text-xl">Mikhail's Cursor Guide</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/getting-started" 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <div className="container mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center relative z-10">
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl"></div>
        
        <div className="inline-block mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full px-4 py-1 text-sm font-medium">
          Build websites with AI
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
          Build Websites Faster with <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Cursor</span>
        </h1>
        
        <p className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl">
          A comprehensive guide to creating modern, responsive websites using Cursor&apos;s AI-powered features
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 mt-8">
          <Link 
            href="/getting-started" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl px-8 py-4 transition-all shadow-lg hover:shadow-blue-500/25"
          >
            Start the Guide
          </Link>
          <a 
            href="https://cursor.sh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 font-medium rounded-xl px-8 py-4 transition-all"
          >
            Download Cursor
          </a>
        </div>
        
        {/* Code preview */}
        <div className="mt-20 max-w-3xl w-full bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-2 text-sm text-slate-400">cursor-website.tsx</div>
          </div>
          <div className="p-6 text-left font-mono text-sm text-blue-100 overflow-x-auto">
            <div><span className="text-pink-400">import</span> <span className="text-blue-300">{"{"} AI {"}"}</span> <span className="text-pink-400">from</span> <span className="text-green-400">&apos;@cursor/ai&apos;</span>;</div>
            <div className="mt-2"><span className="text-pink-400">const</span> <span className="text-yellow-300">buildWebsite</span> = <span className="text-blue-300">async</span>() <span className="text-yellow-300">=&gt;</span> <span className="text-blue-300">{"{"}</span></div>
            <div className="ml-4"><span className="text-pink-400">const</span> <span className="text-blue-300">result</span> = <span className="text-pink-400">await</span> <span className="text-yellow-300">AI.generate</span>(<span className="text-green-400">&apos;Create a modern landing page&apos;</span>);</div>
            <div className="ml-4"><span className="text-pink-400">return</span> <span className="text-blue-300">result</span>.<span className="text-yellow-300">code</span>;</div>
            <div><span className="text-blue-300">{"}"}</span>;</div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <section id="features" className="py-20 bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Build Modern Websites</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Our comprehensive guide covers all aspects of website development with Cursor</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 mb-6 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Image src="/file.svg" alt="Tutorials icon" width={24} height={24} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Step-by-Step Tutorials</h3>
              <p className="text-slate-300">Follow our detailed guides to build your website from scratch with clear instructions and examples</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 mb-6 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <Image src="/globe.svg" alt="Integration icon" width={24} height={24} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integration Guides</h3>
              <p className="text-slate-300">Learn how to seamlessly connect your site with Firebase, Vercel, and other popular services</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 mb-6 bg-pink-600/20 rounded-xl flex items-center justify-center">
                <Image src="/window.svg" alt="Troubleshooting icon" width={24} height={24} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Troubleshooting</h3>
              <p className="text-slate-300">Solutions to common issues and expert tips to help you overcome development challenges</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md p-12 rounded-3xl border border-blue-700/30 shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Ready to start building?</h2>
            <p className="text-xl text-blue-100 mb-8">Begin your journey to creating amazing websites with Cursor today</p>
            <Link 
              href="/getting-started" 
              className="inline-block bg-white text-indigo-900 hover:bg-blue-50 font-medium rounded-xl px-8 py-4 transition-colors shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-slate-950/50 backdrop-blur-md border-t border-slate-800/50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/logo.svg" alt="Cursor Logo" width={24} height={24} className="w-6 h-6" />
              <span className="font-medium">Mikhail's Cursor Website Guide</span>
            </div>
            <div className="text-sm text-slate-400">
              Built with Cursor AI • © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
