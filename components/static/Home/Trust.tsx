"use client";

import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

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

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: "primary" | "secondary" | "accent";
}

interface ClientLogo {
  id: string;
  name: string;
  logo: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

interface TrustBadge {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: "primary" | "secondary" | "accent";
}

interface TrustBarProps {
  stats?: StatItem[];
  clients?: ClientLogo[];
  testimonial?: Testimonial;
  badges?: TrustBadge[];
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
    <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.15">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  award: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  verified: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l2.4 2.4h3.4v3.4L20 10l-2.2 2.2v3.4h-3.4L12 18l-2.4-2.4H6.2v-3.4L4 10l2.2-2.2V4.4h3.4L12 2z" />
      <path d="m9 10 2 2 4-4" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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
  heart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  zap: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultStats: StatItem[] = [
  {
    id: "projects",
    value: 150,
    suffix: "+",
    label: "Projects Delivered",
    description: "Successful launches worldwide",
    color: "primary",
  },
  {
    id: "clients",
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description: "Based on post-project surveys",
    color: "secondary",
  },
  {
    id: "experience",
    value: 8,
    suffix: "+",
    label: "Years Experience",
    description: "In digital excellence",
    color: "accent",
  },
  {
    id: "uptime",
    value: 99.9,
    suffix: "%",
    label: "Uptime Guarantee",
    description: "Enterprise-grade reliability",
    color: "primary",
  },
];

const defaultClients: ClientLogo[] = [
  { id: "client1", name: "TechCorp", logo: "/logos/client1.svg" },
  { id: "client2", name: "StartupX", logo: "/logos/client2.svg" },
  { id: "client3", name: "FinanceHub", logo: "/logos/client3.svg" },
  { id: "client4", name: "MediaPro", logo: "/logos/client4.svg" },
  { id: "client5", name: "CloudNet", logo: "/logos/client5.svg" },
  { id: "client6", name: "DataFlow", logo: "/logos/client6.svg" },
];

const defaultTestimonial: Testimonial = {
  id: "testimonial1",
  quote:
    "Working with this team transformed our digital presence completely. Our conversions increased by 340% within the first quarter. The attention to detail and strategic thinking exceeded all expectations.",
  author: "Sarah Chen",
  role: "CEO",
  company: "TechCorp Solutions",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  rating: 5,
};

const defaultBadges: TrustBadge[] = [
  {
    id: "secure",
    icon: Icons.shield,
    label: "SSL Secured",
    color: "secondary",
  },
  { id: "award", icon: Icons.award, label: "Award Winning", color: "primary" },
  {
    id: "verified",
    icon: Icons.verified,
    label: "Verified Partner",
    color: "accent",
  },
  {
    id: "support",
    icon: Icons.clock,
    label: "24/7 Support",
    color: "secondary",
  },
];

// ════════════════════════════════════════════════════════════════════
// UTILITY: Get color value
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent") =>
  colors[colorKey];

// ════════════════════════════════════════════════════════════════════
// ANIMATED NUMBER COUNTER
// ════════════════════════════════════════════════════════════════════

const AnimatedCounter = memo(function AnimatedCounter({
  value,
  suffix,
  isVisible,
  duration = 2000,
  color,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
  duration?: number;
  color: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const start = Date.now();
    const isDecimal = value % 1 !== 0;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * value;

      setDisplayValue(
        isDecimal ? Number(current.toFixed(1)) : Math.floor(current),
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isVisible, duration]);

  return (
    <span ref={countRef} className="tabular-nums" style={{ color }}>
      {displayValue}
      <span className="text-[0.6em] opacity-70">{suffix}</span>
    </span>
  );
});

// ════════════════════════════════════════════════════════════════════
// BACKGROUND EFFECTS
// ════════════════════════════════════════════════════════════════════

const Background = memo(function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkLighter} 50%, ${colors.dark} 100%)`,
        }}
      />

      {/* Grid Pattern */}
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

      {/* Primary Glow */}
      <div
        className="absolute -left-40 top-1/4 h-125 w-125"
        style={{
          background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Secondary Glow */}
      <div
        className="absolute -right-40 top-1/2 h-100 w-100"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Accent Glow */}
      <div
        className="absolute bottom-0 left-1/2 h-[300px] w-150 -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse, ${colors.accent}06 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STAT CARD (Bento Style)
// ════════════════════════════════════════════════════════════════════

const StatCard = memo(function StatCard({
  stat,
  index,
  isVisible,
  isLarge = false,
}: {
  stat: StatItem;
  index: number;
  isVisible: boolean;
  isLarge?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const color = getColor(stat.color);

  useEffect(() => {
    if (!cardRef.current || !isVisible) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: index * 0.1,
        ease: "power3.out",
      },
    );
  }, [isVisible, index]);

  return (
    <div
      ref={cardRef}
      className={`stat-card group relative overflow-hidden border transition-all duration-500 ${
        isLarge ? "col-span-2 row-span-2" : ""
      }`}
      style={{
        opacity: 0,
        borderColor: isHovered ? `${color}30` : "rgba(255,255,255,0.06)",
        background: isHovered
          ? `linear-gradient(135deg, ${color}08, transparent 60%)`
          : "rgba(255,255,255,0.02)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content */}
      <div
        className={`relative z-10 flex h-full flex-col justify-between ${isLarge ? "p-8" : "p-6"}`}
      >
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Index */}
          <span
            className="font-mono text-[10px] uppercase tracking-widest transition-colors duration-300"
            style={{ color: isHovered ? color : "rgba(255,255,255,0.2)" }}
          >
            0{index + 1}
          </span>

          {/* Status Dot */}
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: color,
                boxShadow: isHovered ? `0 0 12px ${color}` : "none",
              }}
            />
          </div>
        </div>

        {/* Value */}
        <div className="my-auto">
          <div
            className={`font-bold leading-none ${isLarge ? "text-6xl md:text-7xl" : "text-4xl md:text-5xl"}`}
          >
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              isVisible={isVisible}
              color={color}
            />
          </div>
        </div>

        {/* Label & Description */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-white md:text-base">
            {stat.label}
          </h3>
          <p className="text-xs text-white/40 md:text-sm">{stat.description}</p>
        </div>
      </div>

      {/* Hover Effects */}
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${color}20, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1.5)" : "scale(1)",
        }}
      />

      {/* Bottom Line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
        style={{
          width: isHovered ? "100%" : "0%",
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />

      {/* Corner Accent */}
      <div
        className="absolute right-0 top-0 h-12 w-12 transition-opacity duration-300"
        style={{
          background: `linear-gradient(225deg, ${color}10, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TESTIMONIAL CARD
// ════════════════════════════════════════════════════════════════════

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  isVisible,
}: {
  testimonial: Testimonial;
  isVisible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current || !isVisible) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      },
    );
  }, [isVisible]);

  return (
    <div
      ref={cardRef}
      className="testimonial-card group relative overflow-hidden border transition-all duration-500"
      style={{
        opacity: 0,
        borderColor: isHovered
          ? `${colors.primary}25`
          : "rgba(255,255,255,0.06)",
        background: `linear-gradient(135deg, rgba(255,255,255,0.03), transparent)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quote Icon Background */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 transition-transform duration-500 group-hover:scale-110"
        style={{ color: colors.primary }}
      >
        {Icons.quote}
      </div>

      <div className="relative z-10 p-8 md:p-10">
        {/* Stars */}
        <div className="mb-6 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="h-4 w-4 transition-all duration-300"
              style={{
                color:
                  i < testimonial.rating
                    ? colors.primary
                    : "rgba(255,255,255,0.1)",
                transform: isHovered ? `scale(${1 + i * 0.05})` : "scale(1)",
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {Icons.star}
            </span>
          ))}
          <span
            className="ml-2 text-sm font-medium"
            style={{ color: colors.primary }}
          >
            {testimonial.rating}.0
          </span>
        </div>

        {/* Quote */}
        <blockquote className="mb-8 text-lg font-medium leading-relaxed text-white/80 md:text-xl lg:text-2xl">
          "{testimonial.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: isHovered ? colors.primary : "rgba(255,255,255,0.1)",
            }}
          >
            <Image
              src={testimonial.avatar}
              alt={testimonial.author}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div>
            <div className="font-semibold text-white">{testimonial.author}</div>
            <div className="text-sm text-white/50">
              {testimonial.role},{" "}
              <span style={{ color: colors.secondary }}>
                {testimonial.company}
              </span>
            </div>
          </div>

          {/* Play Video Button (Optional) */}
          <button
            className="ml-auto flex h-12 w-12 items-center justify-center border transition-all duration-300"
            style={{
              borderColor: isHovered
                ? `${colors.primary}40`
                : "rgba(255,255,255,0.1)",
              background: isHovered ? `${colors.primary}10` : "transparent",
            }}
            aria-label="Watch video testimonial"
          >
            <span
              className="h-4 w-4 transition-colors duration-300"
              style={{
                color: isHovered ? colors.primary : "rgba(255,255,255,0.4)",
              }}
            >
              {Icons.play}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className="absolute bottom-0 left-0 h-1 transition-all duration-500"
        style={{
          width: isHovered ? "100%" : "30%",
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CLIENT LOGOS MARQUEE
// ════════════════════════════════════════════════════════════════════

const ClientLogos = memo(function ClientLogos({
  clients,
  isVisible,
}: {
  clients: ClientLogo[];
  isVisible: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || !isVisible) return;

    const ctx = gsap.context(() => {
      gsap.to(".logo-track", {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });
    }, trackRef);

    return () => ctx.revert();
  }, [isVisible]);

  // Create placeholder logos since we don't have real images
  const LogoPlaceholder = ({
    name,
    index,
  }: {
    name: string;
    index: number;
  }) => {
    const logoColors = [colors.primary, colors.secondary, colors.accent];
    const color = logoColors[index % logoColors.length];

    return (
      <div
        className="flex h-12 items-center justify-center px-6 transition-all duration-300 hover:opacity-100"
        style={{ opacity: 0.4 }}
      >
        <div
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
          style={{ color }}
        >
          <div
            className="h-8 w-8 rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
              border: `1px solid ${color}30`,
            }}
          />
          <span className="hidden sm:inline">{name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden py-8">
      {/* Label */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
          Trusted by Industry Leaders
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
      </div>

      {/* Marquee */}
      <div ref={trackRef} className="relative">
        <div className="logo-track flex">
          {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
            <LogoPlaceholder
              key={`${client.id}-${i}`}
              name={client.name}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Fade Edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-32"
        style={{
          background: `linear-gradient(90deg, ${colors.dark}, transparent)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-32"
        style={{
          background: `linear-gradient(270deg, ${colors.dark}, transparent)`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TRUST BADGES
// ════════════════════════════════════════════════════════════════════

const TrustBadges = memo(function TrustBadges({
  badges,
  isVisible,
}: {
  badges: TrustBadge[];
  isVisible: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
      {badges.map((badge, index) => {
        const color = getColor(badge.color);

        return (
          <div
            key={badge.id}
            className="badge-item group flex items-center gap-2 border px-4 py-2.5 transition-all duration-300 hover:border-opacity-40"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.1}s`,
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${color}40`;
              e.currentTarget.style.background = `${color}08`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            <span
              className="h-5 w-5 transition-colors duration-300"
              style={{ color }}
            >
              {badge.icon}
            </span>
            <span className="text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// RATING DISPLAY
// ════════════════════════════════════════════════════════════════════

const RatingDisplay = memo(function RatingDisplay({
  isVisible,
}: {
  isVisible: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Rating Box */}
      <div
        className="flex items-center gap-4 border px-6 py-4"
        style={{
          borderColor: `${colors.primary}30`,
          background: `linear-gradient(135deg, ${colors.primary}10, transparent)`,
        }}
      >
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="h-5 w-5"
              style={{
                color: colors.primary,
                animation: isVisible
                  ? `starPop 0.4s ease-out ${i * 0.1}s both`
                  : "none",
              }}
            >
              {Icons.star}
            </span>
          ))}
        </div>

        {/* Score */}
        <div className="flex items-baseline gap-1">
          <span
            className="text-3xl font-bold"
            style={{ color: colors.primary }}
          >
            5.0
          </span>
          <span className="text-sm text-white/40">/ 5</span>
        </div>
      </div>

      {/* Review Count */}
      <div className="text-center sm:text-left">
        <div className="text-lg font-semibold text-white">127+ Reviews</div>
        <div className="text-sm text-white/40">from verified clients</div>
      </div>

      {/* Platforms */}
      <div className="hidden items-center gap-3 border-l border-white/10 pl-8 lg:flex">
        {["Google", "Clutch", "Trustpilot"].map((platform, i) => (
          <span
            key={platform}
            className="text-xs font-medium uppercase tracking-wider text-white/30"
          >
            {platform}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes starPop {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA SECTION
// ════════════════════════════════════════════════════════════════════

const CTASection = memo(function CTASection({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
      }}
    >
      {/* Primary CTA */}
      <Link
        href="/contact"
        className="group relative overflow-hidden px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300"
        style={{ backgroundColor: colors.primary }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative z-10 flex items-center gap-2">
          Start Your Project
          <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
            {Icons.arrowRight}
          </span>
        </span>

        {/* Shine Effect */}
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Link>

      {/* Secondary CTA */}
      <Link
        href="/work"
        className="group flex items-center gap-2 border px-6 py-4 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/20 hover:text-white"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span>View Case Studies</span>
        <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
          {Icons.arrowRight}
        </span>
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN TRUST BAR COMPONENT
// ════════════════════════════════════════════════════════════════════

const TrustBar: React.FC<TrustBarProps> = ({
  stats = defaultStats,
  clients = defaultClients,
  testimonial = defaultTestimonial,
  badges = defaultBadges,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-32"
      style={{ backgroundColor: colors.dark }}
      aria-label="Trust indicators and social proof"
    >
      <Background />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className="mb-16 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.primary})`,
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: colors.primary }}
            >
              Why Choose Us
            </span>
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
              }}
            />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Trusted by{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Industry Leaders
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            Join hundreds of successful businesses that have transformed their
            digital presence with our expertise.
          </p>
        </div>

        {/* Rating Display */}
        <div className="mb-16 flex justify-center">
          <RatingDisplay isVisible={isVisible} />
        </div>

        {/* Stats Grid (Bento) */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              isVisible={isVisible}
              isLarge={index === 0}
            />
          ))}
        </div>

        {/* Testimonial */}
        <div className="mb-16">
          <TestimonialCard testimonial={testimonial} isVisible={isVisible} />
        </div>

        {/* Trust Badges */}
        <div className="mb-16">
          <TrustBadges badges={badges} isVisible={isVisible} />
        </div>

        {/* Client Logos */}
        <ClientLogos clients={clients} isVisible={isVisible} />

        {/* CTA Section */}
        <div className="mt-16">
          <CTASection isVisible={isVisible} />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-8 top-8 hidden lg:block">
        <div
          className="h-24 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}40, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-24"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}40, transparent)`,
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">
        <div
          className="h-24 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.accent}30, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-24"
          style={{
            background: `linear-gradient(270deg, ${colors.accent}30, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(TrustBar);
export type { TrustBarProps, StatItem, ClientLogo, Testimonial, TrustBadge };
