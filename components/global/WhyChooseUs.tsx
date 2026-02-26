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
// BRAND COLORS - LUXURY PALETTE
// ════════════════════════════════════════════════════════════════════

const colors = {
  primary: "#F59E0B",
  primaryLight: "#FBBF24",
  primaryDark: "#D97706",
  secondary: "#06B6D4",
  secondaryLight: "#22D3EE",
  accent: "#8B5CF6",
  accentLight: "#A78BFA",
  dark: "#030712",
  darkLighter: "#0F172A",
  darkCard: "#0A0F1C",
  gold: "#FFD700",
  platinum: "#E5E4E2",
  rose: "#F43F5E",
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface Feature {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  color: "primary" | "secondary" | "accent";
  metrics?: {
    value: string;
    label: string;
  };
  highlights?: string[];
}

interface WhyChooseUsProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  features?: Feature[];
}

// ════════════════════════════════════════════════════════════════════
// ICONS - LUXURY STYLE
// ════════════════════════════════════════════════════════════════════

const Icons = {
  performance: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  conversion: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
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
      <path d="m7 16 4-8 4 5 5-9" />
      <circle cx="20" cy="4" r="2" />
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
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 2.32.64 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
      <path d="M15.7 10.4 12 12l-3.7-1.6" />
      <path d="M12 12v4" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
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
  crown: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.5 19h19l-2-14-5.5 6L12 3l-2 8-5.5-6-2 14z" />
    </svg>
  ),
  diamond: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20" />
      <path d="M10 9l2-6 2 6" />
      <path d="M6 9l6 13 6-13" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

const defaultFeatures: Feature[] = [
  {
    id: "performance",
    number: "01",
    title: "Performance-Focused Development",
    description:
      "We optimize speed, Core Web Vitals, and mobile performance to ensure your website loads fast and ranks higher.",
    icon: Icons.performance,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/Performance-Focused+Development+.webp",
    color: "primary",
    metrics: {
      value: "<2s",
      label: "Load Time",
    },
    highlights: ["Core Web Vitals", "CDN Optimized", "Image Compression"],
  },
  {
    id: "conversion",
    number: "02",
    title: "Conversion-Driven Design",
    description:
      "Every section is designed with psychology, trust-building, and lead generation principles.",
    icon: Icons.conversion,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/Conversion-Driven+Design.webp",
    color: "secondary",
    metrics: {
      value: "3x",
      label: "More Leads",
    },
    highlights: ["A/B Tested", "Psychology-Based", "Trust Signals"],
  },
  {
    id: "ai",
    number: "03",
    title: "AI Automation That Saves Time",
    description:
      "We replace repetitive tasks with smart systems so your business scales faster with less manual work.",
    icon: Icons.ai,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/AI+Automation+That+Saves.webp",
    color: "accent",
    metrics: {
      value: "10h+",
      label: "Saved Weekly",
    },
    highlights: ["Smart Workflows", "Auto-responses", "Task Automation"],
  },
  {
    id: "seo",
    number: "04",
    title: "SEO From Day One",
    description:
      "We structure the website properly from the beginning to make Google indexing and ranking easier.",
    icon: Icons.seo,
    image:
      "https://cheetahnova.s3.eu-west-2.amazonaws.com/home/SEO+From+Day+One.webp",
    color: "primary",
    metrics: {
      value: "#1",
      label: "Rankings",
    },
    highlights: ["Schema Markup", "Meta Optimized", "Fast Indexing"],
  },
];

// ════════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════════

const getColor = (colorKey: "primary" | "secondary" | "accent") =>
  colors[colorKey];

const getGradient = (colorKey: "primary" | "secondary" | "accent") => {
  const gradients = {
    primary: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
    secondary: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryLight})`,
    accent: `linear-gradient(135deg, ${colors.accent}, ${colors.accentLight})`,
  };
  return gradients[colorKey];
};

// ════════════════════════════════════════════════════════════════════
// LUXURY BACKGROUND
// ════════════════════════════════════════════════════════════════════

const LuxuryBackground = memo(function LuxuryBackground() {
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
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = 60;
      const particleColors = [colors.primary, colors.secondary, colors.accent];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color:
            particleColors[Math.floor(Math.random() * particleColors.length)],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4,
        );
        gradient.addColorStop(0, particle.color + "30");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - particle.size * 4,
          particle.y - particle.size * 4,
          particle.size * 8,
          particle.size * 8,
        );
      });

      // Connect nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
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
      {/* Base Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${colors.accent}15 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 20% 30%, ${colors.primary}10 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 70%, ${colors.secondary}08 0%, transparent 50%),
            linear-gradient(180deg, ${colors.dark} 0%, ${colors.darkLighter} 50%, ${colors.dark} 100%)
          `,
        }}
      />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-70"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Premium Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)",
        }}
      />

      {/* Aurora Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 left-1/4 h-[800px] w-150 animate-aurora-1 opacity-30"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}40, transparent)`,
            filter: "blur(100px)",
            transform: "rotate(-15deg)",
          }}
        />
        <div
          className="absolute -top-1/3 right-1/4 h-150 w-[500px] animate-aurora-2 opacity-25"
          style={{
            background: `linear-gradient(180deg, ${colors.secondary}30, transparent)`,
            filter: "blur(100px)",
            transform: "rotate(15deg)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 h-[500px] w-[800px] animate-aurora-3 opacity-20"
          style={{
            background: `linear-gradient(180deg, ${colors.accent}25, transparent)`,
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* Luxury Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes aurora-1 {
          0%,
          100% {
            transform: rotate(-15deg) translateY(0) translateX(0);
          }
          25% {
            transform: rotate(-10deg) translateY(-30px) translateX(30px);
          }
          50% {
            transform: rotate(-20deg) translateY(-10px) translateX(-20px);
          }
          75% {
            transform: rotate(-12deg) translateY(20px) translateX(10px);
          }
        }
        @keyframes aurora-2 {
          0%,
          100% {
            transform: rotate(15deg) translateY(0) translateX(0);
          }
          33% {
            transform: rotate(20deg) translateY(40px) translateX(-30px);
          }
          66% {
            transform: rotate(10deg) translateY(-20px) translateX(20px);
          }
        }
        @keyframes aurora-3 {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateX(-50%) scale(1.1);
            opacity: 0.15;
          }
        }
        .animate-aurora-1 {
          animation: aurora-1 20s ease-in-out infinite;
        }
        .animate-aurora-2 {
          animation: aurora-2 25s ease-in-out infinite;
        }
        .animate-aurora-3 {
          animation: aurora-3 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FLOATING ELEMENTS
// ════════════════════════════════════════════════════════════════════

const FloatingElements = memo(function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Floating Geometric Shapes */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${6 + i}s`,
          }}
        >
          <div
            className="h-1 w-1 "
            style={{
              backgroundColor: [
                colors.primary,
                colors.secondary,
                colors.accent,
              ][i % 3],
              boxShadow: `0 0 20px ${[colors.primary, colors.secondary, colors.accent][i % 3]}60`,
              opacity: 0.6,
            }}
          />
        </div>
      ))}

      {/* Decorative Lines */}
      <svg
        className="absolute right-10 top-20 h-40 w-40 opacity-10"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
        <path
          d="M10 90 Q 50 10 90 50"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.5"
          strokeDasharray="4,4"
        />
      </svg>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-25px) rotate(3deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

 
// ════════════════════════════════════════════════════════════════════
// ANIMATED HEADLINE
// ════════════════════════════════════════════════════════════════════

const AnimatedHeadline = memo(function AnimatedHeadline({
  headline,
  isVisible,
}: {
  headline: string;
  isVisible: boolean;
}) {
  const words = headline.split(" ");
  const highlightWords = ["Choose", "Businesses"];

  return (
    <h2 className="mb-6 text-center text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl  ">
      {words.map((word, i) => {
        const isHighlight = highlightWords.includes(word);
        return (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0) rotateX(0)"
                : "translateY(40px) rotateX(-20deg)",
              transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${0.1 + i * 0.08}s`,
            }}
          >
            {isHighlight ? (
              <span
                className="relative bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 5s ease-in-out infinite",
                }}
              >
                {word}
                <span
                  className="absolute -bottom-2 left-0 h-1 w-full "
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.5 + i * 0.08}s`,
                  }}
                />
              </span>
            ) : (
              word
            )}{" "}
          </span>
        );
      })}

      <style jsx>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </h2>
  );
});

// ════════════════════════════════════════════════════════════════════
// LUXURY FEATURE CARD
// ════════════════════════════════════════════════════════════════════

const LuxuryFeatureCard = memo(function LuxuryFeatureCard({
  feature,
  index,
  isVisible,
  isActive,
  onHover,
}: {
  feature: Feature;
  index: number;
  isVisible: boolean;
  isActive: boolean;
  onHover: (id: string | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const color = getColor(feature.color);
  const gradient = getGradient(feature.color);

  useEffect(() => {
    if (!cardRef.current || !isVisible) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 80,
        rotateX: -10,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1,
        delay: index * 0.2,
        ease: "power4.out",
      },
    );
  }, [isVisible, index]);

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Card Glow Effect */}

      {/* Main Card */}
      <div
        className="relative overflow-hidden  border transition-all duration-700"
        style={{
          borderColor: isActive ? `${color}50` : "rgba(255,255,255,0.06)",
          background: isActive
            ? `linear-gradient(135deg, ${color}10, rgba(0,0,0,0.4))`
            : "rgba(255,255,255,0.02)",
          transform: isActive
            ? "translateY(-12px) scale(1.02)"
            : "translateY(0) scale(1)",
          boxShadow: isActive
            ? `0 50px 100px -20px ${color}30, 0 30px 60px -30px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Premium Glass Overlay */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}08, transparent 60%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative p-6 md:p-8">
          {/* Top Row - Number & Badge */}
          <div className="mb-6 flex items-center justify-between">
            {/* Number with fancy styling */}
            <div className="relative">
              <span
                className="font-mono text-5xl font-black opacity-10 transition-all duration-300 group-hover:opacity-20"
                style={{ color }}
              >
                {feature.number}
              </span>
            </div>

            {/* Metric Badge */}
            {feature.metrics && (
              <div
                className="relative overflow-hidden border px-4 py-2 backdrop-blur-md transition-all duration-500"
                style={{
                  borderColor: isActive
                    ? `${color}40`
                    : "rgba(255,255,255,0.08)",
                  background: isActive
                    ? `${color}15`
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl font-black transition-all duration-300"
                    style={{
                      color: isActive ? color : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {feature.metrics.value}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                      {feature.metrics.label}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Container */}
          <div
            ref={imageRef}
            className="relative mb-6 overflow-hidden "
            style={{
              height: "220px",
              boxShadow: isActive
                ? `0 20px 60px -15px ${color}40, inset 0 0 0 1px ${color}30`
                : "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Image Overlays */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${color}30 0%, transparent 50%, rgba(0,0,0,0.7) 100%)`,
                opacity: isActive ? 0.8 : 0.5,
              }}
            />

            {/* Floating Icon */}
            <div
              className="absolute -right-2 -top-2 flex h-16 w-16 items-center justify-center  border-2 shadow-2xl backdrop-blur-xl transition-all duration-500"
              style={{
                borderColor: isActive ? color : "rgba(255,255,255,0.1)",
                background: isActive ? gradient : "rgba(15, 20, 32, 0.95)",
                transform: isActive
                  ? "rotate(10deg) scale(1.15)"
                  : "rotate(0deg) scale(1)",
                boxShadow: isActive
                  ? `0 20px 40px -10px ${color}60`
                  : "0 10px 30px -5px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="h-8 w-8 transition-all duration-300"
                style={{
                  color: isActive ? "#000" : color,
                  filter: isActive
                    ? "none"
                    : `drop-shadow(0 0 10px ${color}60)`,
                }}
              >
                {feature.icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className="mb-3 text-xl font-bold text-white transition-all duration-300 md:text-2xl"
            style={{
              textShadow: isActive ? `0 0 30px ${color}30` : "none",
            }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p className="mb-5 text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/70 md:text-base">
            {feature.description}
          </p>

          {/* Highlights */}
          {feature.highlights && (
            <div className="mb-5 flex flex-wrap gap-2">
              {feature.highlights.map((highlight, i) => (
                <span
                  key={i}
                  className=" border px-3 py-1 text-xs font-medium transition-all duration-300"
                  style={{
                    borderColor: isActive
                      ? `${color}40`
                      : "rgba(255,255,255,0.08)",
                    background: isActive ? `${color}15` : "transparent",
                    color: isActive ? color : "rgba(255,255,255,0.5)",
                  }}
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {/* CTA Link */}
          <div className="flex items-center justify-between">
            <button
              className="group/btn flex items-center gap-2 text-sm font-semibold transition-all duration-300"
              style={{ color: isActive ? color : "rgba(255,255,255,0.4)" }}
            >
              <span>Explore Feature</span>
              <span
                className="flex h-6 w-6 items-center justify-center  border transition-all duration-300"
                style={{
                  borderColor: isActive
                    ? `${color}50`
                    : "rgba(255,255,255,0.1)",
                  background: isActive ? `${color}20` : "transparent",
                  transform: isActive ? "translateX(4px)" : "translateX(0)",
                }}
              >
                <span className="h-3 w-3">{Icons.arrowUpRight}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute right-0 top-0 h-20 w-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
            <path
              d="M80 0 L80 80 L0 80"
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.3"
              fill="none"
            />
          </svg>
        </div>

        {/* Bottom Accent */}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-700"
          style={{
            width: isActive ? "100%" : "0%",
            background: gradient,
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// COMPARISON SECTION
// ════════════════════════════════════════════════════════════════════

const ComparisonSection = memo(function ComparisonSection({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const comparisons = [
    { others: "Template-based designs", us: "Custom-crafted solutions" },
    { others: "Slow loading times", us: "Lightning-fast performance" },
    { others: "Generic content", us: "Conversion-optimized copy" },
    { others: "Basic SEO", us: "Advanced SEO from day one" },
  ];

  return (
    <div
      className="mx-auto mb-16 max-w-4xl"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s",
      }}
    >
      <div
        className="relative overflow-hidden  border p-8 backdrop-blur-xl"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-white/40">
            <div className="h-3 w-3  border border-white/30" />
            <span className="text-sm font-medium">Others</span>
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center  text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}30)`,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            VS
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 "
              style={{
                background: colors.primary,
                boxShadow: `0 0 15px ${colors.primary}60`,
              }}
            />
            <span
              className="bg-clip-text text-sm font-semibold text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Our Approach
            </span>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="space-y-4">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.7 + index * 0.1}s`,
              }}
            >
              {/* Others */}
              <div className="flex items-center justify-end gap-2 text-right">
                <span className="text-sm text-white/40 line-through decoration-rose-500/50">
                  {item.others}
                </span>
                <span className="h-4 w-4 text-rose-500/60">✕</span>
              </div>

              {/* Divider */}
              <div
                className="h-8 w-px"
                style={{
                  background: `linear-gradient(180deg, transparent, ${colors.primary}50, transparent)`,
                }}
              />

              {/* Us */}
              <div className="flex items-center gap-2">
                <span className="h-4 w-4" style={{ color: colors.primary }}>
                  {Icons.check}
                </span>
                <span className="text-sm font-medium text-white">
                  {item.us}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// FEATURE HIGHLIGHTS BAR
// ════════════════════════════════════════════════════════════════════

const FeatureHighlightsBar = memo(function FeatureHighlightsBar({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const highlights = [
    { icon: Icons.zap, text: "Lightning Fast", color: colors.primary },
    { icon: Icons.check, text: "SEO Optimized", color: colors.secondary },
    { icon: Icons.check, text: "Mobile First", color: colors.accent },
    { icon: Icons.check, text: "Conversion Ready", color: colors.primary },
    { icon: Icons.sparkle, text: "AI Powered", color: colors.secondary },
  ];

  return (
    <div
      className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
      }}
    >
      {highlights.map((item, index) => (
        <div
          key={index}
          className="group flex items-center gap-2 text-sm transition-all duration-300 hover:scale-110"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(10px)",
            transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.9 + index * 0.1}s`,
          }}
        >
          <span
            className="h-5 w-5 transition-all duration-300 group-hover:scale-125"
            style={{
              color: item.color,
              filter: `drop-shadow(0 0 8px ${item.color}60)`,
            }}
          >
            {item.icon}
          </span>
          <span className="font-medium text-white/60 transition-colors duration-300 group-hover:text-white">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({
  headline = "Why Businesses Choose Us",
  subheadline = "The Difference That Drives Results",
  description = "Most websites look good but fail to generate results. We build websites with performance, SEO, and automation in mind. Your website will not only represent your brand — it will actively work for your business.",
  features = defaultFeatures,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Intersection Observer with threshold stages
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleFeatureHover = useCallback((id: string | null) => {
    setActiveFeature(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: colors.dark }}
      aria-labelledby="why-choose-us-heading"
    >
      <LuxuryBackground />
      <FloatingElements />

      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Section Header */}
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <AnimatedHeadline headline={headline} isVisible={isVisible} />

          {/* Description */}
          <p
            className="mx-auto max-w-2xl text-base leading-relaxed text-white/50 md:text-lg lg:text-xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
            }}
          >
            {description}
          </p>
        </div>

        {/* Comparison Section */}
        <ComparisonSection isVisible={isVisible} />

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {features.map((feature, index) => (
            <LuxuryFeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isVisible={isVisible}
              isActive={activeFeature === feature.id}
              onHover={handleFeatureHover}
            />
          ))}
        </div>

        {/* Feature Highlights */}
        <FeatureHighlightsBar isVisible={isVisible} />
      </div>

      {/* Decorative Corner Elements */}
      <div className="pointer-events-none absolute bottom-8 right-8 hidden opacity-20 lg:block">
        <div
          className="h-32 w-px"
          style={{
            background: `linear-gradient(0deg, ${colors.accent}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-px w-32"
          style={{
            background: `linear-gradient(270deg, ${colors.accent}, transparent)`,
          }}
        />
      </div>

      <div className="pointer-events-none absolute left-8 top-8 hidden opacity-20 lg:block">
        <div
          className="h-32 w-px"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 h-px w-32"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default memo(WhyChooseUs);
export type { WhyChooseUsProps, Feature };
