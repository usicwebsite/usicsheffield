import Image from 'next/image';

// Function to get random images from the available pool
function getRandomImages() {
  const brothersImages = [
    'annualretreat.jpeg', 'brother1.jpeg', 'brother2.jpeg', 'brother3.jpeg',
    'brother4.jpeg', 'brother5.jpeg', 'fridayfootball.jpeg', 'IMG_0006.JPG',
    'IMG_0028.JPG', 'IMG_9262.JPG', 'IMG_9980.JPG', 'roots.png', 'sports.jpeg',
    'USIC Annual Dinner 2025-107.jpg', 'USIC Annual Dinner 2025-16.jpg',
    'USIC Annual Dinner 2025-2.jpg', 'USIC Annual Dinner 2025-21.jpg',
    'USIC Annual Dinner 2025-25.jpg', 'USIC Annual Dinner 2025-45.jpg',
    'USIC Annual Dinner 2025-55.jpg', 'USIC Annual Dinner 2025-6.jpg',
    'USIC Annual Dinner 2025-81.jpg'
  ];

  const sistersImages = [
    'sister10.jpeg', 'sister11.jpeg', 'sister24.jpeg', 'sister25.jpeg', 
    'sister26.jpeg', 'sister27.jpeg', 'sister3.jpeg', 'sister6.jpeg', 
    'sister7.jpeg', 'sister8.jpeg', 'sister9.jpeg'
  ];

  // Combine all images
  const allImages = [
    ...brothersImages.map(img => `/images/WEB/brothers/${img}`),
    ...sistersImages.map(img => `/images/WEB/sisters/${img}`)
  ];

  // Shuffle array and return 4 unique images
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

export default function AboutPage() {
  const randomImages = getRandomImages();
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
                src={randomImages[0]}
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
              Worried about being able to grow and hold on to your faith while at university?
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
                src={randomImages[1]}
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
                src={randomImages[2]}
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
                  <p className="text-blue-100">Islamic History Lessons, Qur&apos;an Circles, Football (Sisters Thursday, Brothers Friday)</p>
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
                src={randomImages[3]}
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
                Your gateway to an incredible university experience
              </h3>
              
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Join thousands of students who&apos;ve made USIC their home away from home. <span className="text-white font-semibold">More than just a membership card</span> - you&apos;re joining a family that will support you throughout your university journey.
              </p>

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