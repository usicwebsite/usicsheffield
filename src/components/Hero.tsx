import Button from './Button';

/**
 * Hero component for the homepage
 * This component displays a prominent section at the top of the homepage
 */
export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 sm:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'white\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
        <div className="max-w-3xl">
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Next.js Beginner Template
          </h1>
          
          {/* Subheading */}
          <p className="text-xl sm:text-2xl mb-8 text-blue-100">
            A clean, modern starter template for your Next.js projects with TailwindCSS and TypeScript.
          </p>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="white" 
              size="lg"
              href="/about"
            >
              Learn More
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-blue-700"
              href="https://github.com/your-username/nextjs-template"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 