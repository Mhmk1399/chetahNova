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
  success: "#10B981",
  dark: "#030712",
  darkLighter: "#0a0f1a",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  industry: string;
  services: string[];
  description: string;
  results?: { value: string; label: string }[];
  color: "primary" | "secondary" | "accent";
  year?: string;
}

interface PortfolioSectionProps {
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
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ════════════════════════════════════════════════════════════════════

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "TechCorp Solutions",
    slug: "techcorp",
    thumbnail:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    industry: "SaaS",
    services: ["Design", "Development", "SEO"],
    description: "Complete website redesign with conversion optimization.",
    results: [
      { value: "+340%", label: "Conversions" },
      { value: "#1", label: "Rank" },
    ],
    color: "primary",
    year: "2024",
  },
  {
    id: "2",
    title: "Luxe Realty Group",
    slug: "luxe-realty",
    thumbnail:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    industry: "Real Estate",
    services: ["Design", "Development", "AI"],
    description: "Luxury real estate platform with AI property matching.",
    results: [
      { value: "2.5x", label: "Leads" },
      { value: "-60%", label: "Response" },
    ],
    color: "secondary",
    year: "2024",
  },
  {
    id: "3",
    title: "Nova Finance",
    slug: "nova-finance",
    thumbnail:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    industry: "Fintech",
    services: ["Design", "Development", "AI"],
    description: "Modern fintech platform with automated onboarding.",
    results: [
      { value: "+180%", label: "Sign-ups" },
      { value: "4.9★", label: "Rating" },
    ],
    color: "accent",
    year: "2024",
  },
  {
    id: "4",
    title: "EcoStore Market",
    slug: "eco-store",
    thumbnail:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    industry: "E-commerce",
    services: ["Design", "Development"],
    description: "Sustainable e-commerce with optimized checkout.",
    results: [
      { value: "+220%", label: "Revenue" },
      { value: "-45%", label: "Abandon" },
    ],
    color: "primary",
    year: "2023",
  },
  {
    id: "5",
    title: "HealthPlus Clinic",
    slug: "health-plus",
    thumbnail:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    industry: "Healthcare",
    services: ["Design", "SEO", "AI"],
    description: "Healthcare booking with AI scheduling.",
    results: [
      { value: "+150%", label: "Bookings" },
      { value: "24/7", label: "Support" },
    ],
    color: "secondary",
    year: "2023",
  },
  {
    id: "6",
    title: "StartupHub Platform",
    slug: "startup-hub",
    thumbnail:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Integration+%26+Growth+System.webp",
    industry: "SaaS",
    services: ["Development", "AI"],
    description: "Startup ecosystem with AI-powered matching.",
    results: [
      { value: "500+", label: "Startups" },
      { value: "$2M+", label: "Funded" },
    ],
    color: "accent",
    year: "2023",
  },
];

const getColor = (key: "primary" | "secondary" | "accent") => colors[key];

// ════════════════════════════════════════════════════════════════════
// MARQUEE CARD
// ════════════════════════════════════════════════════════════════════

const MarqueeCard = memo(function MarqueeCard({
  project,
}: {
  project: Project;
}) {
  const [hovered, setHovered] = useState(false);
  const color = getColor(project.color);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative block shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "400px" }}
    >
      <div
        className="relative h-full overflow-hidden border-2 bg-gray-900 transition-all duration-300"
        style={{
          borderColor: hovered ? color : "rgba(255,255,255,0.1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 20px 40px ${color}30`
            : "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
            sizes="400px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Industry Badge */}
          <div className="absolute left-4 top-4">
            <span
              className="border bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
              style={{
                borderColor: hovered ? color : "rgba(255,255,255,0.2)",
                color: hovered ? color : "white",
              }}
            >
              {project.industry}
            </span>
          </div>

          {/* Arrow */}
          <div
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 transition-all duration-300"
            style={{
              borderColor: hovered ? "white" : "rgba(255,255,255,0.3)",
              backgroundColor: hovered ? "white" : "rgba(0,0,0,0.5)",
            }}
          >
            <span
              className="h-4 w-4"
              style={{ color: hovered ? "#000" : "white" }}
            >
              {Icons.arrowUpRight}
            </span>
          </div>

          {/* Results */}
          {project.results && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              {project.results.map((r, i) => (
                <div
                  key={i}
                  className="flex-1 border border-white/20 bg-black/60 px-3 py-2 backdrop-blur-sm"
                >
                  <div className="text-lg font-bold" style={{ color }}>
                    {r.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="mb-2 text-lg font-bold text-white">{project.title}</h3>
          <p className="line-clamp-2 text-sm text-white/50">
            {project.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: hovered ? color : "rgba(255,255,255,0.5)" }}
            >
              View Project
              <span className="h-3 w-3">{Icons.arrow}</span>
            </span>
            <span className="text-xs text-white/30">{project.year}</span>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-500"
          style={{
            width: hovered ? "100%" : "0%",
            backgroundColor: color,
          }}
        />
      </div>
    </Link>
  );
});

// ════════════════════════════════════════════════════════════════════
// MARQUEE ROW - CSS-based infinite scroll
// ════════════════════════════════════════════════════════════════════

const MarqueeRow = memo(function MarqueeRow({
  projects,
  direction = "left",
  speed = 40,
}: {
  projects: Project[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const duplicatedProjects = [...projects, ...projects, ...projects];

  return (
    <div className="marquee-container relative overflow-hidden py-4">
      {/* Gradient Masks */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-32"
        style={{
          background: `linear-gradient(90deg, ${colors.dark}, transparent)`,
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-32"
        style={{
          background: `linear-gradient(270deg, ${colors.dark}, transparent)`,
        }}
      />

      {/* Scrolling Track */}
      <div
        className="marquee-track flex gap-6"
        style={{
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedProjects.map((project, index) => (
          <MarqueeCard key={`${project.id}-${index}`} project={project} />
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll ${speed}s linear infinite;
          width: max-content;
        }

        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              calc(-400px * ${projects.length} - ${projects.length * 24}px)
            );
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// GRID CARD
// ════════════════════════════════════════════════════════════════════

const GridCard = memo(function GridCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const color = getColor(project.color);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      },
    );
  }, [index]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/work/${project.slug}`} className="block h-full">
        <div
          className="relative h-full overflow-hidden border-2 bg-gray-900 transition-all duration-300"
          style={{
            borderColor: hovered ? color : "rgba(255,255,255,0.08)",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: hovered
              ? `0 20px 40px ${color}25`
              : "0 10px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Image */}
          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent" />

            {/* Badge */}
            <div className="absolute left-3 top-3">
              <span
                className="border bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
                style={{
                  borderColor: hovered ? color : "rgba(255,255,255,0.2)",
                  color: hovered ? color : "white",
                }}
              >
                {project.industry}
              </span>
            </div>

            {/* Arrow */}
            <div
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border-2 transition-all duration-300"
              style={{
                borderColor: hovered ? "white" : "rgba(255,255,255,0.2)",
                backgroundColor: hovered ? "white" : "rgba(0,0,0,0.4)",
              }}
            >
              <span
                className="h-4 w-4"
                style={{ color: hovered ? "#000" : "white" }}
              >
                {Icons.arrowUpRight}
              </span>
            </div>

            {/* Results */}
            {project.results && (
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                {project.results.map((r, i) => (
                  <div
                    key={i}
                    className="flex-1 border border-white/15 bg-black/50 px-2 py-1.5 text-center backdrop-blur-sm"
                  >
                    <div className="text-sm font-bold" style={{ color }}>
                      {r.value}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-white/50">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {project.services.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: hovered
                      ? `${color}50`
                      : "rgba(255,255,255,0.1)",
                    color: hovered ? color : "rgba(255,255,255,0.4)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <h3 className="mb-1.5 text-base font-bold text-white">
              {project.title}
            </h3>
            <p className="line-clamp-2 text-xs text-white/45">
              {project.description}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: hovered ? color : "rgba(255,255,255,0.4)" }}
              >
                View
                <span className="h-3 w-3">{Icons.arrow}</span>
              </span>
              <span className="text-[10px] text-white/25">{project.year}</span>
            </div>
          </div>

          {/* Bottom Line */}
          <div
            className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
            style={{
              width: hovered ? "100%" : "0%",
              backgroundColor: color,
            }}
          />
        </div>
      </Link>
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current.querySelectorAll(".animate-item"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
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
    <div ref={ref} className="mx-auto mb-16 max-w-4xl text-center">
      {/* Headline */}
      <h2 className="animate-item mb-6 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
        Projects that{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
        >
          Deliver Results
        </span>
      </h2>

      {/* Description */}
      <p className="animate-item text-base text-white/50 sm:text-lg">
        {description}
      </p>

      {/* Divider */}
      <div className="animate-item mt-10 flex items-center justify-center gap-4">
        <div
          className="h-px w-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}50)`,
          }}
        />
        <div
          className="h-2 w-2 rotate-45"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="h-px w-20"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}50, transparent)`,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FILTER TABS
// ════════════════════════════════════════════════════════════════════

const FilterTabs = memo(function FilterTabs({
  activeFilter,
  onFilterChange,
  projects,
}: {
  activeFilter: string;
  onFilterChange: (f: string) => void;
  projects: Project[];
}) {
  const industries = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.industry)))],
    [projects],
  );

  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
      {industries.map((industry) => {
        const isActive = activeFilter === industry;
        const count =
          industry === "All"
            ? projects.length
            : projects.filter((p) => p.industry === industry).length;

        return (
          <button
            key={industry}
            onClick={() => onFilterChange(industry)}
            className="border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 sm:px-5 sm:text-sm"
            style={{
              borderColor: isActive ? colors.primary : "rgba(255,255,255,0.1)",
              backgroundColor: isActive ? `${colors.primary}15` : "transparent",
              color: isActive ? colors.primary : "rgba(255,255,255,0.5)",
            }}
          >
            {industry}
            <span className="ml-1.5 opacity-60">({count})</span>
          </button>
        );
      })}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA BUTTON
// ════════════════════════════════════════════════════════════════════

const CTAButton = memo(function CTAButton({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="mt-16 flex flex-col items-center">
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative overflow-hidden border-2 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 sm:px-14 sm:py-5"
        style={{
          borderColor: colors.primary,
          backgroundColor: hovered ? colors.primary : "transparent",
          color: hovered ? "#000" : colors.primary,
        }}
      >
        <span className="relative z-10 flex items-center gap-3">
          {text}
          <span className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
            {Icons.arrow}
          </span>
        </span>
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  description = "We create digital experiences that drive real business results. Here's our recent work.",
  projects = defaultProjects,
  ctaText = "View All Projects",
  ctaHref = "/work",
}) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.industry === activeFilter),
    [activeFilter, projects],
  );

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-16 lg:py-16"
      style={{ backgroundColor: colors.dark }}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(${colors.primary}15 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mx-auto max-w-[95%] px-4 xl:max-w-7xl">
          <SectionHeader description={description} />
        </div>

        {/* Marquee Section */}
        <div className="mb-16">
          <div className="mx-auto mb-4 max-w-[95%] px-4 xl:max-w-7xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                Featured
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              />
              <span className="text-xs text-white/30">Hover to pause</span>
            </div>
          </div>

          <MarqueeRow
            projects={projects.slice(0, 4)}
            direction="left"
            speed={35}
          />

          {projects.length > 4 && (
            <MarqueeRow
              projects={projects.slice(2)}
              direction="right"
              speed={40}
            />
          )}
        </div>

        {/* Grid Section */}
        <div className="mx-auto max-w-[95%] px-4 xl:max-w-7xl">
          {/* CTA */}
          <CTAButton text={ctaText} href={ctaHref} />
        </div>
      </div>
    </section>
  );
};

export default memo(PortfolioSection);
export type { PortfolioSectionProps, Project };
