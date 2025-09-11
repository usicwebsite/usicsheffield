import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}

export default function CTAButton({ href, children, external = false, className = "" }: CTAButtonProps) {
  const baseClasses = "bg-white text-[#18384D] hover:bg-white/90 px-8 py-4 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg";
  
  if (external) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${className}`}
    >
      {children}
    </Link>
  );
}
