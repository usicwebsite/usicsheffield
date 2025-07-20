"use client";

export default function AboutSection() {
  // Card content data
  const cards = [
    {
      id: 0,
      title: "Our Aspirations",
      icon: (
        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
        </svg>
      ),
      content: (
        <ul className="space-y-3 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span>Provide a forum for Muslim students to meet and form bonds of brotherhood & sisterhood</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span>Organize events for both Muslims and non-Muslims to gain deeper knowledge of Islam</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span>Look out for the welfare of Muslim students on campus</span>
          </li>
        </ul>
      )
    },
    {
      id: 1,
      title: "Our Values",
      icon: (
        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      ),
      content: (
        <ul className="space-y-3 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Faith:</strong> Unwavering connection with our Creator</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Brotherhood & Sisterhood:</strong> Fostering familial bonds</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Knowledge:</strong> Commitment to intellectual growth</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Service:</strong> Uplifting the broader community</span>
          </li>
        </ul>
      )
    },
    {
      id: 2,
      title: "Our Vision",
      icon: (
        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-700 mb-4 font-body">
            To foster an Islamic environment that promotes:
          </p>
          <ul className="space-y-3 text-gray-700 font-body">
            <li className="flex items-start">
              <span className="text-[#18384D] mr-2 text-xl">•</span>
              <span>Personal Development</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#18384D] mr-2 text-xl">•</span>
              <span>Brotherhood and Sisterhood</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#18384D] mr-2 text-xl">•</span>
              <span>Unity</span>
            </li>
          </ul>
        </>
      )
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          {/* Background outline text */}
          <div className="absolute w-full text-center opacity-10 pointer-events-none">
            <h2 className="font-bold text-[7rem] md:text-[10rem] tracking-tight uppercase">WHO WE ARE</h2>
          </div>
          
          {/* Foreground text */}
          <h2 className="section-title text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-2 text-4xl md:text-6xl font-black uppercase tracking-tight relative z-10">
            WHO WE ARE
          </h2>
          
          <p className="section-description text-blue-100 max-w-3xl mx-auto mt-8 text-xl md:text-2xl font-light">
            Founded in 1964, USIC represents Muslim students on campus and beyond by providing social and welfare support.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {cards.map((card) => (
            <div key={card.id} className="relative rounded-xl p-0 overflow-hidden bg-white shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
              {/* Card top gradient bar */}
              <div className="h-2 w-full bg-white"></div>
              
              {/* Card content */}
              <div className="bg-white p-8">
                {/* Icon with gradient background */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[#18384D] text-white transform transition-all duration-500">
                  {card.icon}
                </div>
                
                {/* Title with underline accent */}
                <div className="mb-6">
                  <h3 className="font-subheading text-2xl font-bold mb-2 transition-all duration-500 text-[#18384D]">
                    {card.title}
                  </h3>
                  <div className="h-1 w-16 bg-[#18384D] rounded-full transition-all duration-500"></div>
                </div>
                
                {/* Content */}
                <div className="transition-all duration-500">
                  {card.content}
                </div>
              </div>
              
              {/* Card bottom decoration */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#18384D]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 