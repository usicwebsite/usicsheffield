export default function FundraisingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">
            USIC FUNDRAISER
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Support the Islamic Circle at the University of Sheffield and help empower Muslim students across campus
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-12">
        {/* Empowering Students Section */}
        <section className="bg-[#0F1E2C] p-8 rounded-lg">
          <h2 className="font-heading text-3xl font-bold mb-6 text-center">Empowering Students</h2>
          <p className="text-blue-100 text-lg leading-relaxed text-center max-w-4xl mx-auto">
            USIC empowers students through skill-building, leadership development, and comprehensive support
            academically, spiritually, and personally throughout their university journey.
          </p>
        </section>

        {/* Building Community Section */}
        <section className="bg-[#0F1E2C] p-8 rounded-lg">
          <h2 className="font-heading text-3xl font-bold mb-6 text-center">Building Our Community</h2>
          <p className="text-blue-100 text-lg leading-relaxed text-center max-w-4xl mx-auto">
            USIC brings people together, fostering a strong sense of brotherhood and sisterhood among students.
            Our work extends beyond campus to make a positive difference in the wider community.
          </p>
        </section>

        {/* Your Donation's Impact Section */}
        <section className="bg-[#0F1E2C] p-8 rounded-lg">
          <h2 className="font-heading text-3xl font-bold mb-6 text-center">Your Donation Makes a Real Difference</h2>
          <p className="text-blue-100 text-lg leading-relaxed text-center max-w-4xl mx-auto mb-6">
            Every donation directly supports USIC&apos;s vital programs and initiatives that empower Muslim students.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1A2A3A] p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Educational Events & Workshops</h3>
              <p className="text-blue-100">
                Funds help organize talks from respected scholars, weekly classes, and conferences throughout the year.
              </p>
            </div>
            <div className="bg-[#1A2A3A] p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Skill Development Programs</h3>
              <p className="text-blue-100">
                Support hands-on workshops for CV writing, public speaking, leadership training, and career development.
              </p>
            </div>
            <div className="bg-[#1A2A3A] p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Student Welfare Support</h3>
              <p className="text-blue-100">
                Help fund initiatives that ensure fair treatment and inclusion for Muslim students on campus.
              </p>
            </div>
            <div className="bg-[#1A2A3A] p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Community Building</h3>
              <p className="text-blue-100">
                Support social events that create strong connections and a supportive network among students.
              </p>
            </div>
          </div>
        </section>

        {/* Program Highlights Section */}
        <section className="bg-[#0F1E2C] p-8 rounded-lg">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">USIC Program Highlights</h2>
          <div className="space-y-8">
            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="font-semibold text-xl text-white mb-3">Development Workshops</h3>
              <p className="text-blue-100">
                Hands-on sessions providing practical, useful skills for career and life. Including CV help,
                public speaking tips, and leadership training.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="font-semibold text-xl text-white mb-3">Educational Events</h3>
              <p className="text-blue-100">
                Regular talks from respected scholars on important topics, weekly classes, and conferences throughout the year.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="font-semibold text-xl text-white mb-3">Student Affairs</h3>
              <p className="text-blue-100">
                Advocating for Muslim students to ensure fair, inclusive, and welcoming university environments.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="font-semibold text-xl text-white mb-3">Community Building Socials</h3>
              <p className="text-blue-100">
                Events designed to build strong connections, create brotherhood and sisterhood, and ensure everyone
                feels part of a supportive network.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="font-semibold text-xl text-white mb-3">Volunteering Opportunities</h3>
              <p className="text-blue-100">
                Getting students involved in meaningful volunteer work, teaming up with local mosques and community groups.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12 bg-[#0F1E2C] text-white p-12 rounded-lg text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">Join Us in Making a Difference</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Your support helps USIC continue empowering Muslim students and building a stronger community.
            Every contribution, no matter the size, makes a real impact.
          </p>
          <div className="flex justify-center">
            <a
              href="https://gofundme.com/placeholder-usic-fundraiser"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-4 px-12 bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 transition-all duration-300 text-lg uppercase tracking-wider font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Donate Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
