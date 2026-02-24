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
import Image from "next/image";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ════════════════════════════════════════════════════════════════════
// BRAND COLORS & THEME
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#8B5CF6",
  success: "#10B981",
  dark: "#030712",
  darkLighter: "#0a0f1a",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBorder: "rgba(255, 255, 255, 0.06)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.4)",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface ProjectResult {
  value: string;
  label: string;
  icon?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  industry: string;
  services: ("Design" | "Development" | "SEO" | "AI")[];
  description: string;
  results?: ProjectResult[];
  color: "primary" | "secondary" | "accent";
  featured?: boolean;
  year?: string;
  client?: string;
}

interface PortfolioSectionProps {
  headline?: string;
  description?: string;
  projects?: Project[];
  ctaText?: string;
  ctaHref?: string;
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M7 17L17 7M17 7H7M17 7v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  design: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 19l7-7 3 3-7 7-3-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  code: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline
        points="16 18 22 12 16 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="8 6 2 12 8 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  ai: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-2.96 3.08A2.5 2.5 0 0 1 12 19.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
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
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  ),
  layers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon
        points="12 2 2 7 12 12 22 7 12 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="2 17 12 22 22 17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="2 12 12 17 22 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const serviceIcons: Record<string, React.ReactNode> = {
  Design: Icons.design,
  Development: Icons.code,
  SEO: Icons.search,
  AI: Icons.ai,
};

const serviceColors: Record<string, string> = {
  Design: colors.primary,
  Development: colors.secondary,
  SEO: colors.success,
  AI: colors.accent,
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultProjects: Project[] = [
  {
    id: "techcorp",
    title: "TechCorp Solutions",
    slug: "techcorp-solutions",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    industry: "SaaS",
    services: ["Design", "Development", "SEO"],
    description:
      "Complete website redesign with conversion optimization and comprehensive SEO strategy that transformed their digital presence.",
    results: [
      { value: "+340%", label: "Conversions" },
      { value: "#1", label: "Google Rank" },
    ],
    color: "primary",
    featured: true,
    year: "2024",
    client: "TechCorp Inc.",
  },
  {
    id: "luxe-realty",
    title: "Luxe Realty Group",
    slug: "luxe-realty",
    thumbnail:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    industry: "Real Estate",
    services: ["Design", "Development", "AI"],
    description:
      "Luxury real estate platform featuring AI-powered property matching and virtual tour integration.",
    results: [
      { value: "2.5x", label: "Lead Gen" },
      { value: "-60%", label: "Response Time" },
    ],
    color: "secondary",
    featured: true,
    year: "2024",
    client: "Luxe Realty",
  },
  {
    id: "nova-finance",
    title: "Nova Finance",
    slug: "nova-finance",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    industry: "Fintech",
    services: ["Design", "Development", "SEO", "AI"],
    description:
      "Modern fintech platform with automated customer onboarding and real-time analytics dashboard.",
    results: [
      { value: "+180%", label: "Sign-ups" },
      { value: "4.9★", label: "User Rating" },
    ],
    color: "accent",
    featured: true,
    year: "2024",
    client: "Nova Finance",
  },
  {
    id: "eco-store",
    title: "EcoStore Market",
    slug: "eco-store",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    industry: "E-commerce",
    services: ["Design", "Development", "SEO"],
    description:
      "Sustainable e-commerce platform with optimized checkout flow and carbon footprint tracking.",
    results: [
      { value: "+220%", label: "Revenue" },
      { value: "-45%", label: "Cart Abandon" },
    ],
    color: "primary",
    year: "2023",
  },
  {
    id: "health-plus",
    title: "HealthPlus Clinic",
    slug: "health-plus",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    industry: "Healthcare",
    services: ["Design", "SEO", "AI"],
    description:
      "Healthcare booking system with AI appointment scheduling and telemedicine integration.",
    results: [
      { value: "+150%", label: "Bookings" },
      { value: "24/7", label: "AI Support" },
    ],
    color: "secondary",
    year: "2023",
  },
  {
    id: "startup-hub",
    title: "StartupHub Platform",
    slug: "startup-hub",
    thumbnail:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    industry: "SaaS",
    services: ["Development", "AI"],
    description:
      "Startup ecosystem platform with AI-powered matching and investor relations tools.",
    results: [
      { value: "500+", label: "Startups" },
      { value: "$2M+", label: "Funded" },
    ],
    color: "accent",
    year: "2023",
  },
];

// ════════════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent") =>
  colors[colorKey];

// ════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND
// ════════════════════════════════════════════════════════════════════

const AnimatedBackground = memo(function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${colors.primary}08 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 50%, ${colors.secondary}06 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 0% 50%, ${colors.accent}05 0%, transparent 50%),
            linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkLighter} 50%, ${colors.dark} 100%)
          `,
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute left-1/4 top-1/4 h-125 w-125 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 60%)`,
          filter: "blur(100px)",
          animationDuration: "8s",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-100 w-100 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.accent}06 0%, transparent 60%)`,
          filter: "blur(100px)",
          animationDuration: "10s",
          animationDelay: "2s",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════

const SectionHeader = memo(function SectionHeader({
  description,
}: {
  description: string;
}) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        header.querySelectorAll(".header-animate"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={headerRef}
      className="mx-auto mb-16 max-w-4xl text-center lg:mb-20"
    >
      {/* Badge */}
      <div className="header-animate mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-sm">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.primary}20` }}
        >
          <span className="h-3.5 w-3.5" style={{ color: colors.primary }}>
            {Icons.layers}
          </span>
        </span>
        <span className="text-sm font-medium tracking-wide text-white/80">
          Selected Work
        </span>
        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      {/* Title */}
      <h2 className="header-animate mb-6">
        <span className="block text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Projects that drive
        </span>
        <span className="mt-2 block text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          <span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
            }}
          >
            real results
          </span>
        </span>
      </h2>

      {/* Description */}
      <p className="header-animate mx-auto max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
        {description}
      </p>

      {/* Decorative line */}
      <div className="header-animate mt-10 flex items-center justify-center gap-2">
        <span
          className="h-px w-16"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}50)`,
          }}
        />
        <span
          className="h-1.5 w-1.5 rotate-45"
          style={{ backgroundColor: colors.primary }}
        />
        <span
          className="h-px w-16"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}50, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STATS DISPLAY
// ════════════════════════════════════════════════════════════════════

const StatsDisplay = memo(function StatsDisplay() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      value: 150,
      suffix: "+",
      label: "Projects Delivered",
      color: colors.primary,
    },
    {
      value: 98,
      suffix: "%",
      label: "Client Satisfaction",
      color: colors.secondary,
    },
    {
      value: 50,
      suffix: "+",
      label: "Industries Served",
      color: colors.accent,
    },
    {
      value: 12,
      suffix: "M+",
      label: "Revenue Generated",
      color: colors.success,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={statsRef}
      className="relative mx-auto mb-16 max-w-5xl rounded-2xl border border-white/5 bg-linear-to-b from-white/3 to-transparent p-1 lg:mb-20"
    >
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/5 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-[#0a0f1a] p-6 transition-all duration-500 hover:bg-white/2 sm:p-8"
          >
            {/* Value */}
            <div className="mb-2 flex items-baseline gap-1">
              <span
                className="text-3xl font-bold tabular-nums sm:text-4xl lg:text-5xl"
                style={{ color: stat.color }}
              >
                {isVisible ? stat.value : 0}
              </span>
              <span
                className="text-xl font-bold sm:text-2xl"
                style={{ color: stat.color }}
              >
                {stat.suffix}
              </span>
            </div>

            {/* Label */}
            <p className="text-sm text-white/40 transition-colors group-hover:text-white/60">
              {stat.label}
            </p>

            {/* Hover accent */}
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
              style={{ backgroundColor: stat.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FILTER TABS (ENHANCED)
// ════════════════════════════════════════════════════════════════════

const FilterTabs = memo(function FilterTabs({
  activeFilter,
  onFilterChange,
  projects,
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  projects: Project[];
}) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const industries = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.industry))],
    [projects],
  );

  useEffect(() => {
    if (!tabsRef.current || !indicatorRef.current) return;

    const activeTab = tabsRef.current.querySelector(
      `[data-filter="${activeFilter}"]`,
    ) as HTMLElement;
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      gsap.to(indicatorRef.current, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [activeFilter]);

  return (
    <div className="mb-12 flex justify-center lg:mb-16">
      <div
        ref={tabsRef}
        className="relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/2 p-1.5 backdrop-blur-sm"
      >
        {/* Sliding indicator */}
        <div
          ref={indicatorRef}
          className="absolute left-0 top-1.5 h-[calc(100%-12px)] rounded-full"
          style={{
            backgroundColor: `${colors.primary}15`,
            border: `1px solid ${colors.primary}30`,
          }}
        />

        {industries.map((industry) => {
          const isActive = activeFilter === industry;
          const count =
            industry === "All"
              ? projects.length
              : projects.filter((p) => p.industry === industry).length;

          return (
            <button
              key={industry}
              data-filter={industry}
              onClick={() => onFilterChange(industry)}
              className="relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5"
              style={{
                color: isActive ? colors.primary : "rgba(255,255,255,0.5)",
              }}
            >
              <span>{industry}</span>
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? `${colors.primary}30`
                    : "rgba(255,255,255,0.1)",
                  color: isActive ? colors.primary : "rgba(255,255,255,0.4)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// PROJECT CARD (ENHANCED)
// ════════════════════════════════════════════════════════════════════

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  isFeatured = false,
}: {
  project: Project;
  index: number;
  isFeatured?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const color = getColor(project.color);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{ opacity: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Link href={`/work/${project.slug}`} className="block h-full">
        <div
          className="relative h-full overflow-hidden rounded-2xl border transition-all duration-500"
          style={{
            borderColor: isHovered ? `${color}40` : "rgba(255,255,255,0.06)",
            backgroundColor: colors.cardBg,
            boxShadow: isHovered
              ? `0 20px 40px -20px ${color}20, 0 0 60px -30px ${color}30`
              : "none",
          }}
        >
          {/* Gradient border effect on hover */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${color}20, transparent 50%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Thumbnail */}
          <div
            ref={imageRef}
            className={`relative overflow-hidden ${isFeatured ? "aspect-16/10" : "aspect-4/3"}`}
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-all duration-700"
              style={{
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                filter: isHovered ? "brightness(1.1)" : "brightness(0.9)",
              }}
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: `linear-gradient(180deg, 
                  ${colors.dark}00 0%,
                  ${colors.dark}60 60%,
                  ${colors.dark}f0 100%
                )`,
              }}
            />

            {/* Top Bar */}
            <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
              {/* Industry Badge */}
              <div
                className="rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md transition-all duration-300"
                style={{
                  borderColor: isHovered
                    ? `${color}60`
                    : "rgba(255,255,255,0.2)",
                  backgroundColor: isHovered ? `${color}20` : "rgba(0,0,0,0.4)",
                  color: isHovered ? color : "white",
                }}
              >
                {project.industry}
              </div>

              {/* View Button */}
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-500"
                style={{
                  borderColor: isHovered ? color : "rgba(255,255,255,0.2)",
                  backgroundColor: isHovered ? color : "rgba(0,0,0,0.4)",
                  transform: isHovered
                    ? "scale(1) rotate(0deg)"
                    : "scale(0.8) rotate(-45deg)",
                  opacity: isHovered ? 1 : 0.6,
                }}
              >
                <span
                  className="h-5 w-5 transition-colors duration-300"
                  style={{ color: isHovered ? colors.dark : "white" }}
                >
                  {Icons.arrowUpRight}
                </span>
              </div>
            </div>

            {/* Results (Featured cards) */}
            {isFeatured && project.results && (
              <div
                className="absolute bottom-5 left-5 right-5 flex gap-3 transition-all duration-500"
                style={{
                  transform: isHovered ? "translateY(0)" : "translateY(20px)",
                  opacity: isHovered ? 1 : 0,
                }}
              >
                {project.results.map((result, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-xl border px-4 py-3 backdrop-blur-xl"
                    style={{
                      borderColor: `${color}30`,
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color }}>
                        {result.value}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wider text-white/50">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Services */}
            <div className="mb-4 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-all duration-300"
                  style={{
                    borderColor: isHovered
                      ? `${serviceColors[service]}40`
                      : "rgba(255,255,255,0.1)",
                    backgroundColor: isHovered
                      ? `${serviceColors[service]}10`
                      : "transparent",
                    color: isHovered
                      ? serviceColors[service]
                      : "rgba(255,255,255,0.4)",
                  }}
                >
                  <span className="h-3 w-3">{serviceIcons[service]}</span>
                  {service}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3
              className="mb-2 text-xl font-bold transition-colors duration-300 lg:text-2xl"
              style={{ color: isHovered ? "white" : "rgba(255,255,255,0.9)" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className="mb-5 text-sm leading-relaxed text-white/50 line-clamp-2">
              {project.description}
            </p>

            {/* Results for non-featured */}
            {!isFeatured && project.results && (
              <div className="mb-5 flex items-center gap-5">
                {project.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold" style={{ color }}>
                      {result.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-white/40">
                      {result.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div
              className="flex items-center justify-between border-t pt-5"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <span
                className="flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                style={{ color: isHovered ? color : "rgba(255,255,255,0.6)" }}
              >
                View Case Study
                <span
                  className="h-4 w-4 transition-transform duration-300"
                  style={{
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  {Icons.arrow}
                </span>
              </span>

              {project.year && (
                <span className="text-xs text-white/30">{project.year}</span>
              )}
            </div>
          </div>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-500"
            style={{
              width: isHovered ? "100%" : "0%",
              background: `linear-gradient(90deg, ${color}, ${color}80)`,
            }}
          />
        </div>
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA SECTION (ENHANCED)
// ════════════════════════════════════════════════════════════════════

const CTASection = memo(function CTASection({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
      className="mt-16 flex flex-col items-center gap-8 lg:mt-20"
    >
      {/* Decorative separator */}
      <div className="flex items-center gap-4">
        <span
          className="h-px w-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}30)`,
          }}
        />
        <span
          className="h-2 w-2 rotate-45"
          style={{ backgroundColor: `${colors.primary}50` }}
        />
        <span
          className="h-px w-20"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}30, transparent)`,
          }}
        />
      </div>

      {/* CTA Button */}
      <Link
        href={href}
        className="group relative overflow-hidden rounded-full px-10 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-500"
        style={{
          backgroundColor: isHovered ? color : `${colors.primary}15`,
          color: isHovered ? colors.dark : colors.primary,
          boxShadow: isHovered
            ? `0 20px 40px -15px ${colors.primary}40`
            : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Shine effect */}
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center gap-3">
          {text}
          <span className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
            {Icons.arrow}
          </span>
        </span>
      </Link>

      {/* Supporting text */}
      <p className="text-sm text-white/30">
        Explore our complete portfolio of{" "}
        <span style={{ color: colors.primary }}>150+ projects</span>
      </p>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  headline = "Featured Projects & Case Studies",
  description = "We craft digital experiences that drive real business results. Here's a selection of our work across various industries, showcasing our expertise in design, development, SEO, and AI solutions.",
  projects = defaultProjects,
  ctaText = "View Full Portfolio",
  ctaHref = "/work",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    return activeFilter === "All"
      ? projects
      : projects.filter((p) => p.industry === activeFilter);
  }, [activeFilter, projects]);

  const featuredProjects = useMemo(
    () => filteredProjects.filter((p) => p.featured),
    [filteredProjects],
  );
  const regularProjects = useMemo(
    () => filteredProjects.filter((p) => !p.featured),
    [filteredProjects],
  );

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: colors.dark }}
    >
      <AnimatedBackground />

      <div className="relative mx-auto max-w-[95%] px-4 xl:max-w-7xl">
        {/* Header */}
        <SectionHeader description={description} />

        {/* Stats */}
        <StatsDisplay />

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          projects={projects}
        />

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isFeatured
            />
          ))}
          {regularProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={featuredProjects.length + index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              <span className="h-8 w-8" style={{ color: colors.primary }}>
                {Icons.search}
              </span>
            </div>
            <p className="text-lg font-medium text-white/60">
              No projects found in this category.
            </p>
            <p className="mt-2 text-sm text-white/40">
              Try selecting a different filter
            </p>
          </div>
        )}

        {/* CTA */}
        <CTASection text={ctaText} href={ctaHref} />
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-0 top-1/4 hidden -translate-x-1/2 lg:block">
        <div
          className="h-64 w-64 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${colors.primary}20, transparent)`,
            filter: "blur(60px)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-1/4 right-0 hidden translate-x-1/2 lg:block">
        <div
          className="h-48 w-48 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${colors.accent}20, transparent)`,
            filter: "blur(60px)",
          }}
        />
      </div>
    </section>
  );
};

export default memo(PortfolioSection);
export type { PortfolioSectionProps, Project, ProjectResult };
