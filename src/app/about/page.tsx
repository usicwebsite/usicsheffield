import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">THE ISLAMIC CIRCLE</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            The University of Sheffield&apos;s premier Islamic society since 1964
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* What is USIC Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">WHAT IS THE ISLAMIC CIRCLE?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left column - Image */}
            <div className="relative aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md">
              <Image
                src="/images/6.png"
                alt="USIC Community"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Right column - Text */}
            <div>
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                99.9% of students will never experience the power of Islamic Brotherhood and Sisterhood.
              </h3>
              
              <p className="text-xl mb-10 text-blue-100">
                They will never experience what it&apos;s like to have other ambitious, faithful, diligent, and dutiful Muslims at their side.
              </p>
              
              <p className="text-xl mb-6 text-blue-100">
                To experience being surrounded by <span className="text-white font-semibold">success stories</span>,
              </p>
              
              <p className="text-xl mb-10 text-blue-100">
                To be among the <span className="text-white font-semibold">most energetic</span> and <span className="text-white font-semibold">lucky students</span> in the university.
              </p>
              
              <p className="text-xl mb-10 text-blue-100">
                Inside <span className="text-white font-semibold">The Islamic Circle</span> you will access <span className="text-white font-semibold">knowledge</span> that will spark your spiritual growth and compel you to <span className="text-white font-semibold">work your hardest</span> to keep up.
              </p>
              
              <p className="text-xl mb-10 text-blue-100">
                There is no other place on campus with Muslims of this caliber.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">OUR VALUES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left column - Text (Reverse order) */}
            <div>
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                Values that define our identity and guide our actions.
              </h3>
              
              <p className="text-xl mb-10 text-blue-100">
                At the heart of USIC, we uphold principles that shape our community and direct our journey.
              </p>
              
              <div className="space-y-6 mb-8">
                <p className="text-xl text-blue-100">
                  <span className="text-white font-semibold">Faith</span> - We stand united in unwavering faith, cultivating a deep connection with our Creator.
                </p>
                
                <p className="text-xl text-blue-100">
                  <span className="text-white font-semibold">Brotherhood & Sisterhood</span> - We foster familial bonds, finding strength in our diverse community.
                </p>
                
                <p className="text-xl text-blue-100">
                  <span className="text-white font-semibold">Knowledge</span> - We commit to intellectual growth and understanding of Islam.
                </p>
              </div>
            </div>
            
            {/* Right column - Image */}
            <div className="relative aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md">
              <Image
                src="/images/5.png"
                alt="USIC Values"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>
        </section>
        
        {/* Our Vision Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">OUR VISION</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left column - Image */}
            <div className="relative aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md">
              <Image
                src="/images/7.png"
                alt="USIC Vision"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Right column - Text */}
            <div>
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                To foster an Islamic environment that promotes growth.
              </h3>
              
              <p className="text-xl mb-10 text-blue-100">
                We aim to create a space where Muslims can thrive spiritually, academically, and socially.
              </p>
              
              <div className="space-y-4 mb-8">
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Personal Development</span>
                </p>
                
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Brotherhood and Sisterhood</span>
                </p>
                
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Unity</span>
                </p>
              </div>
              
              <p className="text-xl mb-6 text-white">
                We encourage individuals to strive for the sake of Allah سبحانه و تعالى and become Muslims who are:
              </p>
              
              <div className="space-y-3">
                <p className="text-xl text-blue-100">
                  <span className="text-white font-semibold">Practicing</span> - fulfilling the rights of Allah
                </p>
                <p className="text-xl text-blue-100">
                  <span className="text-white font-semibold">Practical</span> - applying Islamic principles in daily life
                </p>
                <p className="text-xl text-blue-100">
                  <span className="text-white font-semibold">Proactive</span> - actively making positive changes
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Membership Benefits Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">MEMBERSHIP BENEFITS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left column - Text (Reverse order) */}
            <div>
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                Join the 0.1% who experience true community.
              </h3>
              
              <p className="text-xl mb-10 text-blue-100">
                Becoming a member of USIC opens doors to exclusive benefits and opportunities.
              </p>
              
              <div className="space-y-6 mb-8">
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  Your personal <span className="text-white font-semibold">USIC membership card</span>
                </p>
                
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Exclusive discounts</span> for the Annual Dinner and Spring Camp
                </p>
                
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  Discounts for our <span className="text-white font-semibold">socials and merchandise</span>
                </p>
                
                <p className="flex items-center text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">First access</span> to tickets for our most popular events
                </p>
              </div>
              
              <div className="mt-8">
                <Link href="/membership" className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 transition text-sm uppercase tracking-wider font-medium rounded">
                  Become a Member
                </Link>
              </div>
            </div>
            
            {/* Right column - Image */}
            <div className="relative aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md">
              <Image
                src="/images/8.png"
                alt="USIC Membership"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>
        </section>
        
        {/* Events We Hold Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">EVENTS WE HOLD</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left column - Image */}
            <div className="relative aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md">
              <Image
                src="/images/9.png"
                alt="USIC Events"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Right column - Text */}
            <div>
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                Activities that enrich your university experience.
              </h3>
              
              <p className="text-xl mb-10 text-blue-100">
                From weekly circles to annual retreats, we offer a variety of events to nourish your mind, body, and soul.
              </p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Annual Events</h4>
                  <p className="text-blue-100">
                    Charity Hike, Annual Retreat (Spring semester), Annual Dinner (March/April)
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Weekly Events</h4>
                  <p className="text-blue-100">
                    Islamic History Lessons, Qur&apos;an Circles, Roots Academy classes, Welfare Wednesdays, 
                    Sisters&apos; Football (Thursday), Brothers&apos; Football (Friday)
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Other Events</h4>
                  <p className="text-blue-100">
                    Food socials at our sponsors, Peak District hikes, Sports socials (Rounders, Badminton, Basketball)
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/events" className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 transition text-sm uppercase tracking-wider font-medium rounded">
                  Explore Our Events
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="mb-12 bg-[#0F1E2C] text-white p-12 rounded-lg text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">Join Our Community Today</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of USIC and join us in our mission to create a supportive environment for Muslim students at the University of Sheffield.
          </p>
          <Link href="/membership" className="inline-block py-3 px-8 bg-white text-[#18384D] hover:bg-blue-100 transition text-sm uppercase tracking-wider font-medium rounded">
            Become a Member
          </Link>
        </section>
      </div>
    </div>
  );
} 