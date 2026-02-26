// app/components/Footer.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#8B5CF6",
  dark: "#0A0D14",
  darkSurface: "#0F1219",
  glass: {
    bg: "rgba(255, 255, 255, 0.02)",
    bgHover: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.06)",
    borderHover: "rgba(255, 255, 255, 0.12)",
  },
} as const;

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
  badgeColor?: "primary" | "secondary" | "accent";
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
  accentColor?: "primary" | "secondary" | "accent";
}

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterConfig {
  logo: {
    text: string;
    href: string;
    image?: string;
  };
  tagline: string;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  legal: FooterLink[];
  copyright: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

const Icons = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path
        d="M7 17L17 7M17 7H7M17 7v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  dribbble: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073a42.153 42.153 0 00-.767-1.68c2.316-1.037 4.348-2.432 6.027-4.146a10.037 10.037 0 011.843 5.899zm-2.962-7.149c-1.538 1.583-3.418 2.874-5.588 3.843a45.656 45.656 0 00-3.95-5.784A9.954 9.954 0 0112 1.945c2.172 0 4.19.693 5.923 1.847z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" />
      <path
        d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mapPin: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"
        strokeLinecap="round"
      />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline
        points="20 6 9 17 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      <path
        d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
        strokeLinecap="round"
      />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  hexagon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M2 12h4l3-9 4 18 3-9h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
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
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════════════

const defaultConfig: FooterConfig = {
  logo: {
    text: "NEXUS",
    href: "/",
    image: "/assets/images/logo.png",
  },
  tagline: "Crafting digital experiences that convert visitors into customers.",
  columns: [
    {
      title: "Services",
      accentColor: "primary",
      links: [
        { label: "Web Design", href: "/services/web-design" },
        {
          label: "Development",
          href: "/services/development",
          badge: "Popular",
          badgeColor: "primary",
        },
        { label: "SEO Systems", href: "/services/seo" },
        {
          label: "AI Automation",
          href: "/services/ai",
          badge: "New",
          badgeColor: "accent",
        },
      ],
    },
    {
      title: "Company",
      accentColor: "secondary",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Work", href: "/work" },
        {
          label: "Careers",
          href: "/careers",
          badge: "Hiring",
          badgeColor: "secondary",
        },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      accentColor: "accent",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Help Center", href: "/help" },
        { label: "Pricing", href: "/pricing" },
        { label: "Status", href: "/status", isExternal: true },
      ],
    },
  ],
  socialLinks: [
    {
      id: "twitter",
      label: "Twitter",
      href: "https://twitter.com",
      icon: Icons.twitter,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com",
      icon: Icons.instagram,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: Icons.linkedin,
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com",
      icon: Icons.github,
    },
  ],
  newsletter: {
    title: "Get updates",
    description: "Weekly insights on design & development.",
    placeholder: "your@email.com",
    buttonText: "Join",
  },
  contact: {
    email: "hello@nexus.studio",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
  },
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
  copyright: "© 2024 Nexus Studio. All rights reserved.",
};

// ════════════════════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent" = "primary") =>
  COLORS[colorKey];

// ════════════════════════════════════════════════════════════════════════════
// BACKGROUND COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const FooterBackground = memo(function FooterBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${COLORS.dark} 0%, ${COLORS.darkSurface} 50%, ${COLORS.dark} 100%)`,
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Neural dots pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="footer-neural"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="30" cy="30" r="1" fill={COLORS.primary} />
            <circle cx="0" cy="0" r="0.5" fill={COLORS.secondary} />
            <circle cx="60" cy="60" r="0.5" fill={COLORS.accent} />
            <line
              x1="30"
              y1="30"
              x2="0"
              y2="0"
              stroke={COLORS.primary}
              strokeWidth="0.2"
              opacity="0.5"
            />
            <line
              x1="30"
              y1="30"
              x2="60"
              y2="60"
              stroke={COLORS.accent}
              strokeWidth="0.2"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-neural)" />
      </svg>

      {/* Ambient orbs */}
      <div
        className="absolute -left-40 top-20 h-150 w-150 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}12 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -right-40 bottom-40 h-125 w-125 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary}10 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}08 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Top separator */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}50, ${COLORS.secondary}40, ${COLORS.accent}50, transparent)`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CTA SECTION - Compact & Impactful
// ════════════════════════════════════════════════════════════════════════════

const FooterCTA = memo(function FooterCTA() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!ctaRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, ctaRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={ctaRef}
      className="relative mb-16 overflow-hidden p-8 sm:p-10 lg:p-12"
      style={{
        background: `linear-gradient(135deg, ${COLORS.glass.bg}, rgba(245, 158, 11, 0.03), ${COLORS.glass.bg})`,
        border: `1px solid ${COLORS.glass.border}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${COLORS.primary}, ${COLORS.secondary}, transparent 90%)`,
        }}
      />

      {/* Corner accents */}
      <div
        className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l border-t"
        style={{ borderColor: `${COLORS.primary}40` }}
      />
      <div
        className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r border-t"
        style={{ borderColor: `${COLORS.secondary}40` }}
      />
      <div
        className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b border-l"
        style={{ borderColor: `${COLORS.accent}40` }}
      />
      <div
        className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b border-r"
        style={{ borderColor: `${COLORS.primary}40` }}
      />

      {/* Floating sparkles */}
      <div
        className="pointer-events-none absolute right-12 top-8 h-4 w-4 opacity-30"
        style={{ color: COLORS.primary }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="pointer-events-none absolute bottom-10 left-16 h-3 w-3 opacity-20"
        style={{ color: COLORS.accent }}
      >
        {Icons.sparkle}
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-lg">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={{ background: `${COLORS.primary}15` }}
          >
            <span className="h-3 w-3" style={{ color: COLORS.primary }}>
              {Icons.lightning}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: COLORS.primary }}
            >
              Start Your Project
            </span>
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Ready to{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              transform
            </span>{" "}
            your brand?
          </h2>
          <p className="text-sm text-white/50 sm:text-base">
            Let's build something extraordinary together.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="group relative overflow-hidden px-8 py-4 text-sm font-bold uppercase tracking-wider"
            style={{ background: COLORS.primary, color: "#000" }}
          >
            <span
              className="absolute inset-0 -translate-x-full skew-x-12 transition-transform duration-500 group-hover:translate-x-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
            <span className="relative flex items-center gap-2">
              Get Started
              <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                {Icons.arrow}
              </span>
            </span>
          </Link>
          <Link
            href="/work"
            className="group flex items-center justify-center gap-2 border px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
            style={{ borderColor: COLORS.glass.border }}
          >
            View Work
            <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              {Icons.arrowUpRight}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// SOCIAL LINK
// ════════════════════════════════════════════════════════════════════════════

const SocialLinkButton = memo(function SocialLinkButton({
  social,
  index,
}: {
  social: SocialLink;
  index: number;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const socialColors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.primary,
  ];
  const hoverColor = socialColors[index % socialColors.length];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(linkRef.current, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!linkRef.current) return;
    setIsHovered(false);
    gsap.to(linkRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <a
      ref={linkRef}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-11 w-11 items-center justify-center transition-all duration-300"
      style={{
        background: isHovered ? `${hoverColor}15` : COLORS.glass.bg,
        border: `1px solid ${isHovered ? `${hoverColor}50` : COLORS.glass.border}`,
        color: isHovered ? hoverColor : "rgba(255,255,255,0.4)",
      }}
      aria-label={social.label}
    >
      <span className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110">
        {social.icon}
      </span>
    </a>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// FOOTER LINK
// ════════════════════════════════════════════════════════════════════════════

const FooterLinkItem = memo(function FooterLinkItem({
  link,
  accentColor = "primary",
}: {
  link: FooterLink;
  accentColor?: "primary" | "secondary" | "accent";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const color = getColor(accentColor);
  const badgeColor = link.badgeColor ? getColor(link.badgeColor) : color;

  return (
    <li>
      <Link
        href={link.href}
        target={link.isExternal ? "_blank" : undefined}
        rel={link.isExternal ? "noopener noreferrer" : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center gap-2 py-1.5 text-[13px] transition-all duration-200"
        style={{
          color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        }}
      >
        <span
          className="h-px transition-all duration-300"
          style={{ width: isHovered ? "8px" : "0px", backgroundColor: color }}
        />
        <span>{link.label}</span>
        {link.badge && (
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
          >
            {link.badge}
          </span>
        )}
        {link.isExternal && (
          <span
            className="h-3 w-3 opacity-40 transition-all duration-200 group-hover:opacity-100"
            style={{ color }}
          >
            {Icons.arrowUpRight}
          </span>
        )}
      </Link>
    </li>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// FOOTER COLUMN
// ════════════════════════════════════════════════════════════════════════════

const FooterColumn = memo(function FooterColumn({
  column,
  index,
}: {
  column: FooterColumn;
  index: number;
}) {
  const accentColor = column.accentColor || "primary";
  const color = getColor(accentColor);

  return (
    <div className="footer-column">
      <div className="mb-4 flex items-center gap-2">
        <span
          className="flex h-5 w-5 items-center justify-center font-mono text-[9px] font-bold"
          style={{
            background: `${color}15`,
            color,
            border: `1px solid ${color}30`,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          {column.title}
        </h3>
      </div>
      <ul className="space-y-0">
        {column.links.map((link) => (
          <FooterLinkItem
            key={link.href}
            link={link}
            accentColor={accentColor}
          />
        ))}
      </ul>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// NEWSLETTER - Compact
// ════════════════════════════════════════════════════════════════════════════

const Newsletter = memo(function Newsletter({
  config,
}: {
  config: FooterConfig["newsletter"];
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || status === "loading") return;
      setStatus("loading");
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    },
    [email, status],
  );

  return (
    <div
      className="relative overflow-hidden p-5"
      style={{
        background: COLORS.glass.bg,
        border: `1px solid ${COLORS.glass.border}`,
      }}
    >
      {/* Top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
        }}
      />

      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: `${COLORS.accent}15` }}
        >
          <span className="h-3.5 w-3.5" style={{ color: COLORS.accent }}>
            {Icons.mail}
          </span>
        </span>
        <div>
          <h3 className="text-sm font-semibold text-white">{config.title}</h3>
        </div>
      </div>

      <p className="mb-4 text-xs text-white/40">{config.description}</p>

      <form onSubmit={handleSubmit}>
        <div
          className="flex overflow-hidden transition-all duration-300"
          style={{
            background:
              status === "success"
                ? `${COLORS.secondary}10`
                : isFocused
                  ? `${COLORS.accent}05`
                  : "rgba(255,255,255,0.02)",
            border: `1px solid ${status === "success" ? `${COLORS.secondary}50` : isFocused ? `${COLORS.accent}40` : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {status === "success" ? (
            <div
              className="flex flex-1 items-center gap-2 px-4 py-3"
              style={{ color: COLORS.secondary }}
            >
              <span className="h-4 w-4">{Icons.check}</span>
              <span className="text-sm">Subscribed!</span>
            </div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={config.placeholder}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40"
                style={{
                  color: COLORS.accent,
                  background: `${COLORS.accent}10`,
                }}
              >
                {status === "loading" ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                    style={{
                      borderColor: `${COLORS.accent}40`,
                      borderTopColor: COLORS.accent,
                    }}
                  />
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      {config.buttonText}
                    </span>
                    <span className="h-4 w-4">{Icons.arrow}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </form>

      {/* Corner markers */}
      <div
        className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r"
        style={{ borderColor: `${COLORS.accent}30` }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// CONTACT CARD
// ════════════════════════════════════════════════════════════════════════════

const ContactCard = memo(function ContactCard({
  icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  color: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <div
      className="flex items-center gap-3 p-3 transition-all duration-300"
      style={{
        background: isHovered ? `${color}08` : COLORS.glass.bg,
        border: `1px solid ${isHovered ? `${color}30` : COLORS.glass.border}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="flex h-9 w-9 items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <span className="h-4 w-4" style={{ color }}>
          {icon}
        </span>
      </span>
      <div className="min-w-0">
        <span className="block text-[9px] font-bold uppercase tracking-wider text-white/30">
          {label}
        </span>
        <span
          className="block truncate text-sm text-white/70 transition-colors duration-200"
          style={{ color: isHovered ? "#fff" : undefined }}
        >
          {value}
        </span>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
});

// ════════════════════════════════════════════════════════════════════════════
// STATUS INDICATOR
// ════════════════════════════════════════════════════════════════════════════

const StatusIndicator = memo(function StatusIndicator() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
          hour12: false,
        }),
      );
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/30">
      <div
        className="flex items-center gap-2 rounded-full px-3 py-1.5"
        style={{
          background: `${COLORS.secondary}10`,
          border: `1px solid ${COLORS.secondary}20`,
        }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: COLORS.secondary }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: COLORS.secondary }}
          />
        </span>
        <span style={{ color: COLORS.secondary }}>Online</span>
      </div>
      <span className="flex items-center gap-1.5 font-mono tabular-nums">
        <span className="h-3 w-3">{Icons.clock}</span>
        {time} PST
      </span>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MARQUEE
// ════════════════════════════════════════════════════════════════════════════

const Marquee = memo(function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const items = [
    { text: "WEB DESIGN", color: COLORS.primary },
    { text: "DEVELOPMENT", color: COLORS.secondary },
    { text: "SEO", color: COLORS.primary },
    { text: "AI AUTOMATION", color: COLORS.accent },
    { text: "BRANDING", color: COLORS.secondary },
  ];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!ref.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 25,
        ease: "none",
        repeat: -1,
      });
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden border-y py-4"
      style={{ borderColor: COLORS.glass.border }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#0A0D14] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#0A0D14] to-transparent" />
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-2 text-xs font-bold tracking-[0.2em]"
          >
            <span
              className="h-1.5 w-1.5 rotate-45"
              style={{ backgroundColor: item.color }}
            />
            <span style={{ color: item.color }}>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN FOOTER
// ════════════════════════════════════════════════════════════════════════════

const Footer: React.FC<{ config?: FooterConfig }> = ({
  config = defaultConfig,
}) => {
  const footerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!footerRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-column",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative"
      style={{ backgroundColor: COLORS.dark }}
    >
      <FooterBackground />

      <div className="relative   mx-auto max-w-[99%] md:max-w-[95%] px-4 pt-16">
        {/* CTA */}
        <FooterCTA />

        {/* Main Grid */}
        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + Contact Column */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <Link
              href={config.logo.href}
              className="group mb-6 inline-flex items-center gap-3"
            >
              {config.logo.image && (
                <div
                  className="relative h-10 w-10 overflow-hidden"
                  style={{
                    background: COLORS.glass.bg,
                    border: `1px solid ${COLORS.glass.border}`,
                  }}
                >
                  <Image
                    src={config.logo.image}
                    alt={config.logo.text}
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
              )}
              <div>
                <span className="block text-xl font-bold tracking-tight text-white">
                  {config.logo.text}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Digital Studio
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/45">
              {config.tagline}
            </p>

            {/* Contact Cards */}
            <div className="mb-6 space-y-2">
              <ContactCard
                icon={Icons.mail}
                label="Email"
                value={config.contact.email}
                href={`mailto:${config.contact.email}`}
                color={COLORS.primary}
              />
              {config.contact.phone && (
                <ContactCard
                  icon={Icons.phone}
                  label="Phone"
                  value={config.contact.phone}
                  href={`tel:${config.contact.phone}`}
                  color={COLORS.secondary}
                />
              )}
              {config.contact.address && (
                <ContactCard
                  icon={Icons.mapPin}
                  label="Location"
                  value={config.contact.address}
                  color={COLORS.accent}
                />
              )}
            </div>

            {/* Social */}
            <div className="flex gap-2 w-full min-w-120">
              {config.socialLinks.map((social, index) => (
                <SocialLinkButton
                  key={social.id}
                  social={social}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-3 gap-6 lg:col-span-5">
            {config.columns.map((column, index) => (
              <FooterColumn key={column.title} column={column} index={index} />
            ))}
          </div>
          

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-3">
            <Newsletter config={config.newsletter} />

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div
                className="p-3 text-center"
                style={{
                  background: COLORS.glass.bg,
                  border: `1px solid ${COLORS.glass.border}`,
                }}
              >
                <span
                  className="block text-lg font-bold"
                  style={{ color: COLORS.primary }}
                >
                  150+
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/30">
                  Projects
                </span>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  background: COLORS.glass.bg,
                  border: `1px solid ${COLORS.glass.border}`,
                }}
              >
                <span
                  className="block text-lg font-bold"
                  style={{ color: COLORS.secondary }}
                >
                  98%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/30">
                  Satisfaction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <Marquee />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          {/* Legal */}
          <div className="flex flex-wrap items-center gap-4">
            {config.legal.map((link, i) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className="text-[10px] uppercase tracking-wider text-white/30 transition-colors hover:text-white/60"
                >
                  {link.label}
                </Link>
                {i < config.legal.length - 1 && (
                  <span className="h-3 w-px bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Status */}
          <StatusIndicator />
        </div>

        {/* Copyright */}
        <div
          className="border-t py-6"
          style={{ borderColor: COLORS.glass.border }}
        >
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[10px] text-white/25">{config.copyright}</p>
            <p className="flex items-center gap-2 text-[10px] text-white/25">
              <span>Crafted with</span>
              <span className="text-red-400">♥</span>
              <span>·</span>
              <span
                className="font-mono"
                style={{ color: `${COLORS.primary}60` }}
              >
                v2.4.1
              </span>
            </p>
          </div>
        </div>

        {/* System Marker */}
        <div
          className="pb-6 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-white/10"
          aria-hidden="true"
        >
          SYS::FOOTER_001 • CHEETAHNOVA
        </div>
      </div>

      {/* Large Background Text */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <div
          className="text-center font-bold leading-none"
          style={{
            fontSize: "clamp(80px, 12vw, 200px)",
            letterSpacing: "-0.02em",
            background: `linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 70%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: "translateY(35%)",
          }}
        >
          CHEETAHNOVA
        </div>
      </div>

      {/* Bottom Line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${COLORS.primary}40, ${COLORS.secondary}30, ${COLORS.accent}40, transparent 95%)`,
        }}
      />
    </footer>
  );
};

export default memo(Footer);
export type { FooterConfig, FooterColumn, FooterLink, SocialLink };
