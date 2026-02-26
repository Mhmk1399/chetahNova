"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#8B5CF6",
  dark: "#030712",
  darkLighter: "#0a0f1a",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  countryCode: string;
  review: string;
  rating: number;
  service: string;
}

interface TestimonialsSectionProps {
  headline?: string;
  description?: string;
  testimonials?: Testimonial[];
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
  verified: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO",
    company: "TechFlow",
    countryCode: "US",

    review:
      "Our website went from a simple brochure site to a full lead generation system. The SEO results were incredible. Best investment we've made.",
    rating: 5,
    service: "Web Design",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "Luxe Realty",
    countryCode: "ES",

    review:
      "The team delivered a stunning website that perfectly captures our luxury brand. Lead generation increased by 250% in the first quarter.",
    rating: 5,
    service: "Development",
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Marketing Director",
    company: "GreenLife",
    countryCode: "GB",

    review:
      "From day one, they understood our vision. The SEO strategy put us on page one for our main keywords within 3 months.",
    rating: 5,
    service: "SEO",
  },
  {
    id: "4",
    name: "David Kim",
    role: "CTO",
    company: "DataSync Pro",
    countryCode: "KR",

    review:
      "The AI automation tools they built have transformed our customer service. We now handle 3x more inquiries with the same team.",
    rating: 5,
    service: "AI Automation",
  },
  {
    id: "5",
    name: "Anna Müller",
    role: "Owner",
    company: "Craft Studio",
    countryCode: "DE",

    review:
      "Beautiful design, fast performance, and excellent SEO. Our online store revenue doubled within 6 months of launching.",
    rating: 5,
    service: "E-commerce",
  },
  {
    id: "6",
    name: "James O'Connor",
    role: "Partner",
    company: "Capital Ventures",
    countryCode: "IE",

    review:
      "Professional, responsive, and results-driven. They don't just build websites – they build growth systems.",
    rating: 5,
    service: "Web Design",
  },
];

// Flag emoji helper
const getFlagEmoji = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// ════════════════════════════════════════════════════════════════════
// STAR RATING
// ════════════════════════════════════════════════════════════════════

const StarRating = memo(function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="h-3.5 w-3.5"
          style={{
            color: i < rating ? colors.primary : "rgba(255,255,255,0.15)",
          }}
        >
          {Icons.star}
        </span>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TESTIMONIAL CARD
// ════════════════════════════════════════════════════════════════════

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const accentColors = [colors.primary, colors.secondary, colors.accent];
  const color = accentColors[index % 3];

  return (
    <div
      className="group relative flex-shrink-0"
      style={{ width: "380px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-full border bg-gray-900/80 p-6 backdrop-blur-sm transition-all duration-300"
        style={{
          borderColor: hovered ? `${color}50` : "rgba(255,255,255,0.08)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 20px 40px -20px ${color}30` : "none",
        }}
      >
        {/* Quote Icon */}
        <div
          className="absolute right-4 top-4 h-6 w-6 transition-all duration-300"
          style={{ color: hovered ? `${color}40` : "rgba(255,255,255,0.05)" }}
        >
          {Icons.quote}
        </div>

        {/* Rating & Service */}
        <div className="mb-4 flex items-center justify-between">
          <StarRating rating={testimonial.rating} />
          <span
            className="border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-all duration-300"
            style={{
              borderColor: hovered ? `${color}40` : "rgba(255,255,255,0.1)",
              color: hovered ? color : "rgba(255,255,255,0.4)",
            }}
          >
            {testimonial.service}
          </span>
        </div>

        {/* Review */}
        <p
          className="mb-5 text-sm leading-relaxed transition-colors duration-300"
          style={{
            color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
          }}
        >
          "{testimonial.review}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white">
                {testimonial.name}
              </span>
              <span className="h-3.5 w-3.5" style={{ color: colors.secondary }}>
                {Icons.verified}
              </span>
            </div>
            <div className="text-xs text-white/40">
              {testimonial.role} at{" "}
              <span
                style={{ color: hovered ? color : "rgba(255,255,255,0.6)" }}
              >
                {testimonial.company}
              </span>
            </div>
          </div>

          <span className="text-lg">
            {getFlagEmoji(testimonial.countryCode)}
          </span>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
          style={{
            width: hovered ? "100%" : "0%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MARQUEE ROW
// ════════════════════════════════════════════════════════════════════

const MarqueeRow = memo(function MarqueeRow({
  testimonials,
  direction = "left",
  speed = 30,
}: {
  testimonials: Testimonial[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Triple the items for seamless loop
  const items = [...testimonials, ...testimonials, ...testimonials];
  const totalWidth = testimonials.length * (380 + 24); // card width + gap

  return (
    <div className="marquee-wrapper relative overflow-hidden py-4">
      {/* Gradient masks */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 sm:w-32"
        style={{
          background: `linear-gradient(90deg, ${colors.dark}, transparent)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 sm:w-32"
        style={{
          background: `linear-gradient(270deg, ${colors.dark}, transparent)`,
        }}
      />

      {/* Scrolling track */}
      <div
        className="marquee-track flex gap-6"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: scroll ${speed}s linear infinite;
          width: max-content;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth}px);
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STATS BAR
// ════════════════════════════════════════════════════════════════════

const StatsBar = memo(function StatsBar() {
  const stats = [
    { value: "5.0", label: "Avg Rating" },
    { value: "150+", label: "Reviews" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-8">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="h-5 w-5" style={{ color: colors.primary }}>
            {Icons.star}
          </span>
          <span className="text-2xl font-bold text-white">{stat.value}</span>
          <span className="text-sm text-white/40">{stat.label}</span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════

const SectionHeader = memo(function SectionHeader({
  headline,
  description,
}: {
  headline: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current.querySelectorAll(".animate"),
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      },
    );
  }, []);

  return (
    <div ref={ref} className="mx-auto mb-12 max-w-3xl text-center">
      {/* Headline */}
      <h2 className="animate mb-5 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
        {headline.split("Say").map((part, i) =>
          i === 0 ? (
            <span key={i}>
              {part}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                Say
              </span>
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </h2>

      {/* Description */}
      <p className="animate text-base text-white/50 sm:text-lg">
        {description}
      </p>

      {/* Divider */}
      <div className="animate mt-8 flex items-center justify-center gap-4">
        <div
          className="h-px w-16"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}40)`,
          }}
        />
        <div
          className="h-2 w-2 rotate-45"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="h-px w-16"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}40, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TRUST BADGES
// ════════════════════════════════════════════════════════════════════

const TrustBadges = memo(function TrustBadges() {
  const badges = [
    { platform: "Google", rating: "5.0" },
    { platform: "Clutch", rating: "4.9" },
    { platform: "Trustpilot", rating: "5.0" },
  ];

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
      <span className="text-xs text-white/30">Rated on:</span>
      {badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2"
        >
          <span className="h-4 w-4" style={{ color: colors.primary }}>
            {Icons.star}
          </span>
          <span className="text-sm font-semibold text-white">
            {badge.rating}
          </span>
          <span className="text-xs text-white/40">{badge.platform}</span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  headline = "What Clients Say About Us",
  description = "Real feedback from real clients. We let our work speak for itself.",
  testimonials = defaultTestimonials,
}) => {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-16 lg:py-16"
      style={{ backgroundColor: colors.dark }}
    >
      {/* Simple Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(${colors.primary}08 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute right-0 top-1/2 h-96 w-96 translate-x-1/2 -translate-y-1/2"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mx-auto max-w-[95%] px-4 xl:max-w-7xl">
          <SectionHeader headline={headline} description={description} />
          <StatsBar />
        </div>

        {/* Marquee */}
        <div className="mb-4">
          <div className="mx-auto mb-3 flex max-w-[95%] items-center gap-3 px-4 xl:max-w-7xl">
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Client Reviews
            </span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/20">Hover to pause</span>
          </div>

          <MarqueeRow testimonials={testimonials} direction="left" speed={40} />
        </div>

        {/* Trust Badges */}
        <div className="mx-auto max-w-[95%] px-4 xl:max-w-7xl">
          <TrustBadges />
        </div>
      </div>
    </section>
  );
};

export default memo(TestimonialsSection);
export type { TestimonialsSectionProps, Testimonial };
