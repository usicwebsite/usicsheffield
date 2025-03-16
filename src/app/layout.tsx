import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Cursor Website Building Guide",
  description: "A step-by-step guide to creating websites using Cursor's AI-powered features",
  keywords: ["Cursor", "Website", "Guide", "AI", "Coding", "Web Development"],
  authors: [{ name: "Cursor Guide Team" }],
  creator: "Cursor Guide",
  publisher: "Cursor Guide",
  openGraph: {
    title: "Cursor Website Building Guide",
    description: "A step-by-step guide to creating websites using Cursor's AI-powered features",
    url: "https://cursor.sh/",
    siteName: "Cursor Website Building Guide",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cursor Website Building Guide",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursor Website Building Guide",
    description: "A step-by-step guide to creating websites using Cursor's AI-powered features",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
