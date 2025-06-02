export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">RESOURCES</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 mb-8">
            Materials to aid your spiritual and academic journey
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">AVAILABLE MATERIALS</h2>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-blue-100 mb-8">
            We&apos;re currently working on a collection of resources for our community.
            Please check back soon for updates.
          </p>
        </div>
      </div>
    </div>
  );
} 