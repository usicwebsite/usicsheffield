export default function SponsorsPage() {
  return (
    <div className="pt-8">
      {/* Hero section */}
      <div className="bg-[#18384D] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Sponsors</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Thank you to our sponsors for supporting USIC
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-8">
            For the 2024-2025 academic year, USIC is proud to have UNIT Restaurant as our main sponsor.
          </p>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-12">
            <h2 className="text-2xl font-bold text-[#18384D] mb-4">UNIT Restaurant</h2>
            <p className="text-gray-700 mb-4">
              UNIT Restaurant offers delicious halal food in a welcoming environment.
              USIC members receive special discounts on selected menu items.
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> 100 Example Street, Sheffield, S1 2AB<br />
              <strong>Website:</strong> Coming soon
            </p>
          </div>
          
          <h2 className="text-2xl font-bold text-[#18384D] mb-6">Interested in Sponsoring USIC?</h2>
          <p className="text-gray-700 mb-8">
            If your business is interested in sponsoring USIC, please get in touch with us to discuss 
            partnership opportunities.
          </p>
          <a 
            href="mailto:usic@sheffield.ac.uk" 
            className="inline-block bg-[#18384D] hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition duration-300"
          >
            Contact Us About Sponsorship
          </a>
        </div>
      </div>
    </div>
  );
} 