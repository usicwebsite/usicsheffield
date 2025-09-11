import AboutSection from '@/components/AboutSection';
import { getAboutSections } from '@/lib/about-data';

export default function AboutPage() {
  const aboutSections = getAboutSections();
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
        {aboutSections.map((section, index) => (
          <AboutSection
            key={index}
            section={section}
          />
        ))}

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