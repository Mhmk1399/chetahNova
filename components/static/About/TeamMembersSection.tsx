// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/components/sections/TeamMembersSection.tsx
// PURPOSE: Team showcase with personnel dossier / HUD aesthetic
// VERSION: 2.4.1
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  memo,
  type RefObject,
  JSX,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#F59E0B",
  secondary: "#06B6D4",
  accent: "#6D28D9",
  background: "#0B0F19",
  surface: "#0D1117",
  success: "#10B981",
  panel: "#0C1220",
  scanLine: "#06B6D4",
} as const;

const OPACITY = {
  body: 0.65,
  caption: 0.4,
  grid: 0.03,
  glassBg: 0.04,
  cardBg: 0.03,
  skillBar: 0.15,
} as const;

const ANIMATION = {
  entranceDuration: 0.7,
  staggerDelay: 0.15,
  cardStagger: 0.2,
  scanDuration: 2,
  pulseDuration: 3,
  bioRevealDuration: 0.4,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_CONTENT = {
  systemLabel: "SYS::PERSONNEL_DB",
  version: "TEAM.v2.1",
  eyebrow: "Our Team",
  title: "Meet the Team",
  intro:
    "We are a team of designers, developers, SEO strategists, and AI specialists working together to build websites that deliver real results.",
  cta: {
    text: "Work With Our Team",
    href: "#contact",
  },
  members: [
    {
      id: "founder",
      name: "Alex Chen",
      role: "Founder / Web Strategy & AI Systems",
      bio: "Specialized in building conversion-focused websites, SEO growth strategies, and custom AI automation tools for businesses.",
      clearance: "ALPHA",
      status: "ACTIVE",
      color: COLORS.primary,
      skills: [
        { name: "Strategy", level: 95 },
        { name: "AI Systems", level: 90 },
        { name: "Leadership", level: 88 },
      ],
      initials: "AC",
      code: "FND-001",
    },
    {
      id: "designer",
      name: "Sarah Mitchell",
      role: "Web Design & Brand Identity",
      bio: "Expert in modern UI/UX design, layout psychology, and creating premium website experiences optimized for user behavior.",
      clearance: "BETA",
      status: "ACTIVE",
      color: COLORS.secondary,
      skills: [
        { name: "UI/UX", level: 96 },
        { name: "Branding", level: 92 },
        { name: "Psychology", level: 85 },
      ],
      initials: "SM",
      code: "DSG-002",
    },

    {
      id: "developer",
      name: "Marcus Johnson",
      role: "Web Development & Automation",
      bio: "Builds scalable websites, high-performance backends, and advanced automation systems tailored to each project.",
      clearance: "BETA",
      status: "ACTIVE",
      color: COLORS.accent,
      skills: [
        { name: "Frontend", level: 95 },
        { name: "Backend", level: 93 },
        { name: "DevOps", level: 88 },
      ],
      initials: "MJ",
      code: "DEV-004",
    },
    {
      id: "ai-engineer",
      name: "Emma Rodriguez",
      role: "AI Tools & Smart Website Integration",
      bio: "Develops custom AI solutions such as chatbots, analytics dashboards, and automation tools integrated into business websites.",
      clearance: "ALPHA",
      status: "ACTIVE",
      color: COLORS.primary,
      skills: [
        { name: "AI/ML", level: 97 },
        { name: "Integration", level: 90 },
        { name: "Innovation", level: 92 },
      ],
      initials: "ER",
      code: "AIE-005",
    },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface TeamMembersSectionProps {
  id?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  clearance: string;
  status: string;
  color: string;
  skills: readonly { name: string; level: number }[];
  initials: string;
  code: string;
}

interface MemberCardProps {
  member: TeamMember;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate blueprint/crosshatch grid pattern
 */
const generateBlueprintGrid = (): string => {
  const primary = OPACITY.grid;
  const secondary = OPACITY.grid * 0.5;
  return `
    linear-gradient(0deg, rgba(6,182,212,${primary}) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6,182,212,${primary}) 1px, transparent 1px),
    linear-gradient(0deg, rgba(6,182,212,${secondary}) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6,182,212,${secondary}) 1px, transparent 1px)
  `;
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BlueprintGrid - Technical blueprint-style grid
 */
const BlueprintGrid = memo(function BlueprintGrid(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: generateBlueprintGrid(),
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
      }}
    />
  );
});

/**
 * ScanLines - CRT-style scan line overlay
 */
const ScanLines = memo(function ScanLines(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.1) 2px,
          rgba(255,255,255,0.1) 4px
        )`,
      }}
    />
  );
});

/**
 * PersonnelDatabaseHeader - File cabinet / database style header
 */
const PersonnelDatabaseHeader = memo(function PersonnelDatabaseHeader({
  headerRefs,
}: {
  headerRefs: RefObject<HTMLElement[]>;
}): JSX.Element {
  const addRef = useCallback(
    (el: HTMLElement | null) => {
      if (el && headerRefs.current && !headerRefs.current.includes(el)) {
        headerRefs.current.push(el);
      }
    },
    [headerRefs],
  );

  return (
    <div className="relative mx-auto max-w-[99%] md:max-w-[99%] px-4 mb-16   lg:mb-20">
      {/* Database header bar */}
      <div
        ref={addRef}
        className="mb-8 flex items-center gap-4 border-b pb-4 opacity-0 will-change-transform"
        style={{ borderColor: `${COLORS.secondary}30` }}
      >
        <div
          className="flex items-center gap-2 border px-3 py-1"
          style={{
            borderColor: COLORS.secondary,
            backgroundColor: `${COLORS.secondary}10`,
          }}
        >
          <span
            className="h-2 w-2 animate-pulse"
            style={{ backgroundColor: COLORS.success }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: COLORS.secondary }}
          >
            Personnel Database
          </span>
        </div>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${COLORS.secondary}40, transparent)`,
          }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: `rgba(255, 255, 255, 0.3)` }}
        >
          {SECTION_CONTENT.members.length} Records
        </span>
      </div>

      {/* Eyebrow */}
      <p
        ref={addRef}
        className="mb-4 font-mono text-xs uppercase opacity-0 will-change-transform"
        style={{
          color: COLORS.secondary,
          letterSpacing: "0.25em",
        }}
      >
        {SECTION_CONTENT.eyebrow}
      </p>

      {/* Title */}
      <h2
        ref={addRef}
        className="mb-6 text-4xl font-bold text-white opacity-0 will-change-transform sm:text-5xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        {SECTION_CONTENT.title}
      </h2>

      {/* Intro */}
      <p
        ref={addRef}
        className="max-w-2xl text-base opacity-0 will-change-transform sm:text-lg"
        style={{
          color: `rgba(255, 255, 255, ${OPACITY.body})`,
          lineHeight: 1.75,
        }}
      >
        {SECTION_CONTENT.intro}
      </p>
    </div>
  );
});

/**
 * AvatarPlaceholder - Biometric-style avatar frame
 */
const AvatarPlaceholder = memo(function AvatarPlaceholder({
  initials,
  color,
  isHovered,
  scanLineRef,
}: {
  initials: string;
  color: string;
  isHovered: boolean;
  scanLineRef: RefObject<HTMLDivElement | null>;
}): JSX.Element {
  return (
    <div
      className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border-2 sm:h-28 sm:w-28"
      style={{
        borderColor: color,
        backgroundColor: `${color}10`,
      }}
    >
      {/* Corner targeting markers */}
      <div aria-hidden="true" className="pointer-events-none">
        <span
          className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2"
          style={{ borderColor: color }}
        />
        <span
          className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2"
          style={{ borderColor: color }}
        />
        <span
          className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2"
          style={{ borderColor: color }}
        />
        <span
          className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2"
          style={{ borderColor: color }}
        />
      </div>

      {/* Crosshair overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Horizontal line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
          style={{ backgroundColor: `${color}30` }}
        />
        {/* Vertical line */}
        <div
          className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
          style={{ backgroundColor: `${color}30` }}
        />
      </div>

      {/* Scan line (animated on hover) */}
      <div
        ref={scanLineRef}
        aria-hidden="true"
        className={`
          pointer-events-none absolute left-0 right-0 h-8
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{
          background: `linear-gradient(180deg, transparent, ${color}40, transparent)`,
          top: 0,
        }}
      />

      {/* Initials */}
      <span
        className="relative z-10 font-mono text-2xl font-bold sm:text-3xl"
        style={{ color }}
      >
        {initials}
      </span>

      {/* Scan status */}
      <span
        className={`
          absolute bottom-1 left-1 font-mono text-[8px] uppercase tracking-widest
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{ color }}
      >
        Scanning...
      </span>
    </div>
  );
});

/**
 * SkillBar - Animated skill/expertise bar
 */
const SkillBar = memo(function SkillBar({
  name,
  level,
  color,
  isVisible,
  index,
}: {
  name: string;
  level: number;
  color: string;
  isVisible: boolean;
  index: number;
}): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-20 font-mono text-[10px] uppercase tracking-wider"
        style={{ color: `rgba(255, 255, 255, 0.4)` }}
      >
        {name}
      </span>
      <div
        className="relative h-1.5 flex-1 overflow-hidden"
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
          style={{
            backgroundColor: color,
            width: isVisible ? `${level}%` : "0%",
            transitionDelay: `${index * 100}ms`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
        {/* Segment markers */}
        {[25, 50, 75].map((marker) => (
          <div
            key={marker}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${marker}%`,
              backgroundColor: `rgba(255, 255, 255, 0.1)`,
            }}
          />
        ))}
      </div>
      <span className="w-8 text-right font-mono text-[10px]" style={{ color }}>
        {level}%
      </span>
    </div>
  );
});

/**
 * ClearanceBadge - Security clearance indicator
 */
const ClearanceBadge = memo(function ClearanceBadge({
  level,
  color,
}: {
  level: string;
  color: string;
}): JSX.Element {
  return (
    <div
      className="inline-flex items-center gap-2 border px-2 py-0.5"
      style={{
        borderColor: `${color}60`,
        backgroundColor: `${color}10`,
      }}
    >
      <span className="h-1.5 w-1.5" style={{ backgroundColor: color }} />
      <span
        className="font-mono text-[9px] uppercase tracking-widest"
        style={{ color }}
      >
        {level} Clearance
      </span>
    </div>
  );
});

/**
 * StatusIndicator - Active/Inactive status
 */
const StatusIndicator = memo(function StatusIndicator({
  status,
}: {
  status: string;
}): JSX.Element {
  const isActive = status === "ACTIVE";
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 ${isActive ? "animate-pulse" : ""}`}
        style={{
          backgroundColor: isActive
            ? COLORS.success
            : `rgba(255, 255, 255, 0.3)`,
        }}
      />
      <span
        className="font-mono text-[9px] uppercase tracking-widest"
        style={{
          color: isActive ? COLORS.success : `rgba(255, 255, 255, 0.3)`,
        }}
      >
        {status}
      </span>
    </div>
  );
});

/**
 * MemberCard - Individual team member dossier card
 */
const MemberCard = memo(function MemberCard({
  member,
  index,
  isHovered,
  onHover,
  onLeave,
  cardRef,
}: MemberCardProps): JSX.Element {
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scanLineRef.current || !isHovered) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    // Scan line animation
    gsap.fromTo(
      scanLineRef.current,
      { top: 0 },
      {
        top: "100%",
        duration: ANIMATION.scanDuration,
        ease: "none",
        repeat: -1,
      },
    );

    return () => {
      gsap.killTweensOf(scanLineRef.current);
    };
  }, [isHovered]);

  return (
    <article
      ref={cardRef}
      className="group relative opacity-0 will-change-transform"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      {/* Dossier container */}
      <div
        className={`
          relative overflow-hidden border transition-all duration-500
          ${isHovered ? "border-opacity-100" : "border-opacity-40"}
        `}
        style={{
          backgroundColor: COLORS.panel,
          borderColor: isHovered ? member.color : `${member.color}60`,
          boxShadow: isHovered
            ? `0 0 30px ${member.color}15, 0 20px 40px rgba(0,0,0,0.3)`
            : "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* File tab */}
        <div
          className="absolute -top-px left-4 h-px w-16"
          style={{
            background: `linear-gradient(90deg, transparent, ${member.color}, transparent)`,
          }}
        />

        {/* Header bar */}
        <div
          className="flex items-center justify-between border-b px-4 py-2"
          style={{
            backgroundColor: `${member.color}08`,
            borderColor: `${member.color}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[10px] tracking-wider"
              style={{ color: member.color }}
            >
              FILE: {member.code}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ClearanceBadge level={member.clearance} color={member.color} />
            <StatusIndicator status={member.status} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex gap-6 p-6">
          {/* Avatar */}
          <AvatarPlaceholder
            initials={member.initials}
            color={member.color}
            isHovered={isHovered}
            scanLineRef={scanLineRef}
          />

          {/* Info */}
          <div className="flex-1">
            {/* Name */}
            <h3
              className="mb-1 text-xl font-semibold text-white sm:text-2xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {member.name}
            </h3>

            {/* Role */}
            <p
              className="mb-4 font-mono text-xs uppercase tracking-wider"
              style={{ color: member.color }}
            >
              {member.role}
            </p>

            {/* Bio */}
            <p
              className="mb-5 text-sm leading-relaxed"
              style={{
                color: `rgba(255, 255, 255, ${OPACITY.body})`,
                lineHeight: 1.65,
              }}
            >
              {member.bio}
            </p>

            {/* Skills */}
            <div className="space-y-2">
              <p
                className="mb-2 font-mono text-[9px] uppercase tracking-widest"
                style={{ color: `rgba(255, 255, 255, 0.3)` }}
              >
                Expertise Levels
              </p>
              {member.skills.map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={member.color}
                  isVisible={isHovered}
                  index={skillIndex}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom data strip */}
        <div
          className="flex items-center justify-between border-t px-4 py-2"
          style={{
            borderColor: `${member.color}15`,
            backgroundColor: `${member.color}05`,
          }}
        >
          <span
            className="font-mono text-[9px] tracking-wider"
            style={{ color: `rgba(255, 255, 255, 0.3)` }}
          >
            ID: {member.id.toUpperCase()}-{String(index + 1).padStart(3, "0")}
          </span>
          <div className="flex items-center gap-2">
            {/* Encoded data visualization */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-0.5"
                  style={{
                    backgroundColor:
                      i <
                      Math.floor(
                        (member.skills.reduce((a, b) => a + b.level, 0) / 100) *
                          8,
                      )
                        ? member.color
                        : `${member.color}30`,
                  }}
                />
              ))}
            </div>
            <span
              className="font-mono text-[9px] tracking-wider"
              style={{ color: `rgba(255, 255, 255, 0.3)` }}
            >
              VERIFIED
            </span>
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          aria-hidden="true"
          className={`
            pointer-events-none absolute inset-0 transition-opacity duration-500
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background: `radial-gradient(ellipse at 30% 0%, ${member.color}08, transparent 60%)`,
          }}
        />
      </div>

      {/* Connection line to next card */}
      {index < SECTION_CONTENT.members.length - 1 && (
        <div
          aria-hidden="true"
          className="absolute -bottom-6 left-1/2 hidden h-6 w-px -translate-x-1/2 lg:block"
          style={{
            background: `linear-gradient(180deg, ${member.color}40, ${SECTION_CONTENT.members[index + 1].color}40)`,
          }}
        />
      )}
    </article>
  );
});

/**
 * SystemMarkers - Corner atmospheric labels
 */
const SystemMarkers = memo(function SystemMarkers(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none font-mono text-[10px] tracking-widest text-white/10"
    >
      <span className="absolute left-4 top-4 sm:left-8 sm:top-8">
        {SECTION_CONTENT.systemLabel}
      </span>
      <span className="absolute right-4 top-4 flex items-center gap-2 sm:right-8 sm:top-8">
        <span className="h-1.5 w-1.5 animate-pulse bg-cyan-400" />
        DATABASE.CONNECTED
      </span>
      <span className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
        {SECTION_CONTENT.version}
      </span>
      <span className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8">
        ACCESS.GRANTED
      </span>
    </div>
  );
});

/**
 * AmbientEffects - Background glow effects
 */
const AmbientEffects = memo(function AmbientEffects(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-1/4 h-150 w-150 -translate-x-1/2"
        style={{
          background: `radial-gradient(circle, ${COLORS.secondary}06 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute -right-40 bottom-1/4 h-125 w-125"
        style={{
          background: `radial-gradient(circle, ${COLORS.accent}05 0%, transparent 60%)`,
        }}
      />
    </div>
  );
});

/**
 * CTAButton - Work with team call to action
 */
const CTAButton = memo(function CTAButton({
  text,
  href,
  ctaRef,
}: {
  text: string;
  href: string;
  ctaRef: RefObject<HTMLAnchorElement | null>;
}): JSX.Element {
  return (
    <div className="relative mt-16 flex justify-center lg:mt-20">
      <a
        ref={ctaRef}
        href={href}
        aria-label={text}
        className="group relative inline-flex items-center gap-3 overflow-hidden border px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19]"
        style={{
          borderColor: COLORS.secondary,
        }}
      >
        {/* Shimmer effect */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />

        {/* Text */}
        <span className="relative">{text}</span>

        {/* Arrow */}
        <span
          className="relative transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: COLORS.secondary }}
        >
          →
        </span>

        {/* Corner accents */}
        <span
          className="absolute -left-px -top-px h-3 w-3 border-l border-t"
          style={{ borderColor: COLORS.secondary }}
        />
        <span
          className="absolute -bottom-px -right-px h-3 w-3 border-b border-r"
          style={{ borderColor: COLORS.secondary }}
        />
      </a>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useTeamAnimations(refs: {
  sectionRef: RefObject<HTMLElement | null>;
  headerRefs: RefObject<HTMLElement[]>;
  cardRefs: RefObject<HTMLDivElement[]>;
  ctaRef: RefObject<HTMLAnchorElement | null>;
}): void {
  const { sectionRef, headerRefs, cardRefs, ctaRef } = refs;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headerRefs.current) gsap.set(headerRefs.current, { opacity: 1 });
        if (cardRefs.current) gsap.set(cardRefs.current, { opacity: 1 });
        if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1 });
        return;
      }

      // Header entrance
      if (headerRefs.current && headerRefs.current.length > 0) {
        gsap.fromTo(
          headerRefs.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION.entranceDuration,
            ease: "power2.out",
            stagger: ANIMATION.staggerDelay,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // Cards entrance (file reveal effect)
      if (cardRefs.current && cardRefs.current.length > 0) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, x: -40, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: ANIMATION.entranceDuration,
            ease: "power2.out",
            stagger: ANIMATION.cardStagger,
            scrollTrigger: {
              trigger: cardRefs.current[0],
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // CTA entrance
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, headerRefs, cardRefs, ctaRef]);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function TeamMembersSection({
  id = "team",
}: TeamMembersSectionProps): JSX.Element {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────

  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────

  const sectionRef = useRef<HTMLElement>(null);
  const headerRefs = useRef<HTMLElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // REF HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const addCardRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────

  useTeamAnimations({
    sectionRef,
    headerRefs,
    cardRefs,
    ctaRef,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative w-full overflow-hidden py-24 sm:py-32 lg:py-40"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background layers */}
      <BlueprintGrid />
      <ScanLines />
      <AmbientEffects />
      <SystemMarkers />

      {/* Content container */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Section header */}
        <PersonnelDatabaseHeader headerRefs={headerRefs} />

        {/* Team member cards */}
        <div className="space-y-2 lg:space-y-6 grid md:grid-cols-2  md:gap-2">
          {SECTION_CONTENT.members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              isHovered={hoveredMember === member.id}
              onHover={() => setHoveredMember(member.id)}
              onLeave={() => setHoveredMember(null)}
              cardRef={addCardRef}
            />
          ))}
        </div>

        {/* CTA */}
        <CTAButton
          text={SECTION_CONTENT.cta.text}
          href={SECTION_CONTENT.cta.href}
          ctaRef={ctaRef}
        />

        {/* Bottom accent */}
        <div
          aria-hidden="true"
          className="mx-auto mt-12 flex items-center justify-center gap-4"
        >
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.secondary}40)`,
            }}
          />
          <div className="flex items-center gap-1">
            {SECTION_CONTENT.members.map((member) => (
              <div
                key={member.id}
                className="h-1.5 w-1.5 transition-all duration-300"
                style={{
                  backgroundColor:
                    hoveredMember === member.id
                      ? member.color
                      : `${member.color}40`,
                  boxShadow:
                    hoveredMember === member.id
                      ? `0 0 8px ${member.color}`
                      : "none",
                }}
              />
            ))}
          </div>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, ${COLORS.secondary}40, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

TeamMembersSection.displayName = "TeamMembersSection";
