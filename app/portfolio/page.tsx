import CTASection from "@/components/global/CTASection";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Portfolio | Web Design, SEO & AI Automation Case Studies",
  description:
    "Explore our portfolio of custom web design, SEO growth campaigns, and AI automation projects. See how we help businesses grow with smart websites and real results.",
  keywords: [
    "  web design portfolio",
    "SEO case studies",
    "AI automation projects",
    "website design examples",
    "UI UX portfolio",
    "SEO agency portfolio",
    "AI website integration portfolio",
  ],
};

const defaultFAQs = [
  {
    id: "1",
    question: "Do you offer custom website design or templates?",
    answer:
      "We build fully custom websites tailored to your brand, goals, and target audience",
    category: "website",
  },
  {
    id: "2",
    question: "Can you rank my website on Google?",
    answer:
      "Yes. Our SEO strategy focuses on technical SEO, keyword optimization, and long-term authority building",
    category: "SEO",
  },
  {
    id: "3",
    question: "Do you build AI tools inside websites?",
    answer:
      "Yes. We develop AI tools such as chatbots, automation workflows, lead scoring systems, and custom dashboards.",
    category: "AI",
  },
  {
    id: "4",
    question: "Do you work internationally",
    answer:
      "Yes. We work with businesses worldwide and provide full remote support",
    category: "international",
  },
  {
    id: "5",
    question: "Do you work internationally?",
    answer:
      "Yes. We work with clients worldwide and provide full support remotely. We've successfully delivered projects for businesses across North America, Europe, Asia, and Australia. Communication is handled via video calls, email, and project management tools to ensure smooth collaboration regardless of timezone.",
    category: "General",
  },
  {
    id: "6",
    question: "Can you maintain and support my website after launch?",
    answer:
      "Absolutely. We offer monthly support plans, updates, and security monitoring",
    category: "support",
  },
];
// Dynamic import for client-only component (GSAP requires browser APIs)
const PortfolioHeroSection = dynamic(
  () => import("../../components/static/portfolio/PortfolioHeroSection"),
);
const PortfolioIntroSection = dynamic(
  () => import("../../components/static/portfolio/PortfolioIntroSection"),
);
const FeaturedProjectsSection = dynamic(
  () => import("../../components/static/portfolio/FeaturedProjectsSection"),
);
const CaseStudiesSection = dynamic(
  () => import("../../components/static/portfolio/CaseStudiesSection"),
);

const FAQSection = dynamic(() => import("../../components/global/FAQSection"));

export default function About(): JSX.Element {
  return (
    <main>
      <PortfolioHeroSection />
      <PortfolioIntroSection />
      <FeaturedProjectsSection />
      <CaseStudiesSection />

      <FAQSection faqs={defaultFAQs} />

      <CTASection />
    </main>
  );
}
