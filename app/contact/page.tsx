 import { Metadata } from "next";
import dynamic from "next/dynamic";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Web Design, SEO & AI Automation Agency",
  description:
    "Contact our team to discuss your web design, SEO, or AI automation project. Request a free consultation and receive a tailored proposal within 24 hours.",
  keywords: [
    " contact web design agency",

    "web development consultation",

    "SEO agency contact",

    "AI automation consultation",

    "request website quote",

    "hire web design company",
  ],
};

// Dynamic import for client-only component (GSAP requires browser APIs)
const ContactHeroSection = dynamic(
  () => import("../../components/static/contact/ContactHeroSection"),
);
const ContactSection = dynamic(
  () => import("../../components/static/contact/ContactSection"),
);
const ContactFooterSections = dynamic(
  () => import("../../components/static/contact/ContactFooterSections"),
);

export default function Contact(): JSX.Element {
  return (
    <main>
      <ContactHeroSection />
      <ContactSection />
      <ContactFooterSections />
    </main>
  );
}
