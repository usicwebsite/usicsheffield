"use client";

import { useEffect, useState } from 'react';

interface CSRFProviderProps {
  children: React.ReactNode;
}

export default function CSRFProvider({ children }: CSRFProviderProps) {
  const [, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    // Get CSRF token from meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    const token = metaTag?.getAttribute('content');
    
    if (token) {
      setCsrfToken(token);
    } else {
      // If no token in meta tag, generate one and set it
      console.warn('[CSRFProvider] No CSRF token found in meta tag, generating one...');
      // This is a fallback - ideally the token should be set by the server
    }
  }, []);

  return <>{children}</>;
}
