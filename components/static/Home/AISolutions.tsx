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
import Link from "next/link";

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface AISolution {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: { label: string; value: string };
  status: "active" | "processing" | "ready";
  gradient: string;
  size?: "normal" | "large";
}

interface AISolutionsConfig {
  tag: string;
  headline: string;
  description: string;
  solutions: AISolution[];
  cta: {
    label: string;
    href: string;
  };
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  chat: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  ),
  filter: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
      <circle cx="14" cy="15" r="3" />
      <path d="M14 12v6" />
    </svg>
  ),
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  chart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
      <circle cx="18" cy="6" r="2" fill="currentColor" />
    </svg>
  ),
  pencil: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      <path d="M15 6l3 3" />
    </svg>
  ),
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  brain: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .47 4.96 2.5 2.5 0 0 0 2.96 1.98 2.5 2.5 0 0 0 3.51.02" />
      <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-.47 4.96 2.5 2.5 0 0 1-2.96 1.98 2.5 2.5 0 0 1-3.51.02" />
      <path d="M12 4.5V12" />
      <path d="M8 9l4 3 4-3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M12 15v-3" />
    </svg>
  ),
  sparkles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" />
      <circle cx="12" cy="12" r="4" />
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
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  terminal: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════

const defaultConfig: AISolutionsConfig = {
  tag: "AI-Powered Solutions",
  headline: "AI Tools Built Specifically for Your Business",
  description:
    "Every business has different customers, different workflows, and different needs. That's why we don't sell generic AI solutions. We design and develop AI tools that match your exact industry and customer journey.",
  solutions: [
    {
      id: "chatbot",
      number: "01",
      title: "AI Customer Support Agent",
      description:
        "Automated chatbot trained for your business that answers customer questions instantly and professionally.",
      icon: Icons.chat,
      stats: { label: "Avg Response", value: "< 2s" },
      status: "active",
      gradient: "from-emerald-500 to-cyan-500",
      size: "large",
    },
    {
      id: "lead",
      number: "02",
      title: "AI Lead Qualification",
      description:
        "Filters leads automatically and identifies high-value customers before they reach your sales team.",
      icon: Icons.filter,
      stats: { label: "Accuracy", value: "94%" },
      status: "processing",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "booking",
      number: "03",
      title: "AI Booking Automation",
      description:
        "Turns your website into a booking machine with automated scheduling and smart reminders.",
      icon: Icons.calendar,
      stats: { label: "Time Saved", value: "12h/wk" },
      status: "ready",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: "analytics",
      number: "04",
      title: "AI Analytics Dashboard",
      description:
        "Tracks performance, customer behavior, conversions, and delivers growth insights in real-time.",
      icon: Icons.chart,
      stats: { label: "Data Points", value: "50+" },
      status: "active",
      gradient: "from-cyan-500 to-blue-500",
      size: "large",
    },
    {
      id: "content",
      number: "05",
      title: "AI Content Generator",
      description:
        "Generates SEO-friendly content based on your services, location, and keyword strategy.",
      icon: Icons.pencil,
      stats: { label: "Words/Min", value: "500+" },
      status: "processing",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "sales",
      number: "06",
      title: "AI Sales Assistant",
      description:
        "Guides visitors through your services and helps convert them into paying clients automatically.",
      icon: Icons.users,
      stats: { label: "Conv. Boost", value: "+35%" },
      status: "active",
      gradient: "from-indigo-500 to-violet-500",
    },
  ],
  cta: {
    label: "Request an AI Demo",
    href: "/contact?demo=ai",
  },
};

// ════════════════════════════════════════════════════════════════════
// NEURAL NETWORK BACKGROUND
// ════════════════════════════════════════════════════════════════════

const NeuralBackground = memo(function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      nodes = [];
      const nodeCount = Math.floor(
        (canvas.offsetWidth * canvas.offsetHeight) / 25000,
      );

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1;

        // Draw connections
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
});

// ════════════════════════════════════════════════════════════════════
// TYPING EFFECT COMPONENT
// ════════════════════════════════════════════════════════════════════

const TypingText = memo(function TypingText({
  text,
  isActive,
  speed = 30,
}: {
  text: string;
  isActive: boolean;
  speed?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayText("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isActive, text, speed]);

  return (
    <span>
      {displayText}
      {isTyping && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />
      )}
    </span>
  );
});

// ════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ════════════════════════════════════════════════════════════════════

const StatusBadge = memo(function StatusBadge({
  status,
}: {
  status: "active" | "processing" | "ready";
}) {
  const config = {
    active: {
      color: "#10B981",
      label: "Active",
      pulse: true,
    },
    processing: {
      color: "#F59E0B",
      label: "Processing",
      pulse: true,
    },
    ready: {
      color: "#06B6D4",
      label: "Ready",
      pulse: false,
    },
  };

  const { color, label, pulse } = config[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// AI SOLUTION CARD
// ════════════════════════════════════════════════════════════════════

const AISolutionCard = memo(function AISolutionCard({
  solution,
  index,
  isVisible,
}: {
  solution: AISolution;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!cardRef.current || !isVisible) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power3.out",
      },
    );
  }, [isVisible, index]);

  // Handle interactions
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setIsActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTimeout(() => setIsActive(false), 300);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        group relative overflow-hidden border backdrop-blur-sm
        transition-all duration-500 cursor-pointer
        ${solution.size === "large" ? "md:col-span-2" : ""}
      `}
      style={{
        opacity: 0,
        backgroundColor: isHovered
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.01)",
        borderColor: isHovered
          ? "rgba(255,255,255,0.15)"
          : "rgba(255,255,255,0.06)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient Background */}
      <div
        className={`
          absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500
          ${solution.gradient}
        `}
        style={{ opacity: isHovered ? 0.05 : 0 }}
      />

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.1 : 0,
          backgroundImage: `
            linear-gradient(90deg, currentColor 1px, transparent 1px),
            linear-gradient(currentColor 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          {/* Icon */}
          <div
            className="relative flex h-14 w-14 items-center justify-center border transition-all duration-300"
            style={{
              borderColor: isHovered
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.08)",
              backgroundColor: isHovered
                ? "rgba(255,255,255,0.05)"
                : "transparent",
            }}
          >
            <div
              className={`
                h-7 w-7 transition-all duration-300
                ${isHovered ? `bg-linear-to-br ${solution.gradient} bg-clip-text` : ""}
              `}
              style={{
                color: isHovered ? "transparent" : "rgba(255,255,255,0.6)",
              }}
            >
              {!isHovered ? (
                solution.icon
              ) : (
                <div
                  className={`h-7 w-7 bg-linear-to-br ${solution.gradient} [mask-image:var(--icon)] [mask-size:contain] [mask-repeat:no-repeat]`}
                >
                  <div className="h-full w-full" style={{ color: "white" }}>
                    {solution.icon}
                  </div>
                </div>
              )}
            </div>

            {/* Pulse Ring */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                animation: isHovered
                  ? "pulse-ring 2s ease-out infinite"
                  : "none",
              }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${solution.gradient} opacity-20`}
              />
            </div>
          </div>

          {/* Status + Number */}
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={solution.status} />
            <span className="font-mono text-xs text-white/20">
              {solution.number}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-lg font-bold text-white lg:text-xl">
          {isActive && isHovered ? (
            <TypingText text={solution.title} isActive={true} speed={25} />
          ) : (
            solution.title
          )}
        </h3>

        {/* Description */}
        <p className="mb-6 flex-1 text-sm leading-relaxed text-white/50">
          {solution.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 flex items-center justify-center border transition-colors duration-300"
              style={{
                borderColor: isHovered
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <span className="h-4 w-4 text-white/40">{Icons.terminal}</span>
            </div>
            <div>
              <span className="block text-xs text-white/40">
                {solution.stats.label}
              </span>
              <span
                className={`
                  block text-sm font-bold transition-colors duration-300
                  ${isHovered ? "text-white" : "text-white/70"}
                `}
              >
                {solution.stats.value}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div
            className="flex h-10 w-10 items-center justify-center border transition-all duration-300"
            style={{
              borderColor: isHovered ? "rgba(255,255,255,0.2)" : "transparent",
              backgroundColor: isHovered
                ? "rgba(255,255,255,0.05)"
                : "transparent",
              transform: isHovered ? "translateX(0)" : "translateX(-10px)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <span className="h-4 w-4 text-white">{Icons.arrow}</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className={`
          absolute inset-x-0 bottom-0 h-1 bg-linear-to-r
          ${solution.gradient}
          origin-left transition-transform duration-500
        `}
        style={{ transform: isHovered ? "scaleX(1)" : "scaleX(0)" }}
      />

      {/* Corner Accents */}
      <div
        className="absolute -right-px -top-px h-6 w-6 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.1) 50%)`,
        }}
      />

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// LIVE DEMO PREVIEW
// ════════════════════════════════════════════════════════════════════

const LiveDemoPreview = memo(function LiveDemoPreview({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  const conversation = useMemo(
    () => [
      { role: "user" as const, text: "What services do you offer?" },
      {
        role: "ai" as const,
        text: "We specialize in web design, SEO optimization, and AI automation tools. How can I help you today?",
      },
      { role: "user" as const, text: "I need help with SEO" },
      {
        role: "ai" as const,
        text: "Great choice! Our SEO service includes technical audits, keyword research, and monthly reporting. Want to schedule a free consultation?",
      },
    ],
    [],
  );

  useEffect(() => {
    if (!isVisible) return;

    let messageIndex = 0;
    const addMessage = () => {
      if (messageIndex >= conversation.length) {
        // Reset after delay
        setTimeout(() => {
          setMessages([]);
          messageIndex = 0;
          addMessage();
        }, 3000);
        return;
      }

      const msg = conversation[messageIndex];

      if (msg.role === "ai") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, msg]);
          messageIndex++;
          setTimeout(addMessage, 2000);
        }, 1500);
      } else {
        setMessages((prev) => [...prev, msg]);
        messageIndex++;
        setTimeout(addMessage, 1000);
      }
    };

    const timeout = setTimeout(addMessage, 1000);
    return () => clearTimeout(timeout);
  }, [isVisible, conversation]);

  return (
    <div
      className="relative overflow-hidden border border-white/[0.06] bg-[#0A0C12]/80 backdrop-blur-xl"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease 0.4s",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-linear-to-br from-violet-500 to-purple-500">
            <span className="h-4 w-4 text-white">{Icons.brain}</span>
          </div>
          <div>
            <span className="block text-sm font-semibold text-white">
              AI Assistant
            </span>
            <span className="block text-[10px] text-emerald-400">● Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/30">LIVE DEMO</span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-64 overflow-hidden p-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{
                animation: "slideIn 0.3s ease",
              }}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2.5 text-sm
                  ${
                    msg.role === "user"
                      ? "bg-linear-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-white"
                      : "bg-white/[0.03] border border-white/[0.06] text-white/80"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-white/40"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-white/40"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-white/40"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 border border-white/[0.08] bg-white/2 px-4 py-3">
            <span className="text-sm text-white/30">Type your message...</span>
          </div>
          <button className="flex h-12 w-12 items-center justify-center bg-linear-to-r from-violet-500 to-purple-500 transition-transform hover:scale-105">
            <span className="h-4 w-4 text-white">{Icons.arrow}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ════════════════════════════════════════════════════════════════════

const SectionHeader = memo(function SectionHeader({
  tag,
  headline,
  description,
  isVisible,
}: {
  tag: string;
  headline: string;
  description: string;
  isVisible: boolean;
}) {
  return (
    <div className="relative">
      {/* Tag */}
      <div
        className="mb-6 inline-flex items-center gap-2 border border-violet-500/30 bg-violet-500/10 px-4 py-2"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}
      >
        <span className="h-4 w-4 text-violet-400">{Icons.brain}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          {tag}
        </span>
      </div>

      {/* Headline */}
      <h2
        className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease 0.1s",
        }}
      >
        {headline}
      </h2>

      {/* Description */}
      <p
        className="mt-6 max-w-2xl text-base leading-relaxed text-white/50 lg:text-lg"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.2s",
        }}
      >
        {description}
      </p>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// CTA BUTTON
// ════════════════════════════════════════════════════════════════════

const CTAButton = memo(function CTAButton({
  label,
  href,
  isVisible,
}: {
  label: string;
  href: string;
  isVisible: boolean;
}) {
  return (
    <div
      className="flex justify-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease 0.6s",
      }}
    >
      <Link
        href={href}
        className="group relative inline-flex items-center gap-4 overflow-hidden bg-linear-to-r from-violet-500 to-purple-500 px-8 py-5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/30"
      >
        {/* Play Icon */}
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <span className="h-3 w-3 translate-x-0.5 text-white">
            {Icons.play}
          </span>
        </span>

        <span>{label}</span>

        <span className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
          {Icons.arrow}
        </span>

        {/* Shine Effect */}
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// STATS BAR
// ════════════════════════════════════════════════════════════════════

const StatsBar = memo(function StatsBar({ isVisible }: { isVisible: boolean }) {
  const stats = [
    { value: "10x", label: "Faster Response" },
    { value: "24/7", label: "Availability" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "50%", label: "Cost Reduction" },
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-6 border-y border-white/[0.04] py-6 md:gap-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease 0.5s",
      }}
    >
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          <div className="flex items-center gap-3">
            <span className="bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              {stat.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
              {stat.label}
            </span>
          </div>
          {i < stats.length - 1 && (
            <div className="hidden h-8 w-px bg-white/10 md:block" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

const AISolutions: React.FC<{ config?: AISolutionsConfig }> = ({
  config = defaultConfig,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
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
      id="ai-solutions"
      className="relative overflow-hidden bg-[#08090C] py-20 md:py-32"
      aria-labelledby="ai-headline"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <NeuralBackground />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#08090C] via-transparent to-[#08090C]" />

        {/* Side Gradients */}
        <div
          className="absolute left-0 top-1/2 h-[600px] w-[400px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute right-0 top-1/2 h-[600px] w-[400px] -translate-y-1/2 translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-[99%] md:max-w-[95%] px-4">
        {/* Header + Demo Grid */}
        <div className="mb-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Header */}
          <SectionHeader
            tag={config.tag}
            headline={config.headline}
            description={config.description}
            isVisible={isVisible}
          />

          {/* Right: Live Demo */}
          <LiveDemoPreview isVisible={isVisible} />
        </div>

        {/* Stats Bar */}
        <StatsBar isVisible={isVisible} />

        {/* Solutions Grid - Bento Style */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.solutions.map((solution, index) => (
            <AISolutionCard
              key={solution.id}
              solution={solution}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16">
          <CTAButton
            label={config.cta.label}
            href={config.cta.href}
            isVisible={isVisible}
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute bottom-20 left-10 hidden opacity-2 lg:block">
        <span className="font-mono text-[200px] font-bold leading-none text-white">
          AI
        </span>
      </div>

      {/* Border Lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════

export default memo(AISolutions);
export type { AISolutionsConfig, AISolution };
