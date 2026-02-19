// components/smooth-scroll/SmoothScroll.tsx
"use client";

import React, { useEffect, useRef, createContext, useContext } from "react";

/* ════════════════════════════════════════
   CONTEXT — expose lenis instance to children
════════════════════════════════════════ */
interface SmoothScrollContextValue {
  lenis: React.MutableRefObject<LenisInstance | null>;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: { current: null },
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/* ════════════════════════════════════════
   LENIS TYPES (inline — no @types needed)
════════════════════════════════════════ */
interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  wheelMultiplier?: number;
  infinite?: boolean;
  autoResize?: boolean;
  prevent?: (node: Element) => boolean;
}

interface LenisScrollEvent {
  scroll: number;
  limit: number;
  velocity: number;
  direction: 1 | -1;
  progress: number;
}

interface LenisInstance {
  on: (event: "scroll", cb: (e: LenisScrollEvent) => void) => void;
  off: (event: "scroll", cb: (e: LenisScrollEvent) => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: {
      offset?: number;
      duration?: number;
      easing?: (t: number) => number;
      immediate?: boolean;
      lock?: boolean;
      onComplete?: () => void;
    },
  ) => void;
  scroll: number;
  limit: number;
  progress: number;
  isScrolling: boolean;
  isStopped: boolean;
}

/* ════════════════════════════════════════
   DYNAMIC LENIS LOADER
   — imports at runtime (client-only)
   — avoids SSR issues completely
════════════════════════════════════════ */
let LenisClass: (new (opts: LenisOptions) => LenisInstance) | null = null;

async function getLenis() {
  if (LenisClass) return LenisClass;
  try {
    const mod = await import("lenis");
    // lenis exports primarily via default in modern versions
    // Use type assertion to handle both default and named export possibilities
    const lenisModule = mod as unknown as { default?: (new (opts: LenisOptions) => LenisInstance); Lenis?: (new (opts: LenisOptions) => LenisInstance) };
    LenisClass = (lenisModule.default ?? lenisModule.Lenis) as unknown as typeof LenisClass;
    return LenisClass;
  } catch {
    console.warn("[SmoothScroll] lenis not installed. Run: npm i lenis");
    return null;
  }
}

/* ════════════════════════════════════════
   EASING FUNCTIONS
════════════════════════════════════════ */
// smooth expo easing — feels premium, not floaty
const easeExpoOut = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

// gentle ease — for users who prefer subtle smoothness
const easeQuartOut = (t: number): number => 1 - Math.pow(1 - t, 4);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
interface SmoothScrollProps {
  children: React.ReactNode;
  /** Scroll duration in seconds (default: 1.1) */
  duration?: number;
  /** Easing preset (default: "expo") */
  easing?: "expo" | "quart";
  /** Wheel multiplier — higher = faster scroll (default: 1) */
  wheelMultiplier?: number;
  /** Touch multiplier (default: 1.5) */
  touchMultiplier?: number;
  /** Disable on mobile to avoid conflicts (default: false) */
  disableOnMobile?: boolean;
  /**
   * CSS selectors to EXCLUDE from smooth scroll
   * (e.g. modals, dropdowns, textareas)
   * default: common scrollable elements
   */
  excludeSelectors?: string[];
}

export default function SmoothScroll({
  children,
  duration = 1.1,
  easing = "expo",
  wheelMultiplier = 1,
  touchMultiplier = 1.5,
  disableOnMobile = false,
  excludeSelectors = [
    "[data-lenis-prevent]",
    "textarea",
    "select",
    "[data-radix-scroll-area-viewport]",
    ".overflow-auto",
    ".overflow-y-auto",
    ".overflow-scroll",
    ".overflow-y-scroll",
  ],
}: SmoothScrollProps) {
  const lenisRef = useRef<LenisInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const initedRef = useRef(false);

  useEffect(() => {
    /* guard double-init (React StrictMode) */
    if (initedRef.current) return;
    initedRef.current = true;

    /* skip on mobile if requested */
    const isMobile =
      typeof window !== "undefined" &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (disableOnMobile && isMobile) return;

    /* respect prefers-reduced-motion */
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let destroyed = false;

    const init = async () => {
      const Lenis = await getLenis();
      if (!Lenis || destroyed) return;

      /* prevent function: returns true = lenis ignores that element */
      const preventFn = (node: Element): boolean => {
        return excludeSelectors.some((sel) => {
          try {
            return node.matches(sel) || !!node.closest(sel);
          } catch {
            return false;
          }
        });
      };

      const easingFn = easing === "expo" ? easeExpoOut : easeQuartOut;

      const instance = new Lenis({
        duration,
        easing: easingFn,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false, // avoid fighting native iOS momentum
        touchMultiplier,
        wheelMultiplier,
        autoResize: true,
        prevent: preventFn,
      });

      lenisRef.current = instance;

      /* RAF loop */
      const raf = (time: number) => {
        if (destroyed) return;
        instance.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);

      /* sync with GSAP ScrollTrigger if available */
      try {
        const gsapMod = await import("gsap");
        const stMod = await import("gsap/ScrollTrigger");
        const gsap = gsapMod.default ?? gsapMod.gsap;
        const ScrollTrigger = stMod.default ?? stMod.ScrollTrigger;

        if (gsap && ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);

          /* tell ScrollTrigger about lenis scroll */
          instance.on("scroll", () => {
            ScrollTrigger.update();
          });

          /* tell ScrollTrigger to use lenis scroll values */
          ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value?: number) {
              if (arguments.length && value !== undefined) {
                instance.scrollTo(value, { immediate: true });
              }
              return instance.scroll;
            },
            getBoundingClientRect() {
              return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
              };
            },
            pinType:
              document.body.style.transform !== undefined
                ? "transform"
                : "fixed",
          });

          ScrollTrigger.addEventListener("refresh", () => {
            /* no-op — lenis handles resize */
          });

          ScrollTrigger.refresh();
        }
      } catch {
        /* gsap / ScrollTrigger not installed — skip */
      }
    };

    init();

    /* cleanup */
    return () => {
      destroyed = true;
      initedRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/* ════════════════════════════════════════
   SCROLL TO HOOK
   — use this anywhere to programmatically scroll
════════════════════════════════════════ */
export function useScrollTo() {
  const { lenis } = useSmoothScroll();

  return (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      onComplete?: () => void;
    },
  ) => {
    if (lenis.current) {
      lenis.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.1,
        easing: easeExpoOut,
        immediate: options?.immediate ?? false,
        onComplete: options?.onComplete,
      });
    } else {
      /* fallback: native scroll */
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "smooth" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
}

/* ════════════════════════════════════════
   SCROLL STOP / START HOOKS
   — useful when opening modals
════════════════════════════════════════ */
export function useScrollLock() {
  const { lenis } = useSmoothScroll();
  return {
    lock: () => lenis.current?.stop(),
    unlock: () => lenis.current?.start(),
  };
}
