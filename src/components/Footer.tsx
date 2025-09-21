import Link from 'next/link';
import { navLinks, socialLinks, footerInfo } from '@/lib/footer-data';

// Reusable components
const SocialIcon = ({ href, label, icon }: { href: string; label: string; icon: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label={label}>
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d={icon} />
    </svg>
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-[#18384D] text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About section */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">{footerInfo.title}</h2>
            <p className="mb-4">{footerInfo.description}</p>
            <p>{footerInfo.subtitle}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-blue-200 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map(({ href, label, icon }) => (
                <SocialIcon key={href} href={href} label={label} icon={icon} />
              ))}
            </div>
            <p>Email: {footerInfo.email}</p>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-8 pt-8 border-t border-blue-800">
          <p className="text-center">
            Made by{' '}
            <a
              href="https://www.instagram.com/mikhailbuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-200 underline transition-colors"
            >
              @mikhailbuilds
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 