// components/testimonials/Testimonials.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Testimonials.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  country: string;
  countryCode: string;
  review: string;
  rating: number;
  avatar: string;
  industry: string;
  result?: string;
}

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    company: "LuxeHome Realty",
    role: "CEO & Founder",
    country: "United States",
    countryCode: "US",
    review:
      "Our website went from a simple brochure site to a full lead generation system. The SEO results were incredible, and the AI automation saved us hours every week. We're now ranking #1 for our main keywords.",
    rating: 5,
    avatar: "SM",
    industry: "Real Estate",
    result: "+340% Leads",
  },
  {
    id: "t2",
    name: "Marcus Chen",
    company: "TechFlow Solutions",
    role: "CTO",
    country: "Canada",
    countryCode: "CA",
    review:
      "The team delivered a stunning SaaS dashboard that our users love. The attention to detail in the UI/UX was exceptional. Our conversion rate doubled within the first month of launch.",
    rating: 5,
    avatar: "MC",
    industry: "SaaS",
    result: "2.5x Conversions",
  },
  {
    id: "t3",
    name: "Elena Rodriguez",
    company: "UrbanStyle Fashion",
    role: "Marketing Director",
    country: "Spain",
    countryCode: "ES",
    review:
      "The AI product recommendation system they built increased our average order value by 45%. The e-commerce site is lightning fast and beautifully designed. Best investment we've made.",
    rating: 5,
    avatar: "ER",
    industry: "E-commerce",
    result: "+180% Revenue",
  },
  {
    id: "t4",
    name: "Dr. James Wilson",
    company: "MedCare Clinic",
    role: "Practice Owner",
    country: "United Kingdom",
    countryCode: "UK",
    review:
      "Our patient bookings increased by 95% after the new website launched. The AI appointment system handles everything automatically. We can finally focus on patient care instead of admin.",
    rating: 5,
    avatar: "JW",
    industry: "Healthcare",
    result: "+95% Bookings",
  },
  {
    id: "t5",
    name: "Andreas Müller",
    company: "GreenBuild GmbH",
    role: "Managing Director",
    country: "Germany",
    countryCode: "DE",
    review:
      "From zero online presence to #1 local ranking in just 4 months. The lead generation system brings us qualified contractors daily. The ROI has been phenomenal.",
    rating: 5,
    avatar: "AM",
    industry: "Construction",
    result: "#1 Local Rank",
  },
  {
    id: "t6",
    name: "Sophie Laurent",
    company: "FinanceFirst Advisory",
    role: "Partner",
    country: "France",
    countryCode: "FR",
    review:
      "The secure client portal and AI insights dashboard transformed our advisory practice. Our clients love the modern interface, and we've saved 60% of our admin time.",
    rating: 5,
    avatar: "SL",
    industry: "Finance",
    result: "60% Time Saved",
  },
];

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
const TealDot = ({
  size = 6,
  pulse = false,
  color = "#30C0C0",
}: {
  size?: number;
  pulse?: boolean;
  color?: string;
}) => (
  <span
    className="relative inline-flex shrink-0"
    style={{ width: size, height: size }}
  >
    {pulse && (
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `${color}44`,
          animation: "ping 2s cubic-bezier(0,0,.2,1) infinite",
        }}
      />
    )}
    <span
      className="relative rounded-full block"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size + 2}px ${color}, 0 0 ${size * 3}px ${color}44`,
      }}
    />
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2.5">
    <TealDot size={5} />
    <span
      className="font-mono text-[10px] tracking-[0.28em] uppercase"
      style={{ color: "#30C0C0", opacity: 0.8 }}
    >
      {children}
    </span>
  </div>
);

const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const map = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-2.5 h-2.5 pointer-events-none ${map[pos]}`}
      style={{ borderColor: "rgba(48,192,192,0.4)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   STAR RATING
════════════════════════════════════════ */
const StarRating = ({ rating }: { rating: number }) => (
  <div
    className="flex items-center gap-1"
    aria-label={`${rating} out of 5 stars`}
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 16 16"
        className="w-3.5 h-3.5"
        fill={i < rating ? "#30C0C0" : "none"}
        stroke={i < rating ? "#30C0C0" : "#1A3848"}
        strokeWidth="1"
      >
        <path d="M8 1l2.2 4.4 4.8.7-3.5 3.4.8 4.8L8 12l-4.3 2.3.8-4.8L1 6.1l4.8-.7L8 1z" />
      </svg>
    ))}
  </div>
);

/* ════════════════════════════════════════
   COUNTRY FLAG (Simple SVG representation)
════════════════════════════════════════ */
const CountryIndicator = ({
  code,
  country,
}: {
  code: string;
  country: string;
}) => {
  const colors: Record<string, [string, string]> = {
    US: ["#30C0C0", "#1A5080"],
    CA: ["#C03030", "#F0E0E0"],
    ES: ["#C09030", "#C03030"],
    UK: ["#3050C0", "#C03030"],
    DE: ["#303030", "#C09030"],
    FR: ["#3050C0", "#C03030"],
  };

  const [c1, c2] = colors[code] || ["#30C0C0", "#1A5080"];

  return (
    <div className="flex items-center gap-2" title={country}>
      <div
        className="w-4 h-3 rounded-sm overflow-hidden flex"
        style={{ border: "1px solid rgba(48,192,192,0.2)" }}
      >
        <div
          className="w-1/2 h-full"
          style={{ background: c1, opacity: 0.6 }}
        />
        <div
          className="w-1/2 h-full"
          style={{ background: c2, opacity: 0.6 }}
        />
      </div>
      <span
        className="font-mono text-[8px] tracking-[0.15em] uppercase"
        style={{ color: "#1A3848" }}
      >
        {code}
      </span>
    </div>
  );
};

/* ════════════════════════════════════════
   AVATAR
════════════════════════════════════════ */
const Avatar = ({
  initials,
  active,
}: {
  initials: string;
  active: boolean;
}) => (
  <div className={`${styles.avatar} relative`}>
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <div
      className={styles.avatarInner}
      style={{
        background: active
          ? "linear-gradient(135deg, rgba(48,192,192,0.15), rgba(48,192,192,0.05))"
          : "rgba(8,14,26,0.8)",
        borderColor: active ? "rgba(48,192,192,0.3)" : "#0c1828",
      }}
    >
      <span
        className="font-mono font-semibold"
        style={{
          fontSize: "14px",
          color: active ? "#60E8E8" : "#2A5868",
          letterSpacing: "0.05em",
        }}
      >
        {initials}
      </span>
    </div>
    {active && <div className={styles.avatarGlow} />}
  </div>
);

/* ════════════════════════════════════════
   QUOTE ICON
════════════════════════════════════════ */
const QuoteIcon = () => (
  <svg
    viewBox="0 0 32 32"
    className={styles.quoteIcon}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 16c-2.2 0-4-1.8-4-4s1.8-4 4-4c3.3 0 6 2.7 6 6v2c0 4.4-3.6 8-8 8v-2c3.3 0 6-2.7 6-6H8z"
      fill="rgba(48,192,192,0.1)"
      stroke="rgba(48,192,192,0.3)"
      strokeWidth="0.5"
    />
    <path
      d="M22 16c-2.2 0-4-1.8-4-4s1.8-4 4-4c3.3 0 6 2.7 6 6v2c0 4.4-3.6 8-8 8v-2c3.3 0 6-2.7 6-6h-6z"
      fill="rgba(48,192,192,0.1)"
      stroke="rgba(48,192,192,0.3)"
      strokeWidth="0.5"
    />
  </svg>
);

/* ════════════════════════════════════════
   TESTIMONIAL CARD
════════════════════════════════════════ */
const TestimonialCard = ({
  testimonial,
  active,
  position,
}: {
  testimonial: Testimonial;
  active: boolean;
  position: "prev" | "current" | "next" | "hidden";
}) => {
  return (
    <article
      className={`${styles.testimonialCard} ${styles[`card${position.charAt(0).toUpperCase() + position.slice(1)}`]}`}
      aria-hidden={!active}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Glow */}
      <div className={styles.cardGlow} style={{ opacity: active ? 1 : 0 }} />

      {/* Top scan line */}
      <div
        className={`${styles.cardScanTop} ${active ? styles.cardScanTopActive : ""}`}
      />

      {/* Quote icon */}
      <QuoteIcon />

      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.tagRow}>
          <div className={styles.industryTag}>
            <TealDot size={3} color={active ? "#30C0C0" : "#1A3848"} />
            <span style={{ color: active ? "#30C0C0" : "#1A3848" }}>
              {testimonial.industry}
            </span>
          </div>
          {testimonial.result && (
            <div className={styles.resultTag}>
              <span style={{ color: "#60C8D0" }}>{testimonial.result}</span>
            </div>
          )}
        </div>
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review text */}
      <blockquote className={styles.reviewText}>
        <p>"{testimonial.review}"</p>
      </blockquote>

      {/* Divider */}
      <div className={styles.cardDivider}>
        <div className={styles.dividerLine} />
        <TealDot size={4} />
        <div className={styles.dividerLine} />
      </div>

      {/* Author info */}
      <div className={styles.authorSection}>
        <Avatar initials={testimonial.avatar} active={active} />
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{testimonial.name}</span>
          <span className={styles.authorRole}>{testimonial.role}</span>
          <span className={styles.authorCompany}>{testimonial.company}</span>
        </div>
        <CountryIndicator
          code={testimonial.countryCode}
          country={testimonial.country}
        />
      </div>

      {/* Bottom line */}
      <div className={styles.cardBottomLine} />
    </article>
  );
};

/* ════════════════════════════════════════
   SLIDER NAVIGATION
════════════════════════════════════════ */
const SliderNav = ({
  current,
  total,
  onPrev,
  onNext,
  onSelect,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) => (
  <div className={styles.sliderNav}>
    {/* Prev button */}
    <button
      onClick={onPrev}
      className={`${styles.navButton} relative`}
      aria-label="Previous testimonial"
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <path
          d="M10 4L6 8l4 4"
          stroke="#30C0C0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    {/* Dots */}
    <div className={styles.navDots}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`${styles.navDot} ${i === current ? styles.navDotActive : ""}`}
          aria-label={`Go to testimonial ${i + 1}`}
          aria-current={i === current}
        >
          <span />
        </button>
      ))}
    </div>

    {/* Next button */}
    <button
      onClick={onNext}
      className={`${styles.navButton} relative`}
      aria-label="Next testimonial"
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <path
          d="M6 4l4 4-4 4"
          stroke="#30C0C0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    {/* Counter */}
    {/* <div className={styles.navCounter}>
      <span style={{ color: "#60C8D0" }}>
        {String(current + 1).padStart(2, "0")}
      </span>
      <span style={{ color: "#1A3848" }}>/</span>
      <span style={{ color: "#1A3848" }}>{String(total).padStart(2, "0")}</span>
    </div> */}
  </div>
);

/* ════════════════════════════════════════
   MINI TESTIMONIAL PREVIEWS
════════════════════════════════════════ */
const MiniPreview = ({
  testimonials,
  current,
  onSelect,
}: {
  testimonials: Testimonial[];
  current: number;
  onSelect: (index: number) => void;
}) => (
  <div className={styles.miniPreviews}>
    {testimonials.map((t, i) => (
      <button
        key={t.id}
        onClick={() => onSelect(i)}
        className={`${styles.miniCard} ${i === current ? styles.miniCardActive : ""} relative`}
        aria-label={`Select ${t.name}'s testimonial`}
        aria-current={i === current}
      >
        <Bracket pos="tl" />
        <Bracket pos="br" />
        <div className={styles.miniAvatar}>
          <span>{t.avatar}</span>
        </div>
        <div className={styles.miniInfo}>
          <span className={styles.miniName}>{t.name}</span>
          <span className={styles.miniCompany}>{t.company}</span>
        </div>
        {i === current && <TealDot size={4} pulse />}
      </button>
    ))}
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(goToNext, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, goToNext]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Get position for each card
  const getPosition = (
    index: number,
  ): "prev" | "current" | "next" | "hidden" => {
    if (index === currentIndex) return "current";
    if (
      index ===
      (currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    )
      return "prev";
    if (index === (currentIndex + 1) % TESTIMONIALS.length) return "next";
    return "hidden";
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="testimonials-heading"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layers */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36">
        {/* ══ HEADER ══ */}
        <div className="flex flex-col gap-5 mb-12 sm:mb-16">
          <SectionLabel>Testimonials</SectionLabel>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2
                id="testimonials-heading"
                className="font-mono leading-tight"
                style={{
                  fontSize: "clamp(26px, 4vw, 48px)",
                  color: "#B8D8E4",
                  letterSpacing: "-0.01em",
                }}
              >
                What Clients Say About
                <br />
                <span
                  style={{
                    color: "#30C0C0",
                    textShadow: "0 0 32px rgba(48,192,192,0.4)",
                  }}
                >
                  Working With Us
                </span>
              </h2>

              <p
                className="font-mono text-[12px] leading-relaxed"
                style={{ color: "#3A6070", letterSpacing: "0.03em" }}
              >
                Our clients don't just get websites. They get growth systems
                that transform their business.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TealDot size={4} pulse={isAutoPlaying} />
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#1A3848" }}
              >
                {isAutoPlaying ? "Auto-playing" : "Paused"} ·{" "}
                {TESTIMONIALS.length} Reviews
              </span>
            </div>
          </div>

          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══ SLIDER ══ */}
        <div className={styles.sliderWrapper}>
          {/* Cards container */}
          <div className={styles.cardsContainer}>
            {TESTIMONIALS.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                active={i === currentIndex}
                position={getPosition(i)}
              />
            ))}
          </div>

          {/* Navigation */}
          <SliderNav
            current={currentIndex}
            total={TESTIMONIALS.length}
            onPrev={goToPrev}
            onNext={goToNext}
            onSelect={goToIndex}
          />
        </div>

        {/* ══ MINI PREVIEWS ══ */}
        {/* <MiniPreview
          testimonials={TESTIMONIALS}
          current={currentIndex}
          onSelect={goToIndex}
        /> */}

        {/* ══ DIVIDER ══ */}
        <div className={styles.sectionDivider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerNode}>
            <TealDot size={6} pulse />
          </div>
          <div className={styles.dividerLine} />
        </div>

        {/* ══ TRUST STATS ══ */}
        <div className={styles.trustStats}>
          {[
            { value: "50+", label: "Happy Clients" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "5.0", label: "Average Rating" },
          ].map((stat, i) => (
            <div key={stat.label} className={`${styles.trustStat} relative`}>
              <Bracket pos="tl" />
              <Bracket pos="br" />
              <span
                className="font-mono font-bold"
                style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#60C8D0" }}
              >
                {stat.value}
              </span>
              <span
                className="font-mono text-[8px] tracking-[0.18em] uppercase"
                style={{ color: "#1E4058" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ══ BOTTOM STRIP ══ */}
        <div className={styles.bottomStrip}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Ready to become our next success story?
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <a
            href="#contact"
            className={`${styles.ctaLink} relative flex items-center gap-2`}
          >
            <Bracket pos="tl" />
            <Bracket pos="br" />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "#7ABFCF" }}
            >
              Start Your Project
            </span>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="#30C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
