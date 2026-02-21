import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/global/NavBar";
import Footer from "@/components/global/Footer";
import { ToastContainer } from "@/components/ui/toast";
import SmoothScroll from "@/components/ui/Scroll/SmoothScroll";
import ScrollProgress from "@/components/ui/Scroll/ScrollProgress";
import ScrollToTop from "@/components/ui/Scroll/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Powered Web Design & SEO Services | Custom Websites for Business Growth",
  description: "We build high-performance websites with professional SEO and custom AI automation tools tailored to your business. Web design, SEO, and smart website solutions that generate leads and sales.",
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
        <SmoothScroll
          duration={1.1}
          easing="expo"
          wheelMultiplier={1}
          touchMultiplier={1.5}
          disableOnMobile={false}
        >
          {/* scroll progress bar at very top */}
          <ScrollProgress />
          <NavBar />
          <ToastContainer position="top-right" />
          {children}
          <Footer />
          {/* back to top button */}
          <ScrollToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
