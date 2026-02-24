import CTASection from "@/components/global/CTASection";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "About Us | AI-Powered Web Design, SEO & Automation Agency",
  description:
    "Learn about our agency specializing in web design, SEO, and custom AI automation tools. Discover our mission, values, and approach to building smart websites that grow businesses.",
  keywords: [
    "  about web design agency",

    "AI web development company",

    "SEO agency about us",

    "website automation agency",

    "custom web design team",

    "AI-powered SEO company",
  ],
};
// Dynamic import for client-only component (GSAP requires browser APIs)
const HeroSection = dynamic(
  () => import("../../components/static/About/AboutHero"),
);
const CompanyOverviewSection = dynamic(
  () => import("../../components/static/About/CompanyOverviewSection"),
);
const MissionVisionSection = dynamic(
  () => import("../../components/static/About/MissionVisionSection"),
);
const CoreValuesSection = dynamic(
  () => import("../../components/static/About/CoreValuesSection"),
);
const OurStorySection = dynamic(
  () => import("../../components/static/About/OurStorySection"),
);
const OurApproachSection = dynamic(
  () => import("../../components/static/About/OurApproachSection"),
);
const TeamMembersSection = dynamic(
  () => import("../../components/static/About/TeamMembersSection"),
);
const WhyTrustUsSection = dynamic(
  () => import("../../components/static/About/WhyTrustUsSection"),
);
export default function About(): JSX.Element {
  return (
    <main>
      <HeroSection id="hero" />
      <CompanyOverviewSection id="company-overview" />
      <MissionVisionSection id="MissionVisionSection-overview" />
      <CoreValuesSection id="CoreValuesSection-overview" />
      <OurStorySection id="OurStorySection-overview" />
      <OurApproachSection id="OurApproachSection-overview" />
      <TeamMembersSection id="TeamMembersSection-overview" />
      <WhyTrustUsSection id="WhyTrustUsSection-overview" />
      <CTASection />
    </main>
  );
}
