import Link from 'next/link';

export default function MembershipPage() {
  const benefits = [
    {
      id: 1,
      title: "Your Personal USIC Membership Card",
      description: "Receive a personalized membership card that identifies you as part of the USIC community.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586L6.293 3.707A1 1 0 015.586 4H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: "Exclusive Discounts for Annual Events",
      description: "Enjoy special member-only pricing for our Annual Dinner, Spring Camp, and other major events.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "Discounted Socials and Merchandise",
      description: "Get special rates on all our social events and USIC-branded merchandise.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: "Priority Access to Popular Events",
      description: "Be the first to know about and secure tickets for our most popular events before they sell out.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: 5,
      title: "Community Support and Network",
      description: "Be part of a supportive community of fellow Muslims and allies at the University of Sheffield.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      )
    },
    {
      id: 6,
      title: "Represent USIC",
      description: "Become an official representative of USIC with the ability to participate in inter-university Islamic events.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </svg>
      )
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Visit the University Website",
      description: "Go to the official University of Sheffield Students' Union website to purchase your USIC membership."
    },
    {
      number: 2,
      title: "Find USIC",
      description: "Navigate to the Societies section and search for 'Islamic Circle' or 'USIC'."
    },
    {
      number: 3,
      title: "Purchase Membership",
      description: "Follow the instructions to complete your membership purchase using a credit/debit card or PayPal."
    },
    {
      number: 4,
      title: "Collect Your Card",
      description: "Once your purchase is confirmed, you can collect your USIC membership card at our next event or from the Islamic Society room."
    }
  ];

  return (
    <div className="pt-8">
      {/* Hero section */}
      <div className="bg-[#18384D] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">USIC Membership</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Join our community and enjoy exclusive benefits throughout the academic year
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#18384D] mb-6">Why Become a Member?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Becoming a member of USIC connects you with a vibrant community of Muslim students 
              and provides access to exclusive benefits and opportunities. Your membership fee 
              helps us continue to organize high-quality events and provide support for Muslim 
              students at the University of Sheffield.
            </p>
          </div>
        </section>

        {/* Benefits section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#18384D] mb-8 text-center">Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-[#18384D] mb-3">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to join section */}
        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-[#18384D] mb-8 text-center">How to Join</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="bg-[#18384D] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-[#18384D] mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a 
              href="https://www.sheffield.ac.uk/students-union/join-activity/islamic-circle" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-[#18384D] hover:bg-blue-800 text-white px-8 py-4 rounded-md font-medium transition duration-300 text-lg"
            >
              Join USIC Now
            </a>
          </div>
        </section>

        {/* Membership FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-[#18384D] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#18384D] mb-3">How much does membership cost?</h3>
              <p className="text-gray-700">
                USIC membership costs £5 for the entire academic year. This one-time fee gives you 
                access to all member benefits from the moment you join until the end of the academic year.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#18384D] mb-3">Can I join at any time during the year?</h3>
              <p className="text-gray-700">
                Yes! You can join USIC at any point during the academic year. The membership fee 
                remains the same, and your membership will be valid until the end of the academic year.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#18384D] mb-3">Do I need to be a Muslim to join?</h3>
              <p className="text-gray-700">
                No, USIC welcomes members of all faiths and backgrounds. While our events and activities 
                are centered around Islamic principles and values, we encourage anyone interested in 
                learning more about Islam or participating in our community to join.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#18384D] mb-3">What if I lose my membership card?</h3>
              <p className="text-gray-700">
                If you lose your membership card, please contact us at usic@sheffield.ac.uk, and we will 
                arrange for a replacement. A small fee may apply for replacement cards.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CTA section */}
      <div className="bg-[#18384D] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 mb-8">
            Become a member today and be part of a vibrant community of Muslim students at the University of Sheffield.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://www.sheffield.ac.uk/students-union/join-activity/islamic-circle" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium transition duration-300 text-lg"
            >
              Join USIC Now
            </a>
            <Link 
              href="/events" 
              className="bg-transparent border-2 border-blue-300 hover:bg-blue-900/20 text-white px-8 py-4 rounded-md font-medium transition duration-300 text-lg"
            >
              Explore Our Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 