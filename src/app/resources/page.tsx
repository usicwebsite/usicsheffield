import Image from 'next/image';
import Link from 'next/link';

export default function ResourcesPage() {
  // Resource cards data
  const resourceCards = [
    {
      id: 1,
      title: "USIC Map",
      description: "Interactive map showing key locations for USIC members including prayer rooms, halal food spots, and important campus buildings.",
      imagePath: "/images/WEB/1.png",
      category: "NAVIGATION",
      link: "https://www.google.com/maps/d/u/0/viewer?mid=1sf6ignGjx9yqlVM-XgAoRiVtWUjk2KE&hl=en&ll=53.381545854028566%2C-1.4872821811864867&z=16",
      isExternal: true
    },
    {
      id: 2,
      title: "Accommodation",
      description: "Guide to finding suitable accommodation near campus, including Muslim-friendly housing options and tips for new students.",
      imagePath: "/images/WEB/2.png",
      category: "HOUSING",
      link: "/accommodation",
      isExternal: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">RESOURCES</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Materials to aid your spiritual and academic journey
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="pt-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">AVAILABLE MATERIALS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {resourceCards.map((resource) => (
            <div key={resource.id} className="relative group overflow-hidden rounded-lg shadow-lg bg-[#0F1E2C] transition-all duration-300 hover:shadow-xl">
              {/* Resource image */}
              <div className="relative h-[300px] overflow-hidden">
                <Image 
                  src={resource.imagePath} 
                  alt={resource.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Category tag */}
                <div className="absolute top-4 left-4 bg-white text-[#18384D] px-3 py-1 text-sm font-bold rounded">
                  {resource.category}
                </div>
              </div>
              
              {/* Resource content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">{resource.title}</h2>
                <p className="text-blue-100 mb-4">{resource.description}</p>
                {resource.isExternal ? (
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-white border-b-2 border-white pb-1 transition-all duration-300 hover:text-blue-200 hover:border-blue-200"
                  >
                    OPEN MAP
                  </a>
                ) : (
                  <Link 
                    href={resource.link} 
                    className="inline-block text-white border-b-2 border-white pb-1 transition-all duration-300 hover:text-blue-200 hover:border-blue-200"
                  >
                    VIEW GUIDE
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 