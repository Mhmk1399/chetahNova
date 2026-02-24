import CTASection from "@/components/global/CTASection";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Web Design, SEO & AI Automation Services | Smart Website Solutions",
  description:
    "Explore our professional web design, SEO, and AI integration services. We build fast websites, rank them on Google, and automate business workflows using custom AI tools.",
  keywords: [
    " web design services",

    "SEO services agency",
    "AI automation services",

    "custom website development",

    "technical SEO audit",

    "AI website integration",

    "website maintenance services",

    "UI UX design services",
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
const ServicesHeroSection = dynamic(
  () => import("../../components/static/services/ServicesHeroSection"),
);
const ServicesIntro = dynamic(
  () => import("../../components/static/services/ServicesIntro"),
);
const WebDesignSection = dynamic(
  () => import("../../components/static/services/WebDesignSection"),
);
const SEOSection = dynamic(
  () => import("../../components/static/services/SEOSection"),
);
const AIIntegrationSection = dynamic(
  () => import("../../components/static/services/AIIntegrationSection"),
);
const MaintenanceSupportSection = dynamic(
  () => import("../../components/static/services/MaintenanceSupportSection"),
);
const ServicePackagesSection = dynamic(
  () => import("../../components/static/services/ServicePackagesSection"),
);
const FAQSection = dynamic(() => import("../../components/global/FAQSection"));

export default function About(): JSX.Element {
  return (
    <main>
      <ServicesHeroSection id="hero" />
      <ServicesIntro />
      <WebDesignSection />
      <SEOSection />
      <AIIntegrationSection />
      <MaintenanceSupportSection />
      <ServicePackagesSection />
      <FAQSection faqs={defaultFAQs} />

      <CTASection />
    </main>
  );
}
