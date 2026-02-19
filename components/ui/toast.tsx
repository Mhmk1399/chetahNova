// toast.tsx
"use client";

import React, { useEffect, useState } from "react";
import toast, {
  Toaster,
  Toast as HotToast,
  ToastOptions,
} from "react-hot-toast";

// ============ TYPES ============
export type ToastType = "success" | "error" | "warning" | "default";

export interface CustomToastProps {
  type: ToastType;
  title: string;
  message?: string;
  t: HotToast;
}

export interface ToastContainerProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

// ============ STYLE CONFIGURATIONS ============
const toastStyles: Record<
  ToastType,
  {
    accent: string;
    accentRgb: string;
    icon: string;
    gradientFrom: string;
    gradientTo: string;
    borderClass: string;
    glowClass: string;
    iconBg: string;
    particleColor: string;
  }
> = {
  success: {
    accent: "#30C0C0",
    accentRgb: "48, 192, 192",
    icon: "✓",
    gradientFrom: "from-teal-500/20",
    gradientTo: "to-cyan-500/10",
    borderClass: "border-teal-500/30",
    glowClass: "shadow-teal-500/30",
    iconBg: "bg-gradient-to-br from-teal-400 to-cyan-500",
    particleColor: "#30C0C0",
  },
  error: {
    accent: "#E05050",
    accentRgb: "224, 80, 80",
    icon: "✕",
    gradientFrom: "from-red-500/20",
    gradientTo: "to-rose-500/10",
    borderClass: "border-red-500/30",
    glowClass: "shadow-red-500/30",
    iconBg: "bg-gradient-to-br from-red-400 to-rose-500",
    particleColor: "#E05050",
  },
  warning: {
    accent: "#E0A030",
    accentRgb: "224, 160, 48",
    icon: "!",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-orange-500/10",
    borderClass: "border-amber-500/30",
    glowClass: "shadow-amber-500/30",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    particleColor: "#E0A030",
  },
  default: {
    accent: "#30A0D0",
    accentRgb: "48, 160, 208",
    icon: "i",
    gradientFrom: "from-blue-500/20",
    gradientTo: "to-cyan-500/10",
    borderClass: "border-blue-500/30",
    glowClass: "shadow-blue-500/30",
    iconBg: "bg-gradient-to-br from-blue-400 to-cyan-500",
    particleColor: "#30A0D0",
  },
};

// ============ PARTICLE RING SVG COMPONENT ============
const ParticleRing: React.FC<{ color: string; size?: number }> = ({
  color,
  size = 44,
}) => {
  const particles = React.useMemo(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 30 * (Math.PI / 180);
      const radius = size / 2 - 2;
      const x = size / 2 + Math.cos(angle) * radius;
      const y = size / 2 + Math.sin(angle) * radius;
      const particleSize = i % 3 === 0 ? 1.5 : 1;
      const opacity = i % 2 === 0 ? 0.8 : 0.4;
      items.push({ x, y, size: particleSize, opacity, angle: i * 30 });
    }
    return items;
  }, [size]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 animate-spin-slow"
      style={{ animationDuration: "20s" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 4}
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.3"
      />
      {particles.map((particle, i) => (
        <circle
          key={i}
          cx={particle.x}
          cy={particle.y}
          r={particle.size}
          fill={color}
          opacity={particle.opacity}
          className="animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </svg>
  );
};

// ============ GLOWING ORB COMPONENT ============
const GlowingOrb: React.FC<{ style: typeof toastStyles.success }> = ({
  style,
}) => {
  return (
    <div className="relative w-11 h-11 flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-md animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, rgba(${style.accentRgb}, 0.6) 0%, transparent 70%)`,
        }}
      />

      {/* Particle ring */}
      <ParticleRing color={style.particleColor} size={44} />

      {/* Main orb */}
      <div
        className={`relative w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center shadow-lg`}
        style={{
          boxShadow: `0 0 20px rgba(${style.accentRgb}, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)`,
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute inset-0.5 rounded-full opacity-30"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
          }}
        />

        {/* Icon */}
        <span className="relative z-10 text-white font-bold text-sm">
          {style.icon}
        </span>

        {/* Satellite dot */}
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-orbit"
          style={{
            boxShadow: `0 0 6px ${style.accent}`,
          }}
        />
      </div>
    </div>
  );
};

// ============ TRAPEZOID FRAME COMPONENT ============
const TrapezoidFrame: React.FC<{ color: string; side: "left" | "right" }> = ({
  color,
  side,
}) => {
  const transform = side === "left" ? "scaleX(1)" : "scaleX(-1)";

  return (
    <svg
      width="8"
      height="40"
      viewBox="0 0 8 40"
      className="opacity-40"
      style={{ transform }}
    >
      <path
        d="M0 4 L4 0 L8 0 L8 40 L4 40 L0 36 Z"
        fill="none"
        stroke={color}
        strokeWidth="0.75"
      />
      <path d="M2 8 L4 6 L6 6 L6 34 L4 34 L2 32 Z" fill={color} opacity="0.1" />
    </svg>
  );
};

// ============ CUSTOM TOAST COMPONENT ============
const CustomToast: React.FC<CustomToastProps> = ({
  type,
  title,
  message,
  t,
}) => {
  const style = toastStyles[type];
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) =>
        setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3 min-w-[320px] max-w-105
        rounded-xl backdrop-blur-xl
        bg-linear-to-br ${style.gradientFrom} ${style.gradientTo}
        border ${style.borderClass}
        shadow-2xl ${style.glowClass}
        ${t.visible ? "animate-toast-enter" : "animate-toast-exit"}
        ${prefersReducedMotion ? "motion-reduce" : ""}
      `}
      style={{
        background: `
          linear-gradient(135deg, rgba(8, 8, 16, 0.9) 0%, rgba(11, 15, 20, 0.95) 100%),
          linear-gradient(135deg, rgba(${style.accentRgb}, 0.1) 0%, transparent 50%)
        `,
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 40px -10px rgba(${style.accentRgb}, 0.3),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
          inset 0 -1px 0 0 rgba(0, 0, 0, 0.2)
        `,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Glassmorphism overlay */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left trapezoid frame */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2">
        <TrapezoidFrame color={style.accent} side="left" />
      </div>

      {/* Right trapezoid frame */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <TrapezoidFrame color={style.accent} side="right" />
      </div>

      {/* Glowing orb icon */}
      <div className={prefersReducedMotion ? "" : "animate-breathe"}>
        <GlowingOrb style={style} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pl-1">
        <h4 className="text-sm font-semibold text-gray-100 truncate">
          {title}
        </h4>
        {message && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="
          relative shrink-0 w-6 h-6 rounded-full
          flex items-center justify-center
          text-gray-500 hover:text-gray-300
          transition-colors duration-200
          hover:bg-white/5
          focus:outline-none focus:ring-1 focus:ring-white/20
        "
        aria-label="Dismiss notification"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M9 3L3 9M3 3L9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
        style={{
          borderTop: `1px solid rgba(${style.accentRgb}, 0.3)`,
          borderLeft: `1px solid rgba(${style.accentRgb}, 0.3)`,
          borderTopLeftRadius: "12px",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          borderBottom: `1px solid rgba(${style.accentRgb}, 0.3)`,
          borderRight: `1px solid rgba(${style.accentRgb}, 0.3)`,
          borderBottomRightRadius: "12px",
        }}
      />

      {/* Progress bar for auto-dismiss */}
      {t.duration && t.duration !== Infinity && (
        <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden bg-white/5">
          <div
            className="h-full rounded-full animate-progress"
            style={{
              background: `linear-gradient(90deg, transparent, ${style.accent})`,
              animationDuration: `${t.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// ============ TOAST FUNCTIONS ============
const baseOptions: ToastOptions = {
  duration: 4000,
  position: "top-right",
};

export const showToast = {
  success: (title: string, message?: string, options?: ToastOptions) => {
    return toast.custom(
      (t) => (
        <CustomToast type="success" title={title} message={message} t={t} />
      ),
      { ...baseOptions, ...options },
    );
  },

  error: (title: string, message?: string, options?: ToastOptions) => {
    return toast.custom(
      (t) => <CustomToast type="error" title={title} message={message} t={t} />,
      { ...baseOptions, duration: 5000, ...options },
    );
  },

  warning: (title: string, message?: string, options?: ToastOptions) => {
    return toast.custom(
      (t) => (
        <CustomToast type="warning" title={title} message={message} t={t} />
      ),
      { ...baseOptions, ...options },
    );
  },

  default: (title: string, message?: string, options?: ToastOptions) => {
    return toast.custom(
      (t) => (
        <CustomToast type="default" title={title} message={message} t={t} />
      ),
      { ...baseOptions, ...options },
    );
  },

  dismiss: toast.dismiss,
  dismissAll: () => toast.dismiss(),
};

// ============ TOAST CONTAINER COMPONENT ============
export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
}) => {
  return (
    <Toaster
      position={position}
      containerStyle={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      toastOptions={{
        duration: 4000,
      }}
    />
  );
};

 
