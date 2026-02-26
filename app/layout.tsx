import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

// Primary font for headings - modern, geometric with personality
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

// Secondary font for body text - highly readable
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Accent font for special elements - tech feel
const spaceGrotesk = Space_Grotesk({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
  
});

export const metadata: Metadata = {
  title:
    "AI-Powered Web Design & SEO Services | Custom Websites for Business Growth",
  description:
    "We build high-performance websites with professional SEO and custom AI automation tools tailored to your business. Web design, SEO, and smart website solutions that generate leads and sales.",
  keywords: [
    "AI web design agency",
    "custom website design",
    "SEO services for businesses",
    "AI automation for websites",
    "smart business websites",
    "professional web development",
    "website SEO optimization",
    "AI tools for business websites",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head></head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} ${spaceGrotesk.variable} font-body antialiased bg-dark text-white`}
      >
        {/* scroll progress bar at very top */}
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
