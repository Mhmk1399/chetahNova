"use client";

import React, { useEffect, useRef, useMemo } from "react";
import styles from "./herosection.module.css";

interface CornerLabels {
  topLeft?: string;
  bottomLeft?: string;
  topRight?: string;
  bottomRight?: string;
}

interface HeroSectionProps {
  labels?: CornerLabels;
  title?: string;
  subtitle?: string;
}

const DEFAULT_LABELS: CornerLabels = {
  topLeft: "SYS.CORE / 4.2.1",
  bottomLeft: "LAT 37.7749° N",
  topRight: "NEURAL MESH ONLINE",
  bottomRight: "SYNC 99.8%",
};

// Deterministic particle positions for SSR safety
function generateParticles(count: number) {
  const particles: {
    angle: number;
    radius: number;
    size: number;
    opacity: number;
  }[] = [];
  // Simple deterministic pseudo-random using golden ratio
  const phi = 137.508;
  for (let i = 0; i < count; i++) {
    const angle = (i * phi) % 360;
    const radiusVariance = ((i * 17 + 3) % 20) - 10; // -10 to +10
    const size = 0.8 + ((i * 7) % 10) / 10; // 0.8 to 1.7
    const opacity = 0.3 + ((i * 13) % 7) / 10; // 0.3 to 1.0
    particles.push({ angle, radius: radiusVariance, size, opacity });
  }
  return particles;
}

const PARTICLES = generateParticles(72);
const RING_RADIUS = 148;

export default function HeroSection({
  labels = DEFAULT_LABELS,
  title = "Hello World",
  subtitle = "Please Tell us Ypur Business To Helping You",
}: HeroSectionProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const particleElements = useMemo(() => {
    return PARTICLES.map((p, i) => {
      const rad = ((p.angle - 90) * Math.PI) / 180;
      const r = RING_RADIUS + p.radius;
      const cx = 200 + r * Math.cos(rad);
      const cy = 200 + r * Math.sin(rad);
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={p.size}
          fill={`rgba(48, 192, 192, ${p.opacity})`}
        />
      );
    });
  }, []);

  return (
    <section
      className={`${styles.hero} relative w-full overflow-hidden`}
      aria-label="Hero section"
    >
      {/* Background layers */}
      <div className={styles.noiseBg} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Grid lines background */}
      <div className={styles.gridLines} aria-hidden="true" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-screen px-4 sm:px-8 lg:px-16">
        {/* Corner Labels */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="false"
        >
          {/* Top Left */}
          {labels.topLeft && (
            <div
              className={`${styles.cornerLabel} absolute top-6 left-6 sm:top-10 sm:left-10`}
            >
              <span className={styles.bullet} aria-hidden="true" />
              <span>{labels.topLeft}</span>
            </div>
          )}
          {/* Bottom Left */}
          {labels.bottomLeft && (
            <div
              className={`${styles.cornerLabel} absolute bottom-6 left-6 sm:bottom-10 sm:left-10`}
            >
              <span className={styles.bullet} aria-hidden="true" />
              <span>{labels.bottomLeft}</span>
            </div>
          )}
          {/* Top Right */}
          {labels.topRight && (
            <div
              className={`${styles.cornerLabel} absolute top-6 right-6 sm:top-10 sm:right-10`}
            >
              <span className={styles.bullet} aria-hidden="true" />
              <span>{labels.topRight}</span>
            </div>
          )}
          {/* Bottom Right */}
          {labels.bottomRight && (
            <div
              className={`${styles.cornerLabel} absolute bottom-6 right-6 sm:bottom-10 sm:right-10`}
            >
              <span className={styles.bullet} aria-hidden="true" />
              <span>{labels.bottomRight}</span>
            </div>
          )}
        </div>

        {/* Center composition */}
        <div
          className={`${styles.centerComposition} relative flex items-center justify-center`}
        >
          {/* Trapezoid / Hex outlines — left & right panels */}
          <div
            className={`${styles.panelLeft} absolute hidden sm:block`}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 260 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-hidden="true"
            >
              {/* Outer trapezoid */}
              <path
                d="M240 20 L20 60 L20 280 L240 320 Z"
                stroke="#183858"
                strokeWidth="1"
                fill="none"
                opacity="0.9"
              />
              {/* Inner inset */}
              <path
                d="M220 38 L38 72 L38 268 L220 302 Z"
                stroke="#183050"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
              {/* Corner accent marks */}
              <line
                x1="220"
                y1="38"
                x2="240"
                y2="20"
                stroke="#30C0C0"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="220"
                y1="302"
                x2="240"
                y2="320"
                stroke="#30C0C0"
                strokeWidth="1"
                opacity="0.6"
              />
              {/* Tick marks along left edge */}
              <line
                x1="20"
                y1="120"
                x2="32"
                y2="118"
                stroke="#183858"
                strokeWidth="0.7"
                opacity="0.8"
              />
              <line
                x1="20"
                y1="170"
                x2="32"
                y2="170"
                stroke="#183858"
                strokeWidth="0.7"
                opacity="0.8"
              />
              <line
                x1="20"
                y1="220"
                x2="32"
                y2="222"
                stroke="#183858"
                strokeWidth="0.7"
                opacity="0.8"
              />
              {/* Horizontal scan line */}
              <line
                x1="38"
                y1="170"
                x2="220"
                y2="170"
                stroke="#183858"
                strokeWidth="0.4"
                opacity="0.4"
                strokeDasharray="4 8"
              />
              {/* Small hex corner detail */}
              <rect
                x="228"
                y="14"
                width="12"
                height="12"
                stroke="#30C0C0"
                strokeWidth="0.8"
                fill="none"
                opacity="0.5"
                transform="rotate(45 234 20)"
              />
            </svg>
          </div>

          <div
            className={`${styles.panelRight} absolute hidden sm:block`}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 260 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              style={{ transform: "scaleX(-1)" }}
              aria-hidden="true"
            >
              <path
                d="M240 20 L20 60 L20 280 L240 320 Z"
                stroke="#183858"
                strokeWidth="1"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M220 38 L38 72 L38 268 L220 302 Z"
                stroke="#183050"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
              <line
                x1="220"
                y1="38"
                x2="240"
                y2="20"
                stroke="#30C0C0"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="220"
                y1="302"
                x2="240"
                y2="320"
                stroke="#30C0C0"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="20"
                y1="120"
                x2="32"
                y2="118"
                stroke="#183858"
                strokeWidth="0.7"
                opacity="0.8"
              />
              <line
                x1="20"
                y1="170"
                x2="32"
                y2="170"
                stroke="#183858"
                strokeWidth="0.7"
                opacity="0.8"
              />
              <line
                x1="20"
                y1="220"
                x2="32"
                y2="222"
                stroke="#183858"
                strokeWidth="0.7"
                opacity="0.8"
              />
              <line
                x1="38"
                y1="170"
                x2="220"
                y2="170"
                stroke="#183858"
                strokeWidth="0.4"
                opacity="0.4"
                strokeDasharray="4 8"
              />
              <rect
                x="228"
                y="14"
                width="12"
                height="12"
                stroke="#30C0C0"
                strokeWidth="0.8"
                fill="none"
                opacity="0.5"
                transform="rotate(45 234 20)"
              />
            </svg>
          </div>

          {/* Center connecting line */}
          <div
            className={`${styles.centerLine} absolute hidden sm:flex items-center justify-center`}
            aria-hidden="true"
          >
            <div className={styles.lineLeft} />
            <div className={styles.lineDot} />
            <div className={styles.lineRight} />
          </div>

          {/* Glass panel backdrop */}
          <div className={styles.glassPanel} aria-hidden="true" />

          {/* Orb + Ring SVG */}
          <div
            className={`${styles.orbContainer} relative flex items-center justify-center`}
            ref={orbRef}
          >
            {/* Particle ring SVG */}
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className={`${styles.particleRing} absolute`}
              aria-hidden="true"
            >
              {/* Faint ring stroke */}
              <circle
                cx="200"
                cy="200"
                r={RING_RADIUS}
                stroke="rgba(48,192,192,0.08)"
                strokeWidth="1"
                fill="none"
              />
              {/* Dashed accent ring */}
              <circle
                cx="200"
                cy="200"
                r={RING_RADIUS + 12}
                stroke="rgba(48,160,208,0.06)"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="3 9"
              />
              {/* Particles */}
              {particleElements}
              {/* Orbit path for satellite reference (invisible) */}
              <circle
                id="orbitPath"
                cx="200"
                cy="200"
                r={RING_RADIUS}
                fill="none"
                stroke="none"
              />
            </svg>

            {/* Satellite dot */}
            <div
              className={styles.satelliteWrapper}
              ref={satelliteRef}
              aria-hidden="true"
            >
              <div className={styles.satellite}>
                <div className={styles.satelliteGlow} />
              </div>
            </div>

            {/* Orb glow bloom (outer, blurred) */}
            <div className={styles.orbBloom} aria-hidden="true" />

            {/* Orb core */}
            <div className={styles.orbCore} aria-hidden="true">
              <div className={styles.orbInner} />
              <div className={styles.orbHighlight} />
              <div className={styles.orbRing} />
            </div>

            {/* Title/subtitle overlay (optional) */}
            {(title || subtitle) && (
              <div
                className={`${styles.textOverlay} absolute bottom-0 translate-y-full pt-8 text-center`}
              >
                {title && <h1 className={styles.heroTitle}>{title}</h1>}
                {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
