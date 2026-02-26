import CTASection from "@/components/global/CTASection";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Pricing | Web Design, SEO & AI Automation Packages",
  description:
    "View our transparent pricing for web design, SEO services, and AI automation tools. Choose from flexible packages or request a custom quote tailored to your business.",
  keywords: [
    " web design pricing",
    "SEO pricing packages",
    "AI automation pricing",
    "website development cost",
    "SEO monthly plans",
    "AI chatbot pricing",
    "custom website quote",
  ],
};

const defaultFAQs = [
  {
    id: "1",
    question: "Do you offer custom pricing?",
    answer:
      "Yes. Every project can be customized based on features, pages, integrations, and business goals",
    category: "offer",
  },
  {
    id: "2",
    question: "Do you require full payment upfront?",
    answer:
      "Usually we start with a deposit, and the rest is paid based on project milestones",
    category: "payment",
  },
  {
    id: "3",
    question: "Is SEO included in the website packages?",
    answer:
      "Yes. Every website includes basic SEO structure. Advanced SEO growth requires monthly SEO plans",
    category: "SEO",
  },
  {
    id: "4",
    question: "Can I upgrade my package later?",
    answer:
      "Absolutely. Many clients start with web design and later add SEO or AI automation",
    category: "upgrade",
  },
  {
    id: "5",
    question: "How long does it take to see SEO results?",
    answer:
      "Most businesses start seeing improvement within 2 to 4 months depending on competition and website condition.",
    category: "SEO",
  },
  {
    id: "6",
    question: "Are AI tools one-time payments or subscription?",
    answer:
      "Both options are available. You can choose one-time AI development or monthly subscription support",
    category: "payments",
  },
];
// Dynamic import for client-only component (GSAP requires browser APIs)
const PricingHero = dynamic(
  () => import("../../components/static/pricing/PricingHero"),
);
const PricingIntroSection = dynamic(
  () => import("../../components/static/pricing/PricingIntroSection"),
);
const WebDesignPackagesSection = dynamic(   
  () => import("../../components/static/pricing/WebDesignPackagesSection"),
);
const SeoServicePlansSection = dynamic(
  () => import("../../components/static/pricing/SeoServicePlansSection"),
);
const AiToolsPricingSection = dynamic(
  () => import("../../components/static/pricing/AiToolsPricingSection"),
);
const CustomSolutionsSection = dynamic(
  () => import("../../components/static/pricing/CustomSolutionsSection"),
);

const FAQSection = dynamic(() => import("../../components/global/FAQSection"));

export default function Pricing(): JSX.Element {
  return (
    <main>
      <PricingHero />
      <PricingIntroSection />
      <WebDesignPackagesSection />
      <SeoServicePlansSection />
      <AiToolsPricingSection />
      <CustomSolutionsSection />

      <FAQSection faqs={defaultFAQs} />
      <CTASection />
    </main>
  );
}
