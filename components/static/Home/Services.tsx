"use client";

import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
  useMemo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface ServiceFeature {
  text: string;
  highlight?: boolean;
}

interface Service {
  id: string;
  number: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  features: ServiceFeature[];
  icon: React.ReactNode;
  accentColor: string;
  image: string;
}

interface ServicesConfig {
  sectionTag: string;
  headline: string;
  description: string;
  services: Service[];
  cta: {
    label: string;
    href: string;
  };
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  webDesign: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
  ),
  seo: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
      <circle cx="19" cy="9" r="2" fill="currentColor" />
    </svg>
  ),
  ai: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 0 1 1h1a4 4 0 0 1 0 8h-1a1 1 0 0 0-1 1v1a4 4 0 0 1-8 0v-1a1 1 0 0 0-1-1H6a4 4 0 0 1 0-8h1a1 1 0 0 0 1-1V6a4 4 0 0 1 4-4z" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 8v1M12 15v1M8 12h1M15 12h1" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  arrow: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  arrowUpRight: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  layers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════

const defaultConfig: ServicesConfig = {
  sectionTag: "Our Services",
  headline:
    "Everything You Need to Build, Rank, and Automate Your Business Online",
  description:
    "Our agency combines modern web development, advanced SEO strategies, and AI-powered automation to create websites that generate leads, build trust, and scale your business faster than traditional web design.",
  services: [
    {
      id: "web-design",
      number: "01",
      tag: "Development",
      title: "Web Design & Development",
      headline: "Custom Websites Built to Convert",
      description:
        "We design modern, fast, and responsive websites with premium UI/UX, optimized for sales, lead generation, and brand authority.",
      features: [
        { text: "Custom UI/UX Design", highlight: true },
        { text: "Mobile-First Development" },
        { text: "Landing Pages + Full Websites" },
        { text: "Fast Performance & Clean Code" },
      ],
      icon: Icons.webDesign,
      accentColor: "#F59E0B",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
    {
      id: "seo",
      number: "02",
      tag: "Growth",
      title: "SEO & Google Growth",
      headline: "SEO That Drives Real Traffic",
      description:
        "We don't do basic SEO. We build complete SEO systems that rank your business and bring customers consistently.",
      features: [
        { text: "Technical SEO Setup", highlight: true },
        { text: "On-Page Optimization" },
        { text: "Content Strategy" },
        { text: "Local SEO & Google Maps" },
        { text: "Monthly Reporting" },
      ],
      icon: Icons.seo,
      accentColor: "#06B6D4",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
      id: "ai-automation",
      number: "03",
      tag: "Automation",
      title: "AI Website Automation",
      headline: "Smart Websites With Custom AI Tools",
      description:
        "We create AI-powered tools that automate your website processes such as lead handling, customer support, booking systems, and business analysis.",
      features: [
        { text: "AI Chatbots & Smart Assistants", highlight: true },
        { text: "Automated Lead Qualification" },
        { text: "AI Content Generation" },
        { text: "AI Dashboards for Insights" },
        { text: "Workflow Automation Tools" },
      ],
      icon: Icons.ai,
      accentColor: "#8B5CF6",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    },
  ],
  cta: {
    label: "Explore All Services",
    href: "/services",
  },
};

// ════════════════════════════════════════════════════════════════════
// BACKGROUND
// ════════════════════════════════════════════════════════════════════

const SectionBackground = memo(function SectionBackground({
  activeColor,
}: {
  activeColor: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-[#08090C]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Dynamic Gradient based on active service */}
      <div
        className="absolute left-1/2 top-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse, ${activeColor}08 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Corner Accents */}
      <div
        className="absolute left-0 top-0 h-px w-40 transition-colors duration-700"
        style={{
          background: `linear-gradient(90deg, ${activeColor}50, transparent)`,
        }}
      />
      <div
        className="absolute left-0 top-0 h-40 w-px transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, ${activeColor}50, transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-px w-40 transition-colors duration-700"
        style={{
          background: `linear-gradient(270deg, ${activeColor}50, transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-40 w-px transition-colors duration-700"
        style={{
          background: `linear-gradient(0deg, ${activeColor}50, transparent)`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════

const SectionHeader = memo(function SectionHeader({
  tag,
  headline,
  description,
  isVisible,
}: {
  tag: string;
  headline: string;
  description: string;
  isVisible: boolean;
}) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {/* Tag */}
      <div
        className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-white/2 px-4 py-2 backdrop-blur-sm"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span className="h-4 w-4 text-amber-400">{Icons.layers}</span>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          {tag}
        </span>
      </div>

      {/* Headline */}
      <h2
        className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem]"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s",
        }}
      >
        {headline}
      </h2>

      {/* Description */}
      <p
        className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
        }}
      >
        {description}
      </p>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SERVICE CARD - DESKTOP (Horizontal Expandable)
// ════════════════════════════════════════════════════════════════════

const ServiceCardDesktop = memo(function ServiceCardDesktop({
  service,
  isActive,
  onActivate,
  index,
}: {
  service: Service;
  isActive: boolean;
  onActivate: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Animation
  useEffect(() => {
    if (!contentRef.current || !imageRef.current) return;

    const features = contentRef.current.querySelectorAll(".feature-item");
    const headline = contentRef.current.querySelector(".service-headline");
    const description = contentRef.current.querySelector(
      ".service-description",
    );
    const link = contentRef.current.querySelector(".service-link");

    if (isActive) {
      gsap.to(features, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.to([headline, description], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.to(link, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.4,
        ease: "power2.out",
      });
      gsap.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      gsap.to(features, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to([headline, description, link], {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(imageRef.current, {
        scale: 1.1,
        opacity: 0.5,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className="group relative cursor-pointer overflow-hidden border transition-all duration-500"
      style={{
        borderColor: isActive
          ? `${service.accentColor}30`
          : "rgba(255,255,255,0.06)",
        backgroundColor: isActive
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.01)",
      }}
      onMouseEnter={onActivate}
      onClick={onActivate}
    >
      <div className="flex h-full">
        {/* Left: Content */}
        <div
          ref={contentRef}
          className="flex flex-1 flex-col justify-between p-8 lg:p-10"
        >
          {/* Top */}
          <div>
            {/* Number + Tag */}
            <div className="mb-6 flex items-center gap-4">
              <span
                className="font-mono text-4xl font-bold transition-colors duration-300 lg:text-5xl"
                style={{
                  color: isActive
                    ? service.accentColor
                    : "rgba(255,255,255,0.1)",
                }}
              >
                {service.number}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-px w-6 transition-all duration-300"
                  style={{
                    backgroundColor: isActive
                      ? service.accentColor
                      : "rgba(255,255,255,0.2)",
                    width: isActive ? "32px" : "24px",
                  }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-widest transition-colors duration-300"
                  style={{
                    color: isActive
                      ? service.accentColor
                      : "rgba(255,255,255,0.4)",
                  }}
                >
                  {service.tag}
                </span>
              </div>
            </div>

            {/* Icon + Title */}
            <div className="mb-4 flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center border transition-all duration-300"
                style={{
                  borderColor: isActive
                    ? `${service.accentColor}50`
                    : "rgba(255,255,255,0.1)",
                  backgroundColor: isActive
                    ? `${service.accentColor}10`
                    : "transparent",
                }}
              >
                <div
                  className="h-6 w-6 transition-colors duration-300"
                  style={{
                    color: isActive
                      ? service.accentColor
                      : "rgba(255,255,255,0.5)",
                  }}
                >
                  {service.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white">
                {service.title}
              </h3>
            </div>

            {/* Headline */}
            <h4
              className="service-headline text-2xl font-bold leading-tight text-white lg:text-3xl"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              {service.headline}
            </h4>

            {/* Description */}
            <p
              className="service-description mt-4 max-w-md text-sm leading-relaxed text-white/50 lg:text-base"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              {service.description}
            </p>
          </div>

          {/* Bottom: Features */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="feature-item flex items-center gap-2 border bg-white/2 px-3 py-2 transition-colors duration-300"
                  style={{
                    opacity: 0,
                    transform: "translateX(-20px)",
                    borderColor: feature.highlight
                      ? `${service.accentColor}30`
                      : "rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    className="h-3.5 w-3.5"
                    style={{ color: service.accentColor }}
                  >
                    {Icons.check}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: feature.highlight
                        ? "white"
                        : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Link */}
            <Link
              href={`/services/${service.id}`}
              className="service-link group/link mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
              style={{
                color: service.accentColor,
                opacity: 0,
                transform: "translateY(10px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="border-b border-transparent transition-all group-hover/link:border-current">
                Learn more about {service.title}
              </span>
              <span className="h-4 w-4 transition-transform group-hover/link:translate-x-1">
                {Icons.arrow}
              </span>
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div
          ref={imageRef}
          className="relative hidden w-[45%] overflow-hidden lg:block"
          style={{ opacity: 0.5, transform: "scale(1.1)" }}
        >
          {/* Image */}
          <img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to right, #0A0C12 0%, transparent 30%, transparent 70%, ${service.accentColor}10 100%)`,
              opacity: isActive ? 1 : 0.5,
            }}
          />

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(90deg, ${service.accentColor} 1px, transparent 1px),
                linear-gradient(${service.accentColor} 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Corner Frame */}
          <div className="absolute right-4 top-4">
            <div
              className="h-8 w-8 border-r border-t transition-colors duration-300"
              style={{
                borderColor: isActive
                  ? service.accentColor
                  : "rgba(255,255,255,0.2)",
              }}
            />
          </div>
          <div className="absolute bottom-4 left-4">
            <div
              className="h-8 w-8 border-b border-l transition-colors duration-300"
              style={{
                borderColor: isActive
                  ? service.accentColor
                  : "rgba(255,255,255,0.2)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 origin-left transition-transform duration-500"
        style={{
          backgroundColor: service.accentColor,
          transform: isActive ? "scaleX(1)" : "scaleX(0)",
        }}
      />

      {/* Top Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom, ${service.accentColor}08, transparent)`,
          opacity: isActive ? 1 : 0,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SERVICE CARD - MOBILE (Vertical Expandable)
// ════════════════════════════════════════════════════════════════════

const ServiceCardMobile = memo(function ServiceCardMobile({
  service,
  isActive,
  onToggle,
}: {
  service: Service;
  isActive: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="overflow-hidden border transition-all duration-500"
      style={{
        borderColor: isActive
          ? `${service.accentColor}30`
          : "rgba(255,255,255,0.06)",
        backgroundColor: isActive ? "rgba(255,255,255,0.02)" : "transparent",
      }}
    >
      {/* Header (Always Visible) */}
      <button
        className="flex w-full items-center justify-between p-5"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center border transition-all duration-300"
            style={{
              borderColor: isActive
                ? `${service.accentColor}50`
                : "rgba(255,255,255,0.1)",
              backgroundColor: isActive
                ? `${service.accentColor}15`
                : "transparent",
            }}
          >
            <div
              className="h-6 w-6 transition-colors duration-300"
              style={{
                color: isActive ? service.accentColor : "rgba(255,255,255,0.5)",
              }}
            >
              {service.icon}
            </div>
          </div>

          {/* Title */}
          <div className="text-left">
            <span
              className="block text-xs font-medium uppercase tracking-widest transition-colors duration-300"
              style={{
                color: isActive ? service.accentColor : "rgba(255,255,255,0.4)",
              }}
            >
              {service.number} — {service.tag}
            </span>
            <span className="mt-1 block font-semibold text-white">
              {service.title}
            </span>
          </div>
        </div>

        {/* Toggle Icon */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
          style={{
            borderColor: isActive
              ? `${service.accentColor}50`
              : "rgba(255,255,255,0.1)",
            backgroundColor: isActive
              ? `${service.accentColor}10`
              : "transparent",
          }}
        >
          <svg
            className="h-4 w-4 transition-transform duration-300"
            style={{
              color: isActive ? service.accentColor : "rgba(255,255,255,0.5)",
              transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        className="grid transition-all duration-500"
        style={{
          gridTemplateRows: isActive ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/[0.04] p-5">
            {/* Image */}
            <div className="relative mb-5 aspect-video overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
                style={{
                  filter: isActive
                    ? "grayscale(0) brightness(1)"
                    : "grayscale(1) brightness(0.7)",
                  transition: "filter 0.5s",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, #0A0C12 0%, transparent 50%)`,
                }}
              />

              {/* Overlay Badge */}
              <div
                className="absolute bottom-3 left-3 border px-3 py-1.5 backdrop-blur-sm"
                style={{
                  borderColor: `${service.accentColor}40`,
                  backgroundColor: `${service.accentColor}20`,
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: service.accentColor }}
                >
                  {service.headline}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-white/60">
              {service.description}
            </p>

            {/* Features */}
            <div className="mt-5 flex flex-wrap gap-2">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 border border-white/[0.06] bg-white/2 px-2.5 py-1.5"
                >
                  <span
                    className="h-3 w-3"
                    style={{ color: service.accentColor }}
                  >
                    {Icons.check}
                  </span>
                  <span className="text-xs text-white/70">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Link */}
            <Link
              href={`/services/${service.id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: service.accentColor }}
            >
              <span>Learn more</span>
              <span className="h-4 w-4">{Icons.arrow}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div
        className="h-1 transition-all duration-500"
        style={{
          backgroundColor: service.accentColor,
          opacity: isActive ? 1 : 0,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SERVICE TABS - DESKTOP
// ════════════════════════════════════════════════════════════════════

const ServiceTabs = memo(function ServiceTabs({
  services,
  activeIndex,
  onSelect,
}: {
  services: Service[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {services.map((service, index) => (
        <button
          key={service.id}
          onClick={() => onSelect(index)}
          className="group relative flex items-center gap-3 px-5 py-3 transition-all duration-300"
          style={{
            backgroundColor:
              index === activeIndex
                ? `${service.accentColor}10`
                : "transparent",
            borderBottom: `2px solid ${index === activeIndex ? service.accentColor : "transparent"}`,
          }}
        >
          {/* Icon */}
          <div
            className="h-5 w-5 transition-colors duration-300"
            style={{
              color:
                index === activeIndex
                  ? service.accentColor
                  : "rgba(255,255,255,0.4)",
            }}
          >
            {service.icon}
          </div>

          {/* Label */}
          <span
            className="text-sm font-medium transition-colors duration-300"
            style={{
              color: index === activeIndex ? "white" : "rgba(255,255,255,0.5)",
            }}
          >
            {service.title}
          </span>

          {/* Number Badge */}
          <span
            className="font-mono text-xs transition-colors duration-300"
            style={{
              color:
                index === activeIndex
                  ? service.accentColor
                  : "rgba(255,255,255,0.2)",
            }}
          >
            {service.number}
          </span>
        </button>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN CTA BUTTON
// ════════════════════════════════════════════════════════════════════

const MainCTA = memo(function MainCTA({
  label,
  href,
  color,
}: {
  label: string;
  href: string;
  color: string;
}) {
  return (
    <div className="mt-16 flex justify-center">
      <Link
        href={href}
        className="group relative inline-flex items-center gap-3 border px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-xl"
        style={{
          borderColor: `${color}50`,
          backgroundColor: `${color}10`,
          color: color,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 20px 50px -15px ${color}30`;
          e.currentTarget.style.backgroundColor = `${color}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.backgroundColor = `${color}10`;
        }}
      >
        <span>{label}</span>
        <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
          {Icons.arrowUpRight}
        </span>

        {/* Corner Accents */}
        <span
          className="absolute -left-px -top-px h-3 w-3 border-l border-t transition-colors"
          style={{ borderColor: color }}
        />
        <span
          className="absolute -bottom-px -right-px h-3 w-3 border-b border-r transition-colors"
          style={{ borderColor: color }}
        />
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// HOOK: useMediaQuery
// ════════════════════════════════════════════════════════════════════

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ════════════════════════════════════════════════════════════════════
// MAIN SERVICES COMPONENT
// ════════════════════════════════════════════════════════════════════

const ServicesOverview: React.FC<{ config?: ServicesConfig }> = ({
  config = defaultConfig,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const services = useMemo(() => config.services, [config.services]);
  const activeService = services[activeIndex];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mobile toggle handler
  const handleMobileToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden py-20 md:py-32"
      aria-labelledby="services-headline"
    >
      <SectionBackground
        activeColor={activeService?.accentColor || "#F59E0B"}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Header */}
        <SectionHeader
          tag={config.sectionTag}
          headline={config.headline}
          description={config.description}
          isVisible={isVisible}
        />

        {/* Services */}
        <div
          className="mt-16 md:mt-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        >
          {isMobile ? (
            // Mobile: Accordion Style
            <div className="flex flex-col gap-3">
              {services.map((service, index) => (
                <ServiceCardMobile
                  key={service.id}
                  service={service}
                  isActive={activeIndex === index}
                  onToggle={() => handleMobileToggle(index)}
                />
              ))}
            </div>
          ) : (
            // Desktop: Tabs + Large Card
            <>
              <ServiceTabs
                services={services}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
              <div className="relative min-h-[500px]">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className={`${index === activeIndex ? "relative z-10" : "pointer-events-none absolute inset-0 z-0 opacity-0"}`}
                    style={{
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <ServiceCardDesktop
                      service={service}
                      isActive={index === activeIndex}
                      onActivate={() => setActiveIndex(index)}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s",
          }}
        >
          <MainCTA
            label={config.cta.label}
            href={config.cta.href}
            color={activeService?.accentColor || "#F59E0B"}
          />
        </div>
      </div>

      {/* Decorative: Service Numbers */}
      <div className="pointer-events-none absolute bottom-10 right-10 hidden opacity-[0.03] lg:block">
        <span className="font-mono text-[200px] font-bold leading-none">
          {activeService?.number}
        </span>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════

export default memo(ServicesOverview);
export type { ServicesConfig, Service };
