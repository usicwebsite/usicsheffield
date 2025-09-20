import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import AdminLayout from "@/components/AdminLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { generateCSRFToken } from "@/lib/csrf";
import { cookies } from 'next/headers';
import GroupchatModalProvider from "@/components/GroupchatModalProvider";
import RestrictionMonitor from "@/components/RestrictionMonitor";

// Initialize the Geist font with Latin subset
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Initialize the Geist Mono font with Latin subset
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define metadata for better SEO
export const metadata: Metadata = {
  title: "USIC - University of Sheffield Islamic Circle",
  description: "The official website of the University of Sheffield Islamic Circle, providing social and welfare support for Muslim students.",
  keywords: ["USIC", "University of Sheffield", "Islamic Circle", "Muslim Students", "Sheffield"],
  authors: [{ name: "USIC" }],
  creator: "USIC",
  publisher: "USIC",
  openGraph: {
    title: "USIC - University of Sheffield Islamic Circle",
    description: "The official website of the University of Sheffield Islamic Circle, providing social and welfare support for Muslim students.",
    url: "https://usic-sheffield.org/",
    siteName: "USIC - University of Sheffield Islamic Circle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "USIC - University of Sheffield Islamic Circle",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "USIC - University of Sheffield Islamic Circle",
    description: "The official website of the University of Sheffield Islamic Circle, providing social and welfare support for Muslim students.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get CSRF token from cookies or generate a new one
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get('csrf_token')?.value || generateCSRFToken();
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="csrf-token" content={csrfToken} />
        {/* CSP handled by middleware - removed conflicting meta tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure CSRF token is available globally
              window.__CSRF_TOKEN__ = "${csrfToken}";
              
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#18384D] text-gray-900 flex flex-col min-h-screen overflow-x-hidden`}
      >
        <ErrorBoundary>
          <FirebaseProvider>
            <RestrictionMonitor />
            <GroupchatModalProvider>
              <AdminLayout>
                {children}
              </AdminLayout>
            </GroupchatModalProvider>
          </FirebaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
