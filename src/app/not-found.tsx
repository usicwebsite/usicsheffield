import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-[#18384D] mb-6">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="bg-[#18384D] hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition duration-300"
      >
        Return to Homepage
      </Link>
    </div>
  );
} 