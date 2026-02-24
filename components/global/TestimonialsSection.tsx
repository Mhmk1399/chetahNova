"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// BRAND COLORS
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  dark: "#0B0F19",
  darkLighter: "#0F1420",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  country: string;
  countryCode: string;
  avatar: string;
  review: string;
  rating: number;
  services: string[];
  featured?: boolean;
}

interface TestimonialsSectionProps {
  headline?: string;
  subheadline?: string;
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
  starEmpty: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  verified: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.4 2.4h3.4v3.4L20 10l-2.2 2.2v3.4h-3.4L12 18l-2.4-2.4H6.2v-3.4L4 10l2.2-2.2V4.4h3.4L12 2z" />
      <path d="m9 10 2 2 4-4" />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
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
    company: "TechFlow Solutions",
    country: "United States",
    countryCode: "US",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    review:
      "Our website went from a simple brochure site to a full lead generation system. The SEO results were incredible, and the AI automation saved us hours every week. Best investment we've made for our business.",
    rating: 5,
    services: ["Web Design", "SEO", "AI Automation"],
    featured: true,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "Luxe Realty Group",
    country: "Spain",
    countryCode: "ES",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    review:
      "The team delivered a stunning website that perfectly captures our luxury brand. Our lead generation increased by 250% in the first quarter. They truly understand conversion-driven design.",
    rating: 5,
    services: ["Web Design", "Development"],
    featured: true,
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Marketing Director",
    company: "GreenLife Wellness",
    country: "United Kingdom",
    countryCode: "GB",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    review:
      "From day one, they understood our vision. The SEO strategy put us on page one for our main keywords within 3 months. The ongoing support has been exceptional.",
    rating: 5,
    services: ["SEO", "Content Strategy"],
  },
  {
    id: "4",
    name: "David Kim",
    role: "CTO",
    company: "DataSync Pro",
    country: "South Korea",
    countryCode: "KR",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    review:
      "The AI automation tools they built have transformed our customer service. We now handle 3x more inquiries with the same team. Incredible ROI and professional execution.",
    rating: 5,
    services: ["AI Automation", "Development"],
  },
  {
    id: "5",
    name: "Anna Müller",
    role: "Owner",
    company: "Craft & Co Studio",
    country: "Germany",
    countryCode: "DE",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    review:
      "Beautiful design, fast performance, and excellent SEO. Our online store revenue doubled within 6 months of launching the new website. Highly recommend!",
    rating: 5,
    services: ["Web Design", "E-commerce", "SEO"],
  },
  {
    id: "6",
    name: "James O'Connor",
    role: "Managing Partner",
    company: "Capital Ventures",
    country: "Ireland",
    countryCode: "IE",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    review:
      "Professional, responsive, and results-driven. They don't just build websites – they build growth systems. Our client acquisition cost dropped by 40%.",
    rating: 5,
    services: ["Web Design", "SEO", "AI Automation"],
  },
];

// ════════════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent") =>
  colors[colorKey];

// Get flag emoji from country code
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// ════════════════════════════════════════════════════════════════════
// BACKGROUND
// ════════════════════════════════════════════════════════════════════

const Background = memo(function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkLighter} 50%, ${colors.dark} 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative quote marks */}
      <div
        className="absolute left-10 top-1/4 h-40 w-40 opacity-2"
        style={{ color: "white" }}
      >
        {Icons.quote}
      </div>
      <div
        className="absolute bottom-1/4 right-10 h-40 w-40 rotate-180 opacity-2"
        style={{ color: "white" }}
      >
        {Icons.quote}
      </div>

      <div
        className="absolute left-0 top-1/3 h-125 w-125 -translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.primary}06 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-0 h-125 w-125 translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}05 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STAR RATING
// ════════════════════════════════════════════════════════════════════

const StarRating = memo(function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`${sizeClasses[size]} transition-colors duration-300`}
          style={{
            color: i < rating ? colors.primary : "rgba(255,255,255,0.15)",
          }}
        >
          {i < rating ? Icons.star : Icons.starEmpty}
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
  isActive = false,
  variant = "default",
}: {
  testimonial: Testimonial;
  index: number;
  isActive?: boolean;
  variant?: "default" | "featured";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const colorIndex = index % 3;
  const accentColors: ("primary" | "secondary" | "accent")[] = [
    "primary",
    "secondary",
    "accent",
  ];
  const color = getColor(accentColors[colorIndex]);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const isFeatured = variant === "featured" || testimonial.featured;

  return (
    <div
      ref={cardRef}
      className={`group relative ${isFeatured ? "md:col-span-2" : ""}`}
      style={{ opacity: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative h-full overflow-hidden border p-6 transition-all duration-500 md:p-8"
        style={{
          borderColor: isHovered ? `${color}40` : "rgba(255,255,255,0.06)",
          background: isHovered
            ? `linear-gradient(135deg, ${color}08, transparent 60%)`
            : "rgba(255,255,255,0.02)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered ? `0 20px 40px -20px ${color}25` : "none",
        }}
      >
        {/* Quote Icon */}
        <div
          className="absolute right-4 top-4 h-8 w-8 transition-all duration-300 md:right-6 md:top-6 md:h-10 md:w-10"
          style={{
            color: isHovered ? color : "rgba(255,255,255,0.05)",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          {Icons.quote}
        </div>

        {/* Rating */}
        <div className="mb-4">
          <StarRating
            rating={testimonial.rating}
            size={isFeatured ? "md" : "sm"}
          />
        </div>

        {/* Review Text */}
        <blockquote
          className={`mb-6 leading-relaxed transition-colors duration-300 ${
            isFeatured ? "text-base md:text-lg" : "text-sm md:text-base"
          }`}
          style={{
            color: isHovered
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.7)",
          }}
        >
          "{testimonial.review}"
        </blockquote>

        {/* Services Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {testimonial.services.map((service, i) => (
            <span
              key={i}
              className="border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-all duration-300"
              style={{
                borderColor: isHovered
                  ? `${color}30`
                  : "rgba(255,255,255,0.08)",
                backgroundColor: isHovered ? `${color}10` : "transparent",
                color: isHovered ? color : "rgba(255,255,255,0.4)",
              }}
            >
              {service}
            </span>
          ))}
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: isHovered ? color : "rgba(255,255,255,0.1)",
            }}
          >
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {testimonial.name}
              </span>
              <span className="h-4 w-4" style={{ color: colors.secondary }}>
                {Icons.verified}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span>{testimonial.role}</span>
              <span className="text-white/20">•</span>
              <span style={{ color }}>{testimonial.company}</span>
            </div>
          </div>

          {/* Country Flag */}
          <div
            className="flex items-center gap-1.5 border px-2 py-1 text-xs transition-all duration-300"
            style={{
              borderColor: isHovered ? `${color}20` : "rgba(255,255,255,0.06)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            <span className="text-base">
              {getFlagEmoji(testimonial.countryCode)}
            </span>
            <span className="hidden text-white/40 sm:inline">
              {testimonial.country}
            </span>
          </div>
        </div>

        {/* Bottom Accent */}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-500"
          style={{
            width: isHovered ? "100%" : "0%",
            backgroundColor: color,
          }}
        />

        {/* Corner Glow */}
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// OVERALL RATING
// ════════════════════════════════════════════════════════════════════

const OverallRating = memo(function OverallRating({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const avgRating =
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;

  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-12">
      {/* Rating Box */}
      <div
        className="flex items-center gap-4 border px-6 py-4"
        style={{
          borderColor: `${colors.primary}30`,
          background: `linear-gradient(135deg, ${colors.primary}10, transparent)`,
        }}
      >
        <div className="text-center">
          <div
            className="text-4xl font-bold md:text-5xl"
            style={{ color: colors.primary }}
          >
            {avgRating.toFixed(1)}
          </div>
          <div className="text-xs text-white/40">out of 5</div>
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div>
          <StarRating rating={Math.round(avgRating)} size="lg" />
          <div className="mt-1 text-sm text-white/50">
            {totalReviews}+ verified reviews
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center gap-4">
        {[
          { label: "Google", rating: "5.0" },
          { label: "Clutch", rating: "4.9" },
          { label: "Trustpilot", rating: "5.0" },
        ].map((platform, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border px-3 py-2 transition-colors duration-300"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            <span className="h-4 w-4" style={{ color: colors.primary }}>
              {Icons.star}
            </span>
            <span className="text-sm font-medium text-white">
              {platform.rating}
            </span>
            <span className="text-xs text-white/40">{platform.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CAROUSEL CONTROLS
// ════════════════════════════════════════════════════════════════════

const CarouselControls = memo(function CarouselControls({
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
  onDotClick,
}: {
  currentIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-6">
      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="flex h-10 w-10 items-center justify-center border transition-all duration-300"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${colors.primary}50`;
          e.currentTarget.style.backgroundColor = `${colors.primary}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
        }}
        aria-label="Previous testimonial"
      >
        <span className="h-4 w-4 text-white/60">{Icons.arrowLeft}</span>
      </button>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {[...Array(totalSlides)].map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className="relative h-2 transition-all duration-300"
            style={{
              width: currentIndex === i ? "24px" : "8px",
              backgroundColor:
                currentIndex === i ? colors.primary : "rgba(255,255,255,0.2)",
              borderRadius: "1px",
            }}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center border transition-all duration-300"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${colors.primary}50`;
          e.currentTarget.style.backgroundColor = `${colors.primary}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
        }}
        aria-label="Next testimonial"
      >
        <span className="h-4 w-4 text-white/60">{Icons.arrowRight}</span>
      </button>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TESTIMONIALS CAROUSEL (for mobile)
// ════════════════════════════════════════════════════════════════════

const TestimonialsCarousel = memo(function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="lg:hidden">
      <div ref={carouselRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="w-full shrink-0 px-2">
              <TestimonialCard
                testimonial={testimonial}
                index={0}
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>
      </div>

      <CarouselControls
        currentIndex={currentIndex}
        totalSlides={testimonials.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onDotClick={handleDotClick}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TESTIMONIALS GRID (for desktop)
// ════════════════════════════════════════════════════════════════════

const TestimonialsGrid = memo(function TestimonialsGrid({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // Separate featured and regular
  const featured = testimonials.filter((t) => t.featured);
  const regular = testimonials.filter((t) => !t.featured);

  return (
    <div className="hidden lg:block">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Featured testimonials span 2 columns */}
        {featured.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            variant="featured"
          />
        ))}

        {/* Regular testimonials */}
        {regular.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={featured.length + index}
          />
        ))}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  headline = "What Clients Say About Working With Us",
  subheadline = "Testimonials",
  description = "Our clients don't just get websites. They get growth systems.",
  testimonials = defaultTestimonials,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Header Animation
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerElement.querySelectorAll(".header-anim"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerElement,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: colors.dark }}
    >
      <Background />

      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Header */}
        <div
          ref={headerRef}
          className="mx-auto mb-12 max-w-3xl text-center lg:mb-16"
        >
          {/* Label */}
          <div className="header-anim mb-6 flex items-center justify-center gap-3">
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.secondary})`,
              }}
            />
            <span
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: colors.secondary }}
            >
              <span className="h-3 w-3">{Icons.sparkle}</span>
              {subheadline}
            </span>
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${colors.secondary}, transparent)`,
              }}
            />
          </div>

          {/* Headline */}
          <h2 className="header-anim mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            What Clients{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Say
            </span>{" "}
            About Working With Us
          </h2>

          {/* Description */}
          <p className="header-anim text-base leading-relaxed text-white/50 md:text-lg">
            {description}
          </p>
        </div>

        {/* Overall Rating */}
        <OverallRating testimonials={testimonials} />

        {/* Grid (Desktop) */}
        <TestimonialsGrid testimonials={testimonials} />

        {/* Carousel (Mobile/Tablet) */}
        <TestimonialsCarousel testimonials={testimonials} />
      </div>

      {/* Decorative Corners */}
      <div className="pointer-events-none absolute left-8 top-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.secondary}40, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-20"
          style={{
            background: `linear-gradient(90deg, ${colors.secondary}40, transparent)`,
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div
          className="h-20 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.primary}30, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-20"
          style={{
            background: `linear-gradient(270deg, ${colors.primary}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(TestimonialsSection);
export type { TestimonialsSectionProps, Testimonial };
