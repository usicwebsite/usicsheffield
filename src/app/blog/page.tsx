import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  // Sample blog post data
  const blogPosts = [
    {
      id: 1,
      title: "Brotherhood Stories",
      description: "Real stories from USIC members about finding community and faith during university life.",
      imagePath: "/images/3.png",
      category: "COMMUNITY"
    },
    {
      id: 2,
      title: "Faith & Studies",
      description: "How USIC members balance their Islamic values with academic excellence at Sheffield.",
      imagePath: "/images/8.png",
      category: "FAITH"
    },
    {
      id: 3,
      title: "Campus Reflections",
      description: "Personal reflections on overcoming challenges in university life and finding inner strength through Islam.",
      imagePath: "/images/5.png",
      category: "PERSONAL GROWTH"
    }
  ];

  return (
    <div className="bg-[#18384D] text-white min-h-screen">
      {/* Hero section */}
      <div className="bg-[#18384D] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">USIC STORIES</h1>
          <div className="heading-underline"></div>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 mb-8">
            Stories and reflections from our community members sharing their journey of faith and growth.
          </p>
        </div>
      </div>

      {/* Featured posts grid */}
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {blogPosts.map((post) => (
            <div key={post.id} className="relative group overflow-hidden rounded-lg shadow-lg bg-[#122a3a] transition-all duration-300 hover:shadow-xl">
              {/* Post image */}
              <div className="relative h-[300px] overflow-hidden">
                <Image 
                  src={post.imagePath} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Category tag */}
                <div className="absolute top-4 left-4 bg-white text-[#18384D] px-3 py-1 text-sm font-bold rounded">
                  {post.category}
                </div>
              </div>
              
              {/* Post content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">{post.title}</h2>
                <p className="text-blue-100 mb-4">{post.description}</p>
                <Link href={`/blog/${post.id}`} className="inline-block text-white border-b-2 border-white pb-1 transition-all duration-300 hover:text-blue-200 hover:border-blue-200">
                  READ NOW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 