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

// ════════════════════════════════════════════════════════════════════
// BRAND TOKENS
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B", // Amber
  secondary: "#06B6D4", // Cyan
  accent: "#6D28D9", // Purple
  dark: "#0B0F19", // Background
  darkLighter: "#0F1420",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
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
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
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
      <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073a42.153 42.153 0 00-.767-1.68c2.316-1.037 4.348-2.432 6.027-4.146a10.037 10.037 0 011.843 5.899zm-2.962-7.149c-1.538 1.583-3.418 2.874-5.588 3.843a45.656 45.656 0 00-3.95-5.784A9.954 9.954 0 0112 1.945c2.172 0 4.19.693 5.923 1.847zM7.495 3.054a43.605 43.605 0 013.92 5.702 38.77 38.77 0 01-9.37 1.197 10.012 10.012 0 015.45-6.899zM1.945 12l.013-.256c3.578.029 7.057-.471 10.311-1.498.244.487.48.98.707 1.477-3.603 1.078-6.657 3.053-9.104 5.889A9.966 9.966 0 011.945 12zm3.108 7.127c2.264-2.655 5.065-4.513 8.396-5.543 1.133 2.946 1.9 6.048 2.262 9.228a10.082 10.082 0 01-3.711.743c-2.694 0-5.159-1.063-6.947-2.878zm8.95 4.238a49.61 49.61 0 00-2.139-8.821c1.876-.327 3.943-.293 6.218.1.458 3.449-.672 6.654-2.879 8.721-.378.033-.76.055-1.145.055l-.055-.055z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  mapPin: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
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
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════

const defaultConfig: FooterConfig = {
  logo: {
    text: "NEXUS",
    href: "/",
    image: "/assets/images/logo.png",
  },
  tagline:
    "Crafting digital experiences that convert visitors into customers. We design, develop, and grow your online presence.",
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
        { label: "Brand Identity", href: "/services/branding" },
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
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      accentColor: "accent",
      links: [
        { label: "Documentation", href: "/docs", isExternal: true },
        { label: "Help Center", href: "/help" },
        { label: "Templates", href: "/templates" },
        { label: "Pricing", href: "/pricing" },
        { label: "System Status", href: "/status", isExternal: true },
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
    {
      id: "dribbble",
      label: "Dribbble",
      href: "https://dribbble.com",
      icon: Icons.dribbble,
    },
  ],
  newsletter: {
    title: "Stay in the loop",
    description:
      "Get weekly insights on design, development, and AI automation.",
    placeholder: "your@email.com",
    buttonText: "Subscribe",
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

// ════════════════════════════════════════════════════════════════════
// UTILITY: Get color value
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent" = "primary") =>
  colors[colorKey];

// ════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND
// ════════════════════════════════════════════════════════════════════

const FooterBackground = memo(function FooterBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Primary Glow (Top Center) */}
      <div
        className="absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(ellipse, ${colors.primary}12 0%, transparent 70%)`,
        }}
      />

      {/* Secondary Glow (Bottom Left) */}
      <div
        className="absolute -bottom-20 -left-20 h-100 w-100"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}08 0%, transparent 70%)`,
        }}
      />

      {/* Accent Glow (Bottom Right) */}
      <div
        className="absolute -bottom-20 -right-20 h-100 w-100"
        style={{
          background: `radial-gradient(circle, ${colors.accent}08 0%, transparent 70%)`,
        }}
      />

      {/* Top Border Gradient */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${colors.primary}40 25%, 
            ${colors.secondary}30 50%, 
            ${colors.accent}40 75%, 
            transparent 100%
          )`,
        }}
      />

      {/* Corner Decorations */}
      <div className="absolute left-8 top-8">
        <div
          className="h-16 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}40, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-16"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}40, transparent)`,
          }}
        />
      </div>
      <div className="absolute right-8 top-8">
        <div
          className="h-16 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.secondary}30, transparent)`,
          }}
        />
        <div
          className="absolute right-0 top-0 h-px w-16"
          style={{
            background: `linear-gradient(270deg, ${colors.secondary}30, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// ANIMATED MARQUEE
// ════════════════════════════════════════════════════════════════════

const Marquee = memo(function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const items = [
    { text: "WEB DESIGN", color: colors.primary },
    { text: "DEVELOPMENT", color: colors.secondary },
    { text: "SEO SYSTEMS", color: colors.primary },
    { text: "AI AUTOMATION", color: colors.accent },
    { text: "BRANDING", color: colors.secondary },
    { text: "GROWTH", color: colors.accent },
  ];

  useEffect(() => {
    if (!marqueeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".marquee-track", {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="relative overflow-hidden border-y py-5"
      style={{
        borderColor: "rgba(255,255,255,0.04)",
        background: `linear-gradient(90deg, ${colors.dark}, ${colors.darkLighter}, ${colors.dark})`,
      }}
    >
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-10 flex items-center gap-4 text-sm font-semibold tracking-[0.2em]"
          >
            <span
              className="h-2 w-2 rotate-45"
              style={{ backgroundColor: item.color }}
            />
            <span style={{ color: `${item.color}90` }}>{item.text}</span>
          </span>
        ))}
        {[...items, ...items].map((item, i) => (
          <span
            key={`dup-${i}`}
            className="mx-10 flex items-center gap-4 text-sm font-semibold tracking-[0.2em]"
          >
            <span
              className="h-2 w-2 rotate-45"
              style={{ backgroundColor: item.color }}
            />
            <span style={{ color: `${item.color}90` }}>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// NEWSLETTER COMPONENT
// ════════════════════════════════════════════════════════════════════

const Newsletter = memo(function Newsletter({
  config,
}: {
  config: FooterConfig["newsletter"];
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || status === "loading") return;

      setStatus("loading");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    },
    [email, status],
  );

  return (
    <div className="newsletter-section">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-4 w-4" style={{ color: colors.accent }}>
          {Icons.mail}
        </span>
        <h3 className="text-sm font-semibold text-white">{config.title}</h3>
      </div>
      <p className="mb-5 text-[13px] leading-relaxed text-white/40">
        {config.description}
      </p>

      <form onSubmit={handleSubmit}>
        <div
          className="relative overflow-hidden border transition-all duration-300"
          style={{
            borderColor:
              status === "success"
                ? `${colors.secondary}50`
                : isFocused
                  ? `${colors.primary}30`
                  : "rgba(255,255,255,0.08)",
            background:
              status === "success"
                ? `${colors.secondary}08`
                : isFocused
                  ? `${colors.primary}05`
                  : "rgba(255,255,255,0.02)",
          }}
        >
          {status === "success" ? (
            <div
              className="flex items-center gap-2 px-4 py-3.5 text-sm"
              style={{ color: colors.secondary }}
            >
              <span className="h-4 w-4">{Icons.check}</span>
              <span>You're subscribed!</span>
            </div>
          ) : (
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={config.placeholder}
                className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white 
                         placeholder-white/25 outline-none"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="group flex items-center gap-2 border-l px-5 py-3.5 
                         text-sm font-medium transition-all duration-300 
                         disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}10)`,
                  color: colors.primary,
                }}
              >
                {status === "loading" ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                    style={{
                      borderColor: `${colors.primary}30`,
                      borderTopColor: colors.primary,
                    }}
                  />
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      {config.buttonText}
                    </span>
                    <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5">
                      {Icons.arrow}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Trust Badges */}
      <div className="mt-4 flex items-center gap-4 text-[10px] text-white/25">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3">{Icons.check}</span>
          No spam
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3">{Icons.check}</span>
          Unsubscribe anytime
        </span>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SOCIAL LINK COMPONENT
// ════════════════════════════════════════════════════════════════════

const SocialLink = memo(function SocialLink({
  social,
  index,
}: {
  social: SocialLink;
  index: number;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Cycle through colors for each social icon
  const socialColors = [colors.primary, colors.secondary, colors.accent];
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
    gsap.to(linkRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  return (
    <a
      ref={linkRef}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-11 w-11 items-center justify-center 
                 border text-white/40 transition-all duration-300"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        backgroundColor: "rgba(255,255,255,0.02)",
        willChange: "transform",
      }}
      aria-label={social.label}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${hoverColor}40`;
        e.currentTarget.style.backgroundColor = `${hoverColor}10`;
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
        e.currentTarget.style.color = "rgba(255,255,255,0.4)";
      }}
    >
      <span className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110">
        {social.icon}
      </span>
    </a>
  );
});

// ════════════════════════════════════════════════════════════════════
// FOOTER LINK COMPONENT
// ════════════════════════════════════════════════════════════════════

const FooterLinkItem = memo(function FooterLinkItem({
  link,
  accentColor = "primary",
}: {
  link: FooterLink;
  accentColor?: "primary" | "secondary" | "accent";
}) {
  const color = getColor(accentColor);
  const badgeColor = link.badgeColor ? getColor(link.badgeColor) : color;

  return (
    <li>
      <Link
        href={link.href}
        target={link.isExternal ? "_blank" : undefined}
        rel={link.isExternal ? "noopener noreferrer" : undefined}
        className="group flex items-center gap-2 py-1.5 text-[13px] text-white/45 
                 transition-colors duration-200 hover:text-white/90"
      >
        {/* Hover Line */}
        <span
          className="h-px w-0 transition-all duration-300 group-hover:w-2"
          style={{ backgroundColor: color }}
        />

        <span>{link.label}</span>

        {link.badge && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${badgeColor}15`,
              color: badgeColor,
            }}
          >
            {link.badge}
          </span>
        )}

        {link.isExternal && (
          <span
            className="h-3 w-3 text-white/20 transition-all duration-200 
                         group-hover:text-white/40 group-hover:translate-x-0.5 
                         group-hover:-translate-y-0.5"
          >
            {Icons.arrowUpRight}
          </span>
        )}
      </Link>
    </li>
  );
});

// ════════════════════════════════════════════════════════════════════
// FOOTER COLUMN COMPONENT
// ════════════════════════════════════════════════════════════════════

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
      <h3 className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        <span className="font-mono" style={{ color: `${color}80` }}>
          0{index + 1}
        </span>
        <span
          className="h-px flex-1 max-w-5"
          style={{ backgroundColor: `${color}30` }}
        />
        <span>{column.title}</span>
      </h3>
      <ul className="space-y-0.5">
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

// ════════════════════════════════════════════════════════════════════
// STATUS INDICATOR
// ════════════════════════════════════════════════════════════════════

const StatusIndicator = memo(function StatusIndicator() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
          hour12: false,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/25 sm:justify-start">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: colors.secondary }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
        </span>
        <span>All Systems Operational</span>
      </div>
      <span className="hidden text-white/10 sm:inline">|</span>
      <span className="flex items-center gap-1.5 font-mono tabular-nums">
        <span className="h-3 w-3 text-white/20">{Icons.globe}</span>
        {time} PST
      </span>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA SECTION
// ════════════════════════════════════════════════════════════════════

const FooterCTA = memo(function FooterCTA() {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ctaRef}
      className="relative mb-16 overflow-hidden border p-8 sm:p-12"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: `linear-gradient(135deg, 
          ${colors.primary}08 0%, 
          transparent 40%,
          transparent 60%,
          ${colors.accent}06 100%
        )`,
      }}
    >
      {/* Dot Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Decorations */}
      <div
        className="pointer-events-none absolute right-6 top-6 h-5 w-5"
        style={{ color: `${colors.primary}30` }}
      >
        {Icons.sparkle}
      </div>
      <div
        className="pointer-events-none absolute bottom-6 left-1/3 h-4 w-4"
        style={{ color: `${colors.accent}20` }}
      >
        {Icons.sparkle}
      </div>

      <div className="relative flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left sm:justify-between">
        <div>
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Ready to <span style={{ color: colors.primary }}>elevate</span> your
            brand?
          </h2>
          <p className="max-w-md text-white/45">
            Let's discuss how we can transform your digital presence and drive
            real results.
          </p>
        </div>

        <Link
          href="/contact"
          className="group relative shrink-0 overflow-hidden px-8 py-4 
                     text-sm font-semibold uppercase tracking-wider text-black"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Start a Project
            <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
              {Icons.arrow}
            </span>
          </span>

          {/* Shine Effect */}
          <span
            className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r 
                     from-transparent via-white/30 to-transparent transition-transform 
                     duration-700 group-hover:translate-x-full"
          />

          {/* Corner Accents */}
          <span
            className="absolute left-0 top-0 h-2 w-2 border-l border-t"
            style={{ borderColor: "rgba(0,0,0,0.2)" }}
          />
          <span
            className="absolute bottom-0 right-0 h-2 w-2 border-b border-r"
            style={{ borderColor: "rgba(0,0,0,0.2)" }}
          />
        </Link>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN FOOTER COMPONENT
// ════════════════════════════════════════════════════════════════════

const Footer: React.FC<{ config?: FooterConfig }> = ({
  config = defaultConfig,
}) => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate columns
      gsap.fromTo(
        ".footer-column",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Animate newsletter
      gsap.fromTo(
        ".newsletter-section",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative pt-20 "
     >
      <FooterBackground />

      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* CTA Section */}
        <FooterCTA />

        {/* Main Footer Content */}
        <div className="grid gap-12 pb-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <Link
              href={config.logo.href}
              className="mb-6 inline-flex items-center gap-3"
            >
              {config.logo.image ? (
                <div className="relative h-10 w-10">
                  <Image
                    src={config.logo.image}
                    alt={config.logo.text}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-2xl font-bold tracking-tight text-white">
                  {config.logo.text}
                </span>
              )}
            </Link>

            {/* Tagline */}
            <p className="mb-6 max-w-sm text-[14px] leading-relaxed text-white/40">
              {config.tagline}
            </p>

            {/* Contact Info */}
            <div className="mb-6 space-y-3">
              <a
                href={`mailto:${config.contact.email}`}
                className="flex items-center gap-3 text-sm text-white/50 transition-colors"
                style={{ ["--hover-color" as string]: colors.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.primary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                <span className="h-4 w-4 text-white/25">{Icons.mail}</span>
                {config.contact.email}
              </a>
              {config.contact.phone && (
                <a
                  href={`tel:${config.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white/80"
                >
                  <span className="h-4 w-4 text-white/25">{Icons.phone}</span>
                  {config.contact.phone}
                </a>
              )}
              {config.contact.address && (
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <span className="h-4 w-4 text-white/25">{Icons.mapPin}</span>
                  {config.contact.address}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {config.socialLinks.map((social, index) => (
                <SocialLink key={social.id} social={social} index={index} />
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {config.columns.map((column, index) => (
              <FooterColumn key={column.title} column={column} index={index} />
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <Newsletter config={config.newsletter} />
          </div>
        </div>

        {/* Marquee */}
        <Marquee />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {config.legal.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] uppercase tracking-wider text-white/25 
                           transition-colors hover:text-white/50"
                >
                  {link.label}
                </Link>
                {index < config.legal.length - 1 && (
                  <span className="text-white/10">·</span>
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
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-[11px] text-white/20">{config.copyright}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/20">
              <span>Designed & Built with</span>
              <span className="text-red-400">♥</span>
              <span>in California</span>
            </p>
          </div>
        </div>
      </div>

      {/* Giant Background Text */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
        <div
          className="text-center font-bold leading-none tracking-tighter"
          style={{
            fontSize: "clamp(100px, 15vw, 250px)",
            color: "rgba(255,255,255,0.015)",
            transform: "translateY(25%)",
          }}
        >
          NEXUS
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
export type { FooterConfig, FooterColumn, FooterLink, SocialLink };
