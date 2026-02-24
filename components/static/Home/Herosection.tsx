"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import gsap from "gsap";
import Link from "next/link";

// ════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════

interface ServiceCard {
  id: string;
  title: string;
  headline: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  image: string;
  accentColor: string;
}

interface HeroConfig {
  headline: string;
  highlightedText: string;
  subheadline: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
  services: ServiceCard[];
}

interface HeroProps {
  config?: HeroConfig;
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
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
  externalLink: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  chevronDown: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  chevronUp: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════

const defaultConfig: HeroConfig = {
  headline: "AI-Powered Web Design & SEO That Turns",
  highlightedText: "Visitors Into Customers",
  subheadline:
    "We build high-converting websites, advanced SEO systems, and custom AI automation tools tailored to your business, so your website becomes a growth machine, not just an online brochure.",
  primaryCTA: {
    label: "Get a Free Strategy Call",
    href: "/contact",
  },
  secondaryCTA: {
    label: "View Our Work",
    href: "/portfolio",
  },
  services: [
    {
      id: "web-design",
      title: "Web Design",
      headline: "Custom Website Design for Any Industry",
      description:
        "We craft stunning, high-performance websites that capture your brand essence and convert visitors into loyal customers. Every pixel is purposefully designed.",
      icon: Icons.webDesign,
      features: [
        "Responsive Design",
        "Lightning Fast",
        "Conversion Optimized",
        "Brand-Aligned",
      ],
      image: "/assets/images/Untitled.webp",
      accentColor: "#F59E0B",
    },
    {
      id: "seo",
      title: "SEO Systems",
      headline: "SEO That Ranks You on Google",
      description:
        "Dominate search results with our data-driven SEO strategies. We help you get found by customers actively searching for your services.",
      icon: Icons.seo,
      features: [
        "Keyword Research",
        "Technical SEO",
        "Content Strategy",
        "Link Building",
      ],
      image: "/assets/images/2 (5).webp",
      accentColor: "#06B6D4",
    },
    {
      id: "ai-automation",
      title: "AI Automation",
      headline: "AI Automation Tools  ",
      description:
        "Harness the power of artificial intelligence to automate repetitive tasks, streamline operations, and scale your business efficiently.",
      icon: Icons.ai,
      features: [
        "Custom AI Tools",
        "Workflow Automation",
        "Smart Analytics",
        "24/7 Operation",
      ],
      image: "/assets/images/3 (3).webp",
      accentColor: "#8B5CF6",
    },
  ],
};

// ════════════════════════════════════════════════════════════════════
// BACKGROUND COMPONENTS
// ════════════════════════════════════════════════════════════════════

const GridBackground = memo(function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial Fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, #08090C 75%)",
        }}
      />
      {/* Top Gradient */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background: "linear-gradient(to bottom, #08090C, transparent)",
        }}
      />
    </div>
  );
});

const AmbientGlow = memo(function AmbientGlow({
  color,
  position = "right",
}: {
  color: string;
  position?: "left" | "right" | "center";
}) {
  const positionStyles = {
    left: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
    right: "right-0 top-1/2 -translate-y-1/2 translate-x-1/4",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={`pointer-events-none absolute h-175 w-175 transition-all duration-1000 ${positionStyles[position]}`}
      style={{
        background: `radial-gradient(circle, ${color}15, transparent 60%)`,
        filter: "blur(100px)",
      }}
      aria-hidden="true"
    />
  );
});

// ════════════════════════════════════════════════════════════════════
// SERVICE CARD COMPONENT - ENHANCED
// ════════════════════════════════════════════════════════════════════

const ServiceCard = memo(function ServiceCard({
  service,
  isActive,
  index,
  onActivate,
  isMobile,
}: {
  service: ServiceCard;
  isActive: boolean;
  index: number;
  onActivate: () => void;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // GSAP Animation
  useEffect(() => {
    if (!contentRef.current || !imageRef.current || !overlayRef.current) return;

    const content = contentRef.current;
    const headline = content.querySelector(".card-headline");
    const description = content.querySelector(".card-description");
    const features = content.querySelectorAll(".card-feature");
    const icon = content.querySelector(".card-icon");
    const title = content.querySelector(".card-title");
    const learnMore = content.querySelector(".card-learn-more");

    const ctx = gsap.context(() => {
      if (isActive) {
        // Animate IN
        gsap.to([icon, title], {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(headline, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "power3.out",
        });
        gsap.to(description, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.18,
          ease: "power3.out",
        });
        gsap.to(features, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.06,
          delay: 0.25,
          ease: "power2.out",
        });
        gsap.to(learnMore, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.4,
          ease: "power2.out",
        });
        // Image
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
        });
        // Mobile: Add blur overlay for readability
        if (isMobile) {
          gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      } else {
        // Animate OUT
        gsap.to([headline, description, learnMore], {
          opacity: 0,
          y: 15,
          duration: 0.25,
          ease: "power2.in",
        });
        gsap.to(features, {
          opacity: 0,
          x: -15,
          duration: 0.2,
          ease: "power2.in",
        });
        gsap.to([icon, title], {
          opacity: 0.5,
          duration: 0.25,
          ease: "power2.in",
        });
        gsap.to(imageRef.current, {
          scale: 1.15,
          duration: 0.5,
          ease: "power2.out",
        });
        // Mobile: Remove blur overlay
        if (isMobile) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    }, cardRef);

    return () => ctx.revert();
  }, [isActive, isMobile]);

  const handleInteraction = useCallback(() => {
    onActivate();
  }, [onActivate]);

  return (
    <div
      ref={cardRef}
      className={`
        group relative cursor-pointer overflow-hidden border
        transition-all duration-500 ease-out
        ${isActive ? "border-white/20" : "border-white/6 hover:border-white/10"}
      `}
      style={{
        backgroundColor: "#0A0C12",
        minWidth: isMobile ? "100%" : "90px",
        minHeight: isMobile
          ? isActive
            ? "380px" // ← موبایل وقتی باز میشه
            : "90px"
          : "clamp(480px, 75vh, 750px)", // ← پیشنهاد جدید
      }}
      onClick={handleInteraction}
      onMouseEnter={!isMobile ? handleInteraction : undefined}
      onFocus={handleInteraction}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      aria-label={`${service.title}: ${service.headline}`}
    >
      {/* Background Image */}

      <img
        ref={imageRef}
        src={service.image}
        alt=""
        className="pointer-events-none   absolute inset-0 h-full w-full object-cover transition-[filter] duration-500"
        style={{
          transform: "scale(1.15)",
          filter: isActive
            ? "grayscale(0) brightness(0.9)"
            : "grayscale(0.3) brightness(0.4)",
          maskImage: isMobile
            ? "linear-gradient(to bottom, white 0%, white 100%)"
            : "radial-gradient(ellipse 190% 100% at 100% 50%, white 20%, transparent 90%)",
          WebkitMaskImage: isMobile
            ? "linear-gradient(to bottom, white 0%, white 100%)"
            : "radial-gradient(ellipse 190% 100% at 100% 50%, white 20%, transparent 90%)",
        }}
        loading="lazy"
      />

      {/* Mobile: Blur Overlay for Text Readability */}
      <div
        ref={overlayRef}
        className="absolute inset-0 md:hidden"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10, 12, 18, 0.5) 0%,
            rgba(10, 12, 18, 0.85) 30%,
            rgba(10, 12, 18, 0.95) 60%,
            rgba(10, 12, 18, 0.98) 100%
          )`,
          backdropFilter: isActive ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: isActive ? "blur(8px)" : "blur(0px)",
          opacity: 0,
          transition: "backdrop-filter 0.4s ease",
        }}
      />

      {/* Desktop: Gradient Overlay */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: isActive
            ? `linear-gradient(to right, rgba(10, 12, 18, 0.95) 0%, rgba(10, 12, 18, 0.7) 50%, transparent 100%)`
            : `linear-gradient(to right, rgba(10, 12, 18, 0.98) 0%, rgba(10, 12, 18, 0.9) 60%, transparent 100%)`,
          transition: "all 0.5s ease",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6"
      >
        {/* Header: Icon + Title */}
        <div
          className={`flex items-center gap-3 ${isMobile && !isActive ? "justify-between" : ""}`}
        >
          {/* Icon */}
          <div
            className="card-icon flex h-11 w-11 items-center justify-center border -ml-4 border-white/10 text-white md:h-12 md:w-12"
            style={{
              opacity: 0.5,
              backgroundColor: `${service.accentColor}15`,
              borderColor: `${service.accentColor}30`,
            }}
          >
            <div className="h-5 w-5 md:h-6 md:w-6">{service.icon}</div>
          </div>

          {/* Title */}
          <span
            className={`
              card-title font-mono text-[11px] font-semibold uppercase  tracking-[0.2em] text-white
              ${!isMobile && !isActive ? "absolute ml-4  left-6 top-20 origin-top-left rotate-90 whitespace-nowrap" : ""}
            `}
            style={{
              opacity: 0.5,
              transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {service.title}
          </span>

          {/* Mobile: Expand/Collapse Indicator */}
          {isMobile && (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300"
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
                className="h-4 w-4 transition-transform duration-300"
                style={{
                  color: isActive
                    ? service.accentColor
                    : "rgba(255,255,255,0.5)",
                  transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                {Icons.chevronDown}
              </div>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        <div className={`flex flex-col gap-4 ${isMobile ? "mt-6" : "mt-auto"}`}>
          {/* Headline */}
          <h3
            className="card-headline text-xl font-bold leading-tight text-left text-white md:text-2xl lg:text-[1.75rem]"
            style={{ opacity: 0, transform: "translateY(15px)" }}
          >
            {service.headline}
          </h3>

          {/* Description */}
          <p
            className="card-description max-w-md text-sm text-left leading-relaxed text-white/70 md:text-[15px]"
            style={{ opacity: 0, transform: "translateY(15px)" }}
          >
            {service.description}
          </p>

          {/* Features */}
          <div className="mt-1 flex flex-wrap gap-2">
            {service.features.map((feature, idx) => (
              <span
                key={idx}
                className="card-feature inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm"
                style={{ opacity: 0, transform: "translateX(-15px)" }}
              >
                <span
                  className="h-1.5 w-1.5"
                  style={{ backgroundColor: service.accentColor }}
                />
                {feature}
              </span>
            ))}
          </div>

          {/* Learn More Link */}
          <Link
            href={`/services/${service.id}`}
            className="card-learn-more group/link mt-2 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{
              opacity: 0,
              transform: "translateY(15px)",
              color: service.accentColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="border-b border-transparent transition-colors group-hover/link:border-current">
              Learn more
            </span>
            <span className="h-4 w-4 transition-transform group-hover/link:translate-x-1">
              {Icons.arrow}
            </span>
          </Link>
        </div>
      </div>

      {/* Accent Line */}
      <div
        className="absolute inset-x-0 bottom-0 origin-left transition-transform duration-500"
        style={{
          height: isMobile ? "3px" : "2px",
          backgroundColor: service.accentColor,
          transform: isActive ? "scaleX(1)" : "scaleX(0)",
        }}
      />

      {/* Top Accent Glow (when active) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom, ${service.accentColor}10, transparent)`,
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Index Number */}
      <span
        className="absolute right-4 top-4 font-mono text-xs tabular-nums transition-all duration-300 md:right-5 md:top-5"
        style={{
          color: service.accentColor,
          opacity: isActive ? 0.9 : 0,
          transform: isActive ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        0{index + 1}
      </span>

      {/* Corner Accent */}
      <div
        className="absolute right-0 top-0 h-16 w-16 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${service.accentColor}08 50%)`,
          opacity: isActive ? 1 : 0,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA BUTTONS
// ════════════════════════════════════════════════════════════════════

const PrimaryCTA = memo(function PrimaryCTA({
  label,
  href,
  accentColor,
}: {
  label: string;
  href: string;
  accentColor: string;
}) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-2xl sm:px-10 sm:py-5"
      style={{
        backgroundColor: accentColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 25px 50px ${accentColor}40`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
        {Icons.arrow}
      </span>

      {/* Shine Effect */}
      <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* Corner Cuts */}
      <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-white/30" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-white/30" />
    </Link>
  );
});

const SecondaryCTA = memo(function SecondaryCTA({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 border border-white/10 bg-white/2 px-6 py-4 text-sm font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white sm:px-8"
    >
      <span>{label}</span>
      <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
        {Icons.externalLink}
      </span>
    </Link>
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

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ════════════════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ════════════════════════════════════════════════════════════════════

const Hero: React.FC<HeroProps> = ({ config = defaultConfig }) => {
  // ─────────────────────────────────────────────────────────────────
  // STATE & HOOKS
  // ─────────────────────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // ─────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────
  // MEMOIZED VALUES
  // ─────────────────────────────────────────────────────────────────
  const services = useMemo(() => config.services, [config.services]);
  const totalServices = services.length;
  const activeService = services[activeIndex];

  // Grid columns for desktop - ENHANCED: More fr for active
  const gridColumns = useMemo(() => {
    return services
      .map((_, i) => (i === activeIndex ? "5fr" : "1fr"))
      .join(" ");
  }, [activeIndex, services]);

  // ─────────────────────────────────────────────────────────────────
  // INITIAL ANIMATION
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3,
      });

      // Headline
      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 },
      );

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6",
      );

      // CTAs
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5",
      );

      // Cards
      tl.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // KEYBOARD NAVIGATION
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalServices);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalServices) % totalServices);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalServices]);

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative  flex min-h-screen flex-col overflow-hidden bg-[#08090C]"
      aria-labelledby="hero-headline"
    >
      {/* Background */}
      <GridBackground />
      <AmbientGlow
        color={activeService?.accentColor || "#F59E0B"}
        position="right"
      />
      <AmbientGlow
        color={activeService?.accentColor || "#F59E0B"}
        position="left"
      />

      {/* Main Content Container */}
      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 z-10 flex flex-1 flex-col items-center justify-center   py-20 ">
        {/* ─────────────────────────────────────────────────────
              TEXT CONTENT
          ───────────────────────────────────────────────────── */}
        <div className="mb-14 text-center lg:mb-20">
          {/* Headline */}
          {/* <h1
              ref={headlineRef}
              id="hero-headline"
              className="mx-auto max-w-4xl text-3xl font-bold   tracking-tight text-white sm:text-4xl md:text-4xl  "
              style={{ opacity: 0 }}
            >
              {config.headline}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${services[0].accentColor}, ${services[1].accentColor}, ${services[2].accentColor})`,
                }}
              >
                {config.highlightedText}
              </span>
            </h1> */}

          {/* Subheadline */}
          {/* <p
              ref={subheadlineRef}
              className="mx-auto mb-2 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg   md:text-base"
              style={{ opacity: 0 }}
            >
              {config.subheadline}
            </p> */}
          {/* ─────────────────────────────────────────────────────
              SERVICE CARDS - ENHANCED HEIGHT
          ───────────────────────────────────────────────────── */}
          <div
            ref={cardsRef}
            className={`w-full -mb-12 ${isMobile ? "flex flex-col gap-3" : "grid gap-3"}`}
            style={{
              opacity: 0,
              gridTemplateColumns: isMobile ? undefined : gridColumns,
              height: isMobile ? "auto" : "clamp(480px, 75vh, 570px)", // ← هم‌ارتفاع با کارت‌ها
              transition:
                "grid-template-columns 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                isActive={index === activeIndex}
                onActivate={() => setActiveIndex(index)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
        {/* CTAs */}
        <div className="mt-10 md:mt-20 xl:mt-64 w-full max-w-4xl text-center">
          {/* Headline */}
          <h1
            ref={headlineRef}
            id="hero-headline"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
            style={{ opacity: 0 }}
          >
            {config.headline}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #F59E0B, #06B6D4, #8B5CF6)`,
              }}
            >
              {config.highlightedText}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="mt-5 md:mt-6 mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-white/70 leading-relaxed"
            style={{ opacity: 0 }}
          >
            {config.subheadline}
          </p>

          {/* CTA ها */}
          <div
            ref={ctaRef}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6"
            style={{ opacity: 0 }}
          >
            <PrimaryCTA
              label={config.primaryCTA.label}
              href={config.primaryCTA.href}
              accentColor={activeService?.accentColor || "#F59E0B"}
            />
            <SecondaryCTA
              label={config.secondaryCTA.label}
              href={config.secondaryCTA.href}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════

export default memo(Hero);
export type { HeroConfig, HeroProps, ServiceCard };
