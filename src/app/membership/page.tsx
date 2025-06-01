export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">USIC MEMBERSHIP</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 mb-8">
            Join our community and unlock exclusive benefits
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
            Become a Member
          </button>
        </div>
      </div>

      {/* Benefits section */}
      <div className="container mx-auto px-4 pt-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What YOU get as a USIC MEMBER</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0F1E2C] rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Your personal USIC membership card</h3>
                <p className="text-lg text-blue-100 mb-2">
                  Access all member benefits with your personal membership card, the key to unlocking everything USIC has to offer.
                </p>
              </div>
            </div>
            
            <div className="bg-[#0F1E2C] rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Exclusive discounts</h3>
                <p className="text-lg text-blue-100 mb-2">
                  Enjoy special rates for the Annual Dinner and Spring Camp, making these premium events more accessible.
                </p>
              </div>
            </div>
            
            <div className="bg-[#0F1E2C] rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Discounted access</h3>
                <p className="text-lg text-blue-100 mb-2">
                  Benefit from reduced prices at our socials and on merchandise, enhancing your USIC experience.
                </p>
              </div>
            </div>
            
            <div className="bg-[#0F1E2C] rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Priority tickets</h3>
                <p className="text-lg text-blue-100 mb-2">
                  Be first to grab tickets to our most popular events, ensuring you never miss out on key experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-[#0F1E2C] p-10 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">Become a USIC Member</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of students already enjoying exclusive benefits and unforgettable experiences.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
            Sign Up Now
          </button>
        </div>
      </div>

    </div>
  );
} 