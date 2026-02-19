// components/about/About.tsx
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import styles from "./About.module.css";

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface Slide {
  id: string;
  imageUrl: string;
  fallback: string;
  caption: string;
  tag: string;
  year: string;
}

interface Stat {
  value: string;
  label: string;
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
}

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */
const SLIDES: Slide[] = [
  {
    id: "sl1",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop",
    caption: "Our engineering team at the 2024 infrastructure summit",
    tag: "TEAM",
    year: "2024",
  },
  {
    id: "sl2",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80&auto=format&fit=crop",
    caption: "Deep-dive session on distributed systems architecture",
    tag: "CULTURE",
    year: "2024",
  },
  {
    id: "sl3",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80&auto=format&fit=crop",
    caption: "Building the next generation of edge infrastructure",
    tag: "PRODUCT",
    year: "2023",
  },
  {
    id: "sl4",
    imageUrl:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80&auto=format&fit=crop",
    caption: "Cross-functional sprint — shipping zero-trust in 30 days",
    tag: "SPRINT",
    year: "2023",
  },
];

const STATS: Stat[] = [
  { value: "2018", label: "Founded" },
  { value: "140+", label: "Team members" },
  { value: "38", label: "Global regions" },
  { value: "1,400+", label: "Customers" },
];

const TEAM: TeamMember[] = [
  {
    name: "Sara Lind",
    role: "CEO & Co-founder",
    initials: "SL",
    color: "#30C0C0",
  },
  {
    name: "Marcus Ohm",
    role: "CTO & Co-founder",
    initials: "MO",
    color: "#30A0D0",
  },
  {
    name: "Priya Nath",
    role: "VP Engineering",
    initials: "PN",
    color: "#3080C0",
  },
  {
    name: "James Kori",
    role: "Head of Security",
    initials: "JK",
    color: "#20C0A0",
  },
];

const VALUES = [
  {
    index: "01",
    title: "Obsess over reliability",
    body: "We hold ourselves to a higher standard than our SLA. Downtime is a personal failure — we build accordingly.",
  },
  {
    index: "02",
    title: "Ship with intention",
    body: "Every feature earns its place. We'd rather release one thing that's perfect than ten things that are fine.",
  },
  {
    index: "03",
    title: "Default to transparency",
    body: "Pricing, architecture, incident reports — all public. No surprises, no fine print, no lock-in tactics.",
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
      style={{ borderColor: "rgba(48,192,192,0.38)" }}
      aria-hidden="true"
    />
  );
};

/* ════════════════════════════════════════
   PROGRESSIVE IMAGE
════════════════════════════════════════ */
const ProgressiveImage = ({
  src,
  fallback,
  alt,
}: {
  src: string;
  fallback: string;
  alt: string;
}) => {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    setCurrent(src);
  }, [src]);

  const handleError = useCallback(() => {
    if (current !== fallback) {
      setCurrent(fallback);
    } else {
      setErrored(true);
    }
  }, [current, fallback]);

  if (errored) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: "#080E1C" }}
        aria-label={alt}
      >
        <svg viewBox="0 0 120 80" fill="none" className="w-32 h-20 opacity-30">
          <circle
            cx="60"
            cy="40"
            r="28"
            stroke="#183858"
            strokeWidth="0.6"
            strokeDasharray="2 5"
          />
          <circle
            cx="60"
            cy="40"
            r="14"
            fill="none"
            stroke="#1A4060"
            strokeWidth="0.4"
          />
          <circle cx="60" cy="40" r="5" fill="#183858" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`absolute inset-0 ${styles.skeleton}`}>
          <div className={styles.skeletonShimmer} />
        </div>
      )}
      <img
        src={current}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />
    </>
  );
};

/* ════════════════════════════════════════
   SLIDER DOTS
════════════════════════════════════════ */
const SliderDots = ({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (i: number) => void;
}) => (
  <div
    className="flex items-center gap-2"
    role="tablist"
    aria-label="Slide navigation"
  >
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        role="tab"
        aria-selected={i === current}
        aria-label={`Go to slide ${i + 1}`}
        onClick={() => onChange(i)}
        className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
      />
    ))}
  </div>
);

/* ════════════════════════════════════════
   SLIDER ARROWS
════════════════════════════════════════ */
const Arrow = ({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${styles.arrow} relative flex items-center justify-center`}
    aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <svg
      viewBox="0 0 14 14"
      fill="none"
      className="w-3.5 h-3.5"
      aria-hidden="true"
      style={{
        transform: dir === "prev" ? "rotate(180deg)" : "none",
      }}
    >
      <path
        d="M3 7h8M7 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

/* ════════════════════════════════════════
   SLIDE COUNTER
════════════════════════════════════════ */
const SlideCounter = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div
    className={`${styles.counter} flex items-center gap-2`}
    aria-label={`Slide ${current + 1} of ${total}`}
    aria-live="polite"
    aria-atomic="true"
  >
    <span
      className="font-mono text-[13px] font-semibold"
      style={{ color: "#30C0C0", letterSpacing: "-0.01em" }}
    >
      {String(current + 1).padStart(2, "0")}
    </span>
    <div
      style={{
        width: 24,
        height: 1,
        background:
          "linear-gradient(to right, rgba(48,192,192,0.5), rgba(48,192,192,0.1))",
      }}
      aria-hidden="true"
    />
    <span className="font-mono text-[10px]" style={{ color: "#1A3848" }}>
      {String(total).padStart(2, "0")}
    </span>
  </div>
);

/* ════════════════════════════════════════
   PROGRESS TICKER (auto-play progress)
════════════════════════════════════════ */
const ProgressTicker = ({
  playing,
  duration,
  slideKey,
}: {
  playing: boolean;
  duration: number;
  slideKey: string;
}) => (
  <div
    className={styles.progressTicker}
    role="progressbar"
    aria-label="Slide auto-advance timer"
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      key={slideKey}
      className={styles.progressTickerFill}
      style={{
        animationDuration: `${duration}ms`,
        animationPlayState: playing ? "running" : "paused",
      }}
    />
  </div>
);

/* ════════════════════════════════════════
   MAIN SLIDER
════════════════════════════════════════ */
const AUTOPLAY_DURATION = 5000;

const AboutSlider = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  const goTo = useCallback(
    (index: number, dir?: "next" | "prev") => {
      if (isTransitioning) return;
      const d = dir ?? (index > current ? "next" : "prev");
      setDirection(d);
      setPrev(current);
      setCurrent(index);
      setIsTransitioning(true);
      setTimeout(() => {
        setPrev(null);
        setIsTransitioning(false);
      }, 700);
    },
    [current, isTransitioning],
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % total, "next");
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, "prev");
  }, [current, total, goTo]);

  /* auto-play */
  useEffect(() => {
    if (!isPlaying || isDragging) return;
    timerRef.current = setTimeout(goNext, AUTOPLAY_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isPlaying, isDragging, goNext]);

  /* keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        sliderRef.current &&
        (sliderRef.current.contains(document.activeElement) ||
          document.activeElement === sliderRef.current)
      ) {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  /* touch/drag */
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = e.clientX - dragStart;
    if (Math.abs(delta) > 50) {
      delta < 0 ? goNext() : goPrev();
    }
  };
  const onPointerLeave = () => {
    if (isDragging) setIsDragging(false);
  };

  /* slide animation classes */
  const getSlideClass = (index: number) => {
    if (index === current) {
      return direction === "next"
        ? styles.slideCurrent
        : styles.slideCurrentReverse;
    }
    if (index === prev) {
      return direction === "next" ? styles.slideExit : styles.slideExitReverse;
    }
    return styles.slideHidden;
  };

  const slide = SLIDES[current];

  return (
    <div
      className={`${styles.sliderWrap} relative`}
      ref={sliderRef}
      tabIndex={0}
      aria-label="Team photo gallery"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* ── SLIDES ── */}
      <div
        className={styles.slidesContainer}
        aria-live="polite"
        aria-atomic="true"
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.slide} ${getSlideClass(i)}`}
            aria-hidden={i !== current}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${s.caption}`}
          >
            <ProgressiveImage
              src={s.imageUrl}
              fallback={s.fallback}
              alt={s.caption}
            />

            {/* image colour overlay */}
            <div className={styles.slideOverlayColor} aria-hidden="true" />
            {/* image gradient overlay */}
            <div className={styles.slideOverlayGrad} aria-hidden="true" />
            {/* scan-line texture */}
            <div className={styles.slideScanLines} aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* ── TOP BAR ── */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center
                   justify-between px-4 sm:px-5 py-3"
        aria-hidden="true"
      >
        {/* tag */}
        <div className={`${styles.slideTag} flex items-center gap-1.5`}>
          <TealDot size={4} pulse />
          <span
            className="font-mono text-[8px] tracking-[0.22em] uppercase"
            style={{ color: "#30C0C0" }}
          >
            {slide.tag}
          </span>
        </div>

        {/* year + play/pause */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[8px] tracking-[0.18em]"
            style={{ color: "#1A3848" }}
          >
            {slide.year}
          </span>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={styles.playBtn}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 10 12" fill="none" className="w-2.5 h-3">
                <rect
                  x="0.5"
                  y="0.5"
                  width="2.5"
                  height="11"
                  rx="1"
                  fill="#1E4058"
                />
                <rect
                  x="7"
                  y="0.5"
                  width="2.5"
                  height="11"
                  rx="1"
                  fill="#1E4058"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                <path d="M2 1.5l9 4.5-9 4.5V1.5z" fill="#1E4058" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-3
                   px-4 sm:px-5 pb-4 pt-10"
        style={{
          background:
            "linear-gradient(to top, rgba(6,10,20,0.92) 0%, transparent 100%)",
        }}
      >
        {/* caption */}
        <p
          className="font-mono text-[10.5px] leading-snug"
          style={{
            color: "#3A6878",
            letterSpacing: "0.03em",
            maxWidth: 320,
          }}
          key={`cap-${current}`}
        >
          <span className={styles.captionReveal}>{slide.caption}</span>
        </p>

        {/* controls row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SlideCounter current={current} total={total} />
            <SliderDots
              total={total}
              current={current}
              onChange={(i) => goTo(i)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Arrow dir="prev" onClick={goPrev} />
            <Arrow dir="next" onClick={goNext} />
          </div>
        </div>

        {/* progress ticker */}
        <ProgressTicker
          playing={isPlaying}
          duration={AUTOPLAY_DURATION}
          slideKey={`${current}-${isPlaying}`}
        />
      </div>

      {/* drag hint (first load only) */}
      <div className={styles.dragHint} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
          <path
            d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"
            stroke="#1E4058"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="font-mono text-[8px] tracking-[0.14em]"
          style={{ color: "#1E4058" }}
        >
          drag
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   STAT CARD
════════════════════════════════════════ */
const StatCard = ({
  stat,
  revealed,
  delay,
}: {
  stat: Stat;
  revealed: boolean;
  delay: number;
}) => (
  <div
    className={`${styles.statCard} relative flex flex-col gap-1 p-4`}
    style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}
  >
    <Bracket pos="tl" />
    <Bracket pos="br" />
    <span
      className="font-mono font-semibold leading-none"
      style={{
        fontSize: "clamp(18px, 2.8vw, 26px)",
        color: "#80C8D8",
        letterSpacing: "-0.01em",
      }}
    >
      {stat.value}
    </span>
    <span
      className="font-mono text-[9px] tracking-[0.18em] uppercase"
      style={{ color: "#1E4058" }}
    >
      {stat.label}
    </span>
    {/* bottom scan */}
    <div className={styles.statScan} aria-hidden="true" />
  </div>
);

/* ════════════════════════════════════════
   TEAM AVATAR
════════════════════════════════════════ */
const TeamAvatar = ({ member }: { member: TeamMember }) => (
  <div className={`${styles.avatar} relative flex items-center gap-3`}>
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{
        width: 40,
        height: 40,
        border: `1px solid ${member.color}44`,
        borderRadius: 2,
        background: `${member.color}0A`,
      }}
    >
      <span
        className="font-mono text-[10px] font-semibold tracking-[0.08em]"
        style={{ color: member.color }}
      >
        {member.initials}
      </span>
      {/* corner dots */}
      <span
        className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full"
        style={{ background: member.color, opacity: 0.4 }}
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full"
        style={{ background: member.color, opacity: 0.25 }}
        aria-hidden="true"
      />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span
        className="font-mono text-[11px] leading-none"
        style={{ color: "#5A8898", letterSpacing: "0.04em" }}
      >
        {member.name}
      </span>
      <span
        className="font-mono text-[8.5px] tracking-[0.14em] uppercase"
        style={{ color: "#1A3848" }}
      >
        {member.role}
      </span>
    </div>
  </div>
);

/* ════════════════════════════════════════
   VALUE CARD
════════════════════════════════════════ */
const ValueCard = ({
  val,
  revealed,
  delay,
}: {
  val: (typeof VALUES)[0];
  revealed: boolean;
  delay: number;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${styles.valueCard} relative flex gap-4 p-5`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateX(0)" : "translateX(-12px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Bracket pos="tl" />
      <Bracket pos="br" />
      <div
        className={styles.valueStripe}
        style={{ opacity: hovered ? 1 : 0 }}
        aria-hidden="true"
      />
      <span
        className="font-mono text-[10px] tracking-[0.15em] shrink-0 mt-0.5"
        style={{
          color: hovered ? "#30C0C0" : "#1A3848",
          transition: "color 0.3s",
        }}
      >
        {val.index}
      </span>
      <div className="flex flex-col gap-1.5">
        <h4
          className="font-mono text-[12.5px] leading-snug"
          style={{
            color: hovered ? "#A8D8E0" : "#3A6878",
            letterSpacing: "0.04em",
            transition: "color 0.3s",
          }}
        >
          {val.title}
        </h4>
        <p
          className="font-mono text-[11px] leading-relaxed"
          style={{ color: "#1E3848", letterSpacing: "0.02em" }}
        >
          {val.body}
        </p>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function About() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative w-full overflow-hidden`}
      aria-labelledby="about-heading"
    >
      {/* bg */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgVignette} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.borderTop} aria-hidden="true" />
      <div className={styles.borderBottom} aria-hidden="true" />

      <div
        className="relative z-10 w-full max-w-7xl mx-auto
                   px-5 sm:px-10 lg:px-16
                   py-20 sm:py-28 lg:py-36"
      >
        {/* ══════════ HEADER ══════════ */}
        <div
          className={`${styles.headerBlock} ${revealed ? styles.revealed : ""} flex flex-col gap-5 mb-14 sm:mb-18`}
        >
          <SectionLabel>About us</SectionLabel>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              id="about-heading"
              className="font-mono leading-tight max-w-xl"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                color: "#B8D8E4",
                letterSpacing: "-0.01em",
              }}
            >
              We started because
              <br />
              <span
                style={{
                  color: "#30C0C0",
                  textShadow: "0 0 32px rgba(48,192,192,0.4)",
                }}
              >
                infrastructure was broken.
              </span>
            </h2>
            <p
              className="font-mono text-[12px] leading-relaxed max-w-xs lg:text-right"
              style={{ color: "#2E5868", letterSpacing: "0.04em" }}
            >
              Founded in 2018 by a team of infrastructure engineers who were
              tired of duct-taping cloud primitives together.
            </p>
          </div>
          <div className={styles.headerDivider} aria-hidden="true" />
        </div>

        {/* ══════════ MAIN GRID ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          {/* LEFT: slider */}
          <div
            className={`${styles.sliderCol} ${revealed ? styles.revealed : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <AboutSlider />
          </div>

          {/* RIGHT: content */}
          <div
            className={`${styles.contentCol} ${revealed ? styles.revealed : ""} flex flex-col gap-8`}
            style={{ transitionDelay: "0.2s" }}
          >
            {/* story paragraphs */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div
                  className="w-px shrink-0 mt-1"
                  style={{
                    height: 40,
                    background:
                      "linear-gradient(to bottom, #30C0C0, transparent)",
                    opacity: 0.35,
                  }}
                  aria-hidden="true"
                />
                <p
                  className="font-mono text-[12.5px] leading-[1.9]"
                  style={{ color: "#3A6878", letterSpacing: "0.03em" }}
                >
                  We built Axon after spending years inside hyperscalers and
                  high-growth startups, watching the same patterns repeat:
                  brilliant engineers wasting weeks stitching together
                  unreliable primitives instead of shipping product.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-px shrink-0 mt-1"
                  style={{
                    height: 40,
                    background:
                      "linear-gradient(to bottom, #30A0D0, transparent)",
                    opacity: 0.25,
                  }}
                  aria-hidden="true"
                />
                <p
                  className="font-mono text-[12.5px] leading-[1.9]"
                  style={{ color: "#2A5060", letterSpacing: "0.03em" }}
                >
                  Today, Axon is the foundation layer for over 1,400 engineering
                  teams — from Series A startups to Fortune 500 infrastructure
                  divisions. We're a team of 140+ across 12 countries, obsessed
                  with reliability, simplicity, and doing the right thing for
                  our customers.
                </p>
              </div>
            </div>

            {/* divider */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(to right, rgba(48,192,192,0.15), transparent)",
              }}
              aria-hidden="true"
            />

            {/* stats grid */}
            <div>
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3"
                style={{ color: "#1A3848" }}
              >
                By the numbers
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2">
                {STATS.map((s, i) => (
                  <StatCard
                    key={s.label}
                    stat={s}
                    revealed={revealed}
                    delay={300 + i * 80}
                  />
                ))}
              </div>
            </div>

            {/* divider */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(to right, rgba(48,192,192,0.1), transparent)",
              }}
              aria-hidden="true"
            />

            {/* team */}
            <div>
              <span
                className="font-mono text-[9px] tracking-[0.22em] uppercase block mb-3"
                style={{ color: "#1A3848" }}
              >
                Leadership
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEAM.map((m) => (
                  <TeamAvatar key={m.name} member={m} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ VALUES ROW ══════════ */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.25em] uppercase"
              style={{ color: "#1A3848" }}
            >
              What we stand for
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(to right, rgba(24,56,88,0.4), transparent)",
              }}
              aria-hidden="true"
            />
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            role="list"
            aria-label="Company values"
          >
            {VALUES.map((v, i) => (
              <div key={v.index} role="listitem">
                <ValueCard val={v} revealed={revealed} delay={500 + i * 100} />
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ BOTTOM STRIP ══════════ */}
        <div className={`${styles.bottomStrip} mt-16 sm:mt-20`}>
          <div className="flex items-center gap-3">
            <TealDot size={4} />
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Fully remote · 12 countries
            </span>
          </div>
          <div className={styles.bottomLine} aria-hidden="true" />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "#1E4858" }}
            >
              Backed by Sequoia & a16z
            </span>
            <TealDot size={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
