import CTASection from "@/components/global/CTASection";
import AICaseStudies from "@/components/static/ai-tools/AICaseStudies";
import AISeoSystem from "@/components/static/ai-tools/AISeoSystem";
import AIWhyDifferent from "@/components/static/ai-tools/AIWhyDifferent";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title:
    "AI Tools for Websites | Business Automation, AI SEO & Smart Web Solutions",
  description:
    "Discover our custom AI tools for websites. We build AI chatbots, automation systems, AI-driven SEO tools, and smart dashboards to help businesses scale faster and generate more leads.",
  keywords: [
    " AI tools for websites",

    "website automation AI",

    "AI chatbot for business",

    "AI SEO tools",

    "custom AI integration services",

    "AI website development",

    "AI business automation",

    "AI-powered web design agency",
  ],
};

const defaultFAQs = [
  {
    id: "1",
    question: "Can AI tools be integrated into my existing website",
    answer:
      "Yes. We can integrate AI systems into your current website without rebuilding everything",
    category: "Website",
  },
  {
    id: "2",
    question: "Are your AI tools custom or pre-built?",
    answer:
      "Our AI tools are custom-built based on your business needs and customer behavior",
    category: "AI",
  },
  {
    id: "3",
    question: "Can AI improve my website conversion rate?",
    answer:
      "Absolutely. AI helps guide users, answer objections, and increase trust instantly.",
    category: "Website",
  },
  {
    id: "4",
    question: "Can AI tools help with SEO rankings",
    answer:
      "Yes. AI can automate keyword research, content planning, internal linking, and content optimization",
    category: "Seo",
  },
  {
    id: "5",
    question: "Is AI automation expensive?",
    answer:
      "AI tools can be developed as small modules or full systems depending on your budget and business goals.",
    category: "Price",
  },
 
];
// Dynamic import for client-only component (GSAP requires browser APIs)
const HeroSection = dynamic(
  () => import("../../components/static/ai-tools/HeroSection"),
);
const AIToolsOverview = dynamic(
  () => import("../../components/static/ai-tools/AIToolsOverview"),
);
const AISolutionsGrid = dynamic(
  () => import("../../components/static/ai-tools/AISolutionsGrid"),
);
const AIBenefits = dynamic(
  () => import("../../components/static/ai-tools/AIBenefits"),
);

const FAQSection = dynamic(() => import("../../components/global/FAQSection"));

export default function AITOOLS(): JSX.Element {
  return (
    <main>
      <HeroSection />
      <AIToolsOverview />
      <AISolutionsGrid />
      <AIBenefits />
      <AISeoSystem />
      <AICaseStudies />
      <AIWhyDifferent />

      <FAQSection faqs={defaultFAQs} />
      <CTASection />
    </main>
  );
}
