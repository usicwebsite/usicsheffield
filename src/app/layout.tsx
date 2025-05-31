import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#18384D] text-gray-900 flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
