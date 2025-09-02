import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">THE ISLAMIC CIRCLE</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Your university experience doesn&apos;t have to mean compromising your faith
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">WELCOME TO YOUR NEW FAMILY</h2>
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image - smaller on mobile */}
            <div className="relative aspect-[4/3] md:aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md max-w-md mx-auto md:max-w-none w-full">
              <Image
                src="/images/WEB/brothers/IMG_0006.JPG"
                alt="USIC Community"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                style={{
                  objectPosition: '60% 40%'
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Content */}
            <div>
              {/* Subtitle */}
              <h3 className="font-heading text-2xl md:text-3xl md:text-4xl font-bold mb-6 text-white">
                Worried university life means no fun because everything is haram?
              </h3>
              
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                We get it. You&apos;ve heard the horror stories about university life. But here&apos;s the truth: <span className="text-white font-semibold">you can have an amazing university experience while staying true to your faith.</span>
              </p>
              
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                Founded in 1964, USIC is your <span className="text-white font-semibold">sanctuary from the trials of university life</span>. We&apos;re your halal social hub - where you can make friends, have fun, grow spiritually, and never feel like you&apos;re missing out.
              </p>
              
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                Whatever your background, faith level, or current beliefs - <span className="text-white font-semibold">everyone is welcome here.</span>
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">WHY WE&apos;RE DIFFERENT</h2>
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image - smaller on mobile */}
            <div className="relative aspect-[4/3] md:aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md max-w-md mx-auto md:max-w-none w-full">
              <Image
                src="/images/WEB/brothers/annualretreat.jpeg"
                alt="USIC Values"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Content */}
            <div>
              {/* Subtitle */}
              <h3 className="font-heading text-2xl md:text-3xl md:text-4xl font-bold mb-6 text-white">
                We don&apos;t just talk about Islamic values - we live them through fun, engaging activities.
              </h3>
              
              <div className="space-y-4 mb-8">
                <p className="text-lg md:text-xl text-blue-100">
                  <span className="text-white font-semibold">Faith with Fun</span> - Deep spiritual connections through exciting activities
                </p>
                
                <p className="text-lg md:text-xl text-blue-100">
                  <span className="text-white font-semibold">Brotherhood & Sisterhood</span> - We&apos;re not just a society, we&apos;re a family
                </p>
                
                <p className="text-lg md:text-xl text-blue-100">
                  <span className="text-white font-semibold">Knowledge Through Experience</span> - Learn about Islam through interactive sessions
                </p>
                
                <p className="text-lg md:text-xl text-blue-100">
                  <span className="text-white font-semibold">Community Service</span> - Make a real difference while having fun
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Events Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">FUN ACTIVITIES (YES, REALLY!)</h2>
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image - smaller on mobile */}
            <div className="relative aspect-[4/3] md:aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md max-w-md mx-auto md:max-w-none w-full">
              <Image
                src="/images/WEB/brothers/USIC Annual Dinner 2025-81.jpg"
                alt="USIC Events"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Content */}
            <div>
              {/* Subtitle */}
              <h3 className="font-heading text-2xl md:text-3xl md:text-4xl font-bold mb-6 text-white">
                From football to food socials - we&apos;ve got something for everyone.
              </h3>
              
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                Forget the stereotype that Islamic societies are boring. We&apos;re here to prove that halal fun is the best kind of fun!
              </p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 text-white">Annual Events</h4>
                  <p className="text-blue-100">Charity Hike, Annual Retreat, Annual Dinner</p>
                </div>
                
                <div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 text-white">Weekly Events</h4>
                  <p className="text-blue-100">Islamic History Lessons, Qur&apos;an Circles, Football (Sisters Thursday, Brothers Friday), Welfare Wednesdays</p>
                </div>
                
                <div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 text-white">Other Fun Stuff</h4>
                  <p className="text-blue-100">Food socials, Peak District hikes, Sports socials</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Membership Section */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">JOIN THE FAMILY</h2>
          
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image - smaller on mobile */}
            <div className="relative aspect-[4/3] md:aspect-[4/5] bg-[#0F1E2C] overflow-hidden rounded-lg shadow-md max-w-md mx-auto md:max-w-none w-full">
              <Image
                src="/images/WEB/brothers/USIC Annual Dinner 2025-107.jpg"
                alt="USIC Membership"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
      </div>

            {/* Content */}
            <div>
              {/* Subtitle */}
              <h3 className="font-heading text-2xl md:text-3xl md:text-4xl font-bold mb-6 text-white">
                More than just a membership card - you get a whole new social life.
              </h3>
              
              <div className="space-y-4 mb-8">
                <p className="flex items-center text-lg md:text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  Your personal <span className="text-white font-semibold">USIC membership card</span>
                </p>
                
                <p className="flex items-center text-lg md:text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Exclusive discounts</span> for Annual Dinner and Spring Camp
                </p>
                
                <p className="flex items-center text-lg md:text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Priority access</span> to tickets for popular events
                </p>
                
                <p className="flex items-center text-lg md:text-xl text-blue-100">
                  <span className="text-blue-300 mr-3">✦</span>
                  <span className="text-white font-semibold">Member-only socials</span> and merchandise discounts
                </p>
      </div>

              <div className="mt-8">
                <a href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" target="_blank" rel="noopener noreferrer" className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 transition text-sm uppercase tracking-wider font-medium rounded">
                  Become a Member
                </a>
              </div>
            </div>
          </div>
        </section>

      {/* Call to Action */}
        <section className="mb-12 bg-[#0F1E2C] text-white p-12 rounded-lg text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">Ready to Have the Best University Experience?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Don&apos;t let fear of missing out hold you back. Join USIC and discover that the best university memories are the ones you make with people who share your values.
          </p>
          <a href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" target="_blank" rel="noopener noreferrer" className="inline-block py-3 px-8 bg-white text-[#18384D] hover:bg-blue-100 transition text-sm uppercase tracking-wider font-medium rounded">
            Become a Member
          </a>
        </section>
      </div>
    </div>
  );
} 