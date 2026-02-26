import CTASection from "@/components/global/CTASection";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "FAQ | Web Design, SEO & AI Automation Questions Answered",
  description:
    "Find answers to common questions about our web design, SEO services, AI automation tools, pricing, contracts, and project delivery timelines.",
  keywords: [
    " web design FAQ",

    "SEO service questions",

    "AI chatbot FAQ",

    "website pricing FAQ",

    "SEO audit questions",

    "AI automation services FAQ",
  ],
};

// Dynamic import for client-only component (GSAP requires browser APIs)
const FaqHeroSection = dynamic(
  () => import("../../components/static/faq/FaqHeroSection"),
);
const FaqIntroSection = dynamic(
  () => import("../../components/static/faq/FaqIntroSection"),
);
const WebDesignFaqSection = dynamic(
  () => import("../../components/static/faq/WebDesignFaqSection"),
);
const SeoFaqSection = dynamic(
  () => import("../../components/static/faq/SeoFaqSection"),
);
const AiFaqSection = dynamic(
  () => import("../../components/static/faq/AiFaqSection"),
);
const PaymentFaqSection = dynamic(
  () => import("../../components/static/faq/PaymentFaqSection"),
);

export default function FAQ(): JSX.Element {
  return (
    <main>
      <FaqHeroSection />
      <FaqIntroSection />
      <WebDesignFaqSection />
      <SeoFaqSection />
      <AiFaqSection />
      <PaymentFaqSection />

      <CTASection />
    </main>
  );
}
