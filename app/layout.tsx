import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* scroll progress bar at very top */}
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
