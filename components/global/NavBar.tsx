"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

// ════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════

interface SubItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface MegaMenuContent {
  sections: {
    title: string;
    items: SubItem[];
  }[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
    label: string;
  };
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  megaMenu?: MegaMenuContent;
}

interface NavbarConfig {
  logo: {
    text: string;
    href: string;
    image?: string;
  };
  items: NavItem[];
  cta: {
    label: string;
    href: string;
  };
}

// ════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════

const Icons = {
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
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
  code: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  palette: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="2" fill="currentColor" />
      <circle cx="8" cy="14" r="2" fill="currentColor" />
      <circle cx="16" cy="14" r="2" fill="currentColor" />
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
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  bolt: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  chart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  robot: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
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
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  sparkles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ════════════════════════════════════════════════════════════════════

const defaultConfig: NavbarConfig = {
  logo: {
    text: "NEXUS",
    href: "/",
    image: "/assets/images/logo.png",
  },
  items: [
    {
      id: "services",
      label: "Services",
      href: "/services",
      megaMenu: {
        sections: [
          {
            title: "Design",
            items: [
              {
                id: "web-design",
                label: "Web Design",
                description: "Beautiful, conversion-focused websites",
                href: "/services/web-design",
                icon: Icons.palette,
              },
              {
                id: "ui-ux",
                label: "UI/UX Design",
                description: "User-centered digital experiences",
                href: "/services/ui-ux",
                icon: Icons.sparkles,
              },
              {
                id: "branding",
                label: "Brand Identity",
                description: "Memorable visual identities",
                href: "/services/branding",
                icon: Icons.globe,
              },
            ],
          },
          {
            title: "Development",
            items: [
              {
                id: "web-dev",
                label: "Web Development",
                description: "Fast, scalable web applications",
                href: "/services/web-development",
                icon: Icons.code,
                badge: "Popular",
              },
              {
                id: "ecommerce",
                label: "E-Commerce",
                description: "Online stores that convert",
                href: "/services/ecommerce",
                icon: Icons.chart,
              },
              {
                id: "api",
                label: "API Integration",
                description: "Connect your systems seamlessly",
                href: "/services/api",
                icon: Icons.bolt,
              },
            ],
          },
          {
            title: "Growth",
            items: [
              {
                id: "seo",
                label: "SEO",
                description: "Rank higher on Google",
                href: "/services/seo",
                icon: Icons.search,
              },
              {
                id: "ai",
                label: "AI Automation",
                description: "Smart business automation",
                href: "/services/ai",
                icon: Icons.robot,
                badge: "New",
              },
              {
                id: "security",
                label: "Security",
                description: "Protect your digital assets",
                href: "/services/security",
                icon: Icons.shield,
              },
            ],
          },
        ],
        featured: {
          title: "Case Study",
          description: "How we helped TechCorp increase conversions by 340%",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
          href: "/case-studies/techcorp",
          label: "Read Story",
        },
      },
    },
    {
      id: "work",
      label: "Work",
      href: "/work",
      megaMenu: {
        sections: [
          {
            title: "By Industry",
            items: [
              {
                id: "saas",
                label: "SaaS",
                description: "Software companies",
                href: "/work/saas",
                icon: Icons.code,
              },
              {
                id: "ecom",
                label: "E-Commerce",
                description: "Online retail",
                href: "/work/ecommerce",
                icon: Icons.chart,
              },
              {
                id: "fintech",
                label: "Fintech",
                description: "Financial services",
                href: "/work/fintech",
                icon: Icons.shield,
              },
            ],
          },
          {
            title: "By Service",
            items: [
              {
                id: "design-work",
                label: "Design Projects",
                description: "Visual & UX work",
                href: "/work/design",
                icon: Icons.palette,
              },
              {
                id: "dev-work",
                label: "Development",
                description: "Technical builds",
                href: "/work/development",
                icon: Icons.bolt,
              },
              {
                id: "growth-work",
                label: "Growth Campaigns",
                description: "Marketing success",
                href: "/work/growth",
                icon: Icons.globe,
              },
            ],
          },
        ],
        featured: {
          title: "Latest Project",
          description: "A complete rebrand for Nova Finance",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
          href: "/work/nova-finance",
          label: "View Project",
        },
      },
    },
    {
      id: "about",
      label: "About",
      href: "/about",
    },
    {
      id: "blog",
      label: "Blog",
      href: "/blog",
    },
  ],
  cta: {
    label: "Login",
    href: "/contact",
  },
};

// ════════════════════════════════════════════════════════════════════
// MAGNETIC BUTTON HOOK
// ════════════════════════════════════════════════════════════════════

const useMagneticEffect = (strength: number = 0.3) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
};

// ════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ════════════════════════════════════════════════════════════════════

const ScrollProgress = memo(function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-white/2 via-white/5 to-white/2">
      <div
        ref={progressRef}
        className="relative h-full transition-all duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)",
        }}
      >
        <div
          className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// TWO-LINE HAMBURGER MENU
// ════════════════════════════════════════════════════════════════════

const HamburgerButton = memo(function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.to(line1Ref.current, {
          y: 4,
          rotation: 45,
          duration: 0.4,
          ease: "power3.inOut",
        });
        gsap.to(line2Ref.current, {
          y: -4,
          rotation: -45,
          duration: 0.4,
          ease: "power3.inOut",
        });
      } else {
        gsap.to(line1Ref.current, {
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power3.inOut",
        });
        gsap.to(line2Ref.current, {
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power3.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <button
      onClick={onClick}
      className="group relative z-[60] flex h-12 w-12 flex-col items-center justify-center 
                 border border-white/10 bg-white/[0.03] backdrop-blur-sm
                 transition-all duration-300 hover:border-amber-400/30 hover:bg-amber-400/5 lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
        }}
      />

      <span
        ref={line1Ref}
        className="absolute h-[2px] w-5 origin-center bg-linear-to-r from-white/60 via-white/80 to-white/60
                   transition-colors duration-300 group-hover:from-amber-400/60 group-hover:via-amber-400/80 group-hover:to-amber-400/60"
        style={{ top: "calc(50% - 4px)" }}
      />

      <span
        ref={line2Ref}
        className="absolute h-[2px] w-5 origin-center bg-linear-to-r from-white/60 via-white/80 to-white/60
                   transition-colors duration-300 group-hover:from-amber-400/60 group-hover:via-amber-400/80 group-hover:to-amber-400/60"
        style={{ top: "calc(50% + 4px)" }}
      />
    </button>
  );
});

// ════════════════════════════════════════════════════════════════════
// ANIMATED NAV ITEM INDICATOR
// ════════════════════════════════════════════════════════════════════

const NavIndicator = memo(function NavIndicator({
  activeIndex,
  itemRefs,
}: {
  activeIndex: number | null;
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!indicatorRef.current) return;

    if (activeIndex !== null && itemRefs.current[activeIndex]) {
      const activeItem = itemRefs.current[activeIndex];
      if (!activeItem) return;

      const rect = activeItem.getBoundingClientRect();
      const parentRect = activeItem.parentElement?.getBoundingClientRect();

      if (parentRect) {
        gsap.to(indicatorRef.current, {
          width: rect.width,
          x: rect.left - parentRect.left,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    } else {
      gsap.to(indicatorRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [activeIndex, itemRefs]);

  return (
    <div
      ref={indicatorRef}
      className="pointer-events-none absolute bottom-0 left-0 h-[2px]"
      style={{
        background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
        opacity: 0,
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
      }}
    />
  );
});

// ════════════════════════════════════════════════════════════════════
// MEGA MENU PANEL
// ════════════════════════════════════════════════════════════════════

const MegaMenuPanel = memo(function MegaMenuPanel({
  content,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: {
  content: MegaMenuContent;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!panelRef.current || !contentRef.current) return;

    const panel = panelRef.current;
    const sections = contentRef.current.querySelectorAll(".menu-section");
    const featured = contentRef.current.querySelector(".featured-card");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        panel,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4 },
      )
        .fromTo(
          sections,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.35 },
          "-=0.2",
        )
        .fromTo(
          itemRefs.current.filter(Boolean),
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.025,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.25",
        )
        .fromTo(
          featured,
          { opacity: 0, x: 20, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.4 },
          "-=0.3",
        );
    }, panelRef);

    return () => ctx.revert();
  }, []);

  let itemIndex = 0;

  return (
    <div
      ref={panelRef}
      className="absolute left-1/2 top-full z-50 w-full max-w-5xl -translate-x-1/2 pt-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ opacity: 0 }}
    >
      <div className="absolute -top-4 left-0 right-0 h-4" />

      <div
        className="relative overflow-hidden border border-white/10 
                   bg-linear-to-b from-[#0A0C10]/98 to-[#080910]/98 
                   shadow-2xl shadow-black/60"
        style={{
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, transparent 50%, rgba(251, 191, 36, 0.05) 100%)",
          }}
        />

        <div className="absolute left-0 right-0 top-0 h-px">
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5) 30%, rgba(251, 191, 36, 0.8) 50%, rgba(251, 191, 36, 0.5) 70%, transparent)",
            }}
          />
        </div>

        <div ref={contentRef} className="relative flex">
          <div className="flex flex-1 gap-0 p-8">
            {content.sections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className="menu-section flex-1 px-6 first:pl-0 last:pr-0"
                style={{
                  borderLeft:
                    sectionIndex > 0
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                <h3 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30">
                  <span
                    className="h-px w-3"
                    style={{
                      background:
                        "linear-gradient(90deg, #F59E0B, transparent)",
                    }}
                  />
                  {section.title}
                </h3>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const currentIndex = itemIndex++;
                    return (
                      <Link
                        key={item.id}
                        ref={(el) => {
                          itemRefs.current[currentIndex] = el;
                        }}
                        href={item.href}
                        onClick={onClose}
                        className="menu-item group relative flex items-start gap-4 p-3 
                                   transition-all duration-300 hover:bg-white/[0.04]"
                      >
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, transparent 100%)",
                          }}
                        />

                        <span
                          className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center 
                                     border border-white/10 bg-white/[0.03]
                                     transition-all duration-300 group-hover:border-amber-400/30 
                                     group-hover:bg-amber-400/10"
                        >
                          <span className="h-4 w-4 text-white/40 transition-colors duration-300 group-hover:text-amber-400">
                            {item.icon}
                          </span>
                        </span>

                        <div className="relative min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[14px] font-semibold text-white/80 
                                         transition-colors duration-300 group-hover:text-white"
                            >
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className="shrink-0 bg-linear-to-r from-amber-400/20 to-orange-400/20 
                                           px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider 
                                           text-amber-400 ring-1 ring-amber-400/20"
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p
                              className="mt-1 text-[12px] leading-relaxed text-white/35 
                                        transition-colors duration-300 group-hover:text-white/50"
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        <span
                          className="relative mt-2 h-4 w-4 shrink-0 text-transparent 
                                     transition-all duration-300 group-hover:translate-x-1 
                                     group-hover:text-amber-400/60"
                        >
                          {Icons.arrow}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {content.featured && (
            <div className="featured-card w-72 border-l border-white/5 p-6">
              <Link
                href={content.featured.href}
                onClick={onClose}
                className="group block overflow-hidden border border-white/10 
                           bg-linear-to-b from-white/[0.04] to-transparent 
                           transition-all duration-500 hover:border-amber-400/20 
                           hover:shadow-lg hover:shadow-amber-400/5"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={content.featured.image}
                    alt={content.featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0A0C10] via-[#0A0C10]/40 to-transparent" />

                  <div
                    className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r 
                               from-transparent via-white/10 to-transparent transition-transform 
                               duration-1000 group-hover:translate-x-full"
                  />

                  <div
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center 
                               border border-white/20 bg-black/40 backdrop-blur-md 
                               transition-all duration-300 group-hover:scale-110 
                               group-hover:border-amber-400/40 group-hover:bg-amber-400/20"
                  >
                    <span className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45">
                      {Icons.arrowUpRight}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                    {content.featured.title}
                  </p>
                  <h4
                    className="mb-3 text-[14px] font-medium leading-snug text-white/80 
                               transition-colors duration-300 group-hover:text-white"
                  >
                    {content.featured.description}
                  </h4>

                  <span
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold 
                               text-white/50 transition-all duration-300 group-hover:text-amber-400"
                  >
                    {content.featured.label}
                    <span className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                      {Icons.arrow}
                    </span>
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-between border-t border-white/5 px-8 py-4">
          <p className="text-[11px] text-white/30">
            Need help choosing?{" "}
            <Link
              href="/contact"
              onClick={onClose}
              className="font-medium text-amber-400/70 transition-colors hover:text-amber-400"
            >
              Talk to an expert →
            </Link>
          </p>
          <Link
            href="/services"
            onClick={onClose}
            className="group flex items-center gap-1.5 border border-white/10 
                       bg-white/2 px-4 py-1.5 text-[11px] font-medium text-white/40 
                       transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white/70"
          >
            View all services
            <span className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5">
              {Icons.arrow}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// NAV LINK COMPONENT
// ════════════════════════════════════════════════════════════════════

const NavLink = memo(function NavLink({
  item,
  isActive,
  onMouseEnter,
  onMouseLeave,
  itemRef,
}: {
  item: NavItem;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  itemRef: (el: HTMLDivElement | null) => void;
}) {
  const hasMegaMenu = !!item.megaMenu;

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={item.href}
        className={`
          group relative flex items-center gap-1.5 px-5 py-3 text-[13px] font-semibold
          tracking-wide transition-all duration-300
          ${isActive ? "text-white" : "text-white/50 hover:text-white/80"}
        `}
      >
        <span
          className={`absolute inset-0 transition-all duration-300 ${
            isActive
              ? "bg-white/5"
              : "bg-transparent group-hover:bg-white/[0.03]"
          }`}
        />

        <span className="relative">{item.label}</span>

        {hasMegaMenu && (
          <span
            className={`relative h-3.5 w-3.5 transition-all duration-300 ${
              isActive
                ? "rotate-180 text-amber-400"
                : "text-white/30 group-hover:text-white/50"
            }`}
          >
            {Icons.chevronDown}
          </span>
        )}

        {isActive && (
          <span
            className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 bg-amber-400"
            style={{ boxShadow: "0 0 8px rgba(251, 191, 36, 0.8)" }}
          />
        )}
      </Link>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MOBILE MENU - SLIDE PANEL APPROACH
// ════════════════════════════════════════════════════════════════════

type MobileView = "main" | { type: "submenu"; item: NavItem };

const MobileMenu = memo(function MobileMenu({
  isOpen,
  items,
  cta,
  onClose,
}: {
  isOpen: boolean;
  items: NavItem[];
  cta: NavbarConfig["cta"];
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const subPanelRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<MobileView>("main");
  const animationRef = useRef<gsap.Context | null>(null);

  // Handle body scroll lock properly
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current) return;

    if (animationRef.current) {
      animationRef.current.revert();
    }

    animationRef.current = gsap.context(() => {
      if (isOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, x: "100%" },
          { opacity: 1, x: "0%", duration: 0.5, ease: "power3.out" },
        );

        const items =
          mainPanelRef.current?.querySelectorAll(".mobile-nav-item");
        if (items) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 40 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.05,
              duration: 0.4,
              delay: 0.2,
              ease: "power2.out",
            },
          );
        }
      }
    }, menuRef);

    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
    };
  }, [isOpen]);

  // Animate view transitions
  useEffect(() => {
    if (!mainPanelRef.current || !subPanelRef.current) return;

    const ctx = gsap.context(() => {
      if (currentView === "main") {
        gsap.to(mainPanelRef.current, {
          x: "0%",
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(subPanelRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(mainPanelRef.current, {
          x: "-30%",
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(subPanelRef.current, {
          x: "0%",
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        });

        const items = subPanelRef.current?.querySelectorAll(".sub-nav-item");
        if (items) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.03,
              duration: 0.3,
              delay: 0.15,
              ease: "power2.out",
            },
          );
        }
      }
    });

    return () => ctx.revert();
  }, [currentView]);

  const handleClose = useCallback(() => {
    setCurrentView("main");
    onClose();
  }, [onClose]);

  const openSubmenu = useCallback((item: NavItem) => {
    setCurrentView({ type: "submenu", item });
  }, []);

  const goBack = useCallback(() => {
    setCurrentView("main");
  }, []);

  if (!isOpen) return null;

  const activeSubmenuItem = currentView !== "main" ? currentView.item : null;

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-50 lg:hidden"
      style={{
        background:
          "linear-gradient(135deg, #08090C 0%, #0D0F14 50%, #08090C 100%)",
        opacity: 0,
        transform: "translateX(100%)",
      }}
    >
      {/* Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(251, 191, 36, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(90deg, white 1px, transparent 1px),
                           linear-gradient(white 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex h-20 items-center justify-between border-b border-white/[0.06] px-6">
        <span className="text-lg font-bold text-white">Menu</span>
        <button
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center border border-white/10 
                     bg-white/[0.03] text-white/60 transition-all duration-300 
                     hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-400"
        >
          <span className="h-5 w-5">{Icons.close}</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="relative h-[calc(100%-5rem)] overflow-hidden">
        {/* Main Panel */}
        <div
          ref={mainPanelRef}
          className="absolute inset-0 overflow-y-auto px-6 py-8"
        >
          <nav className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id} className="mobile-nav-item">
                {item.megaMenu ? (
                  <button
                    onClick={() => openSubmenu(item)}
                    className="group flex w-full items-center justify-between border-b border-white/[0.04] py-5"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="flex h-10 w-10 items-center justify-center border border-white/10 
                                   bg-white/2 font-mono text-xs text-white/30 
                                   transition-all duration-300 group-hover:border-amber-400/30 
                                   group-hover:bg-amber-400/10 group-hover:text-amber-400"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-lg font-medium text-white/80 transition-colors 
                                   duration-300 group-hover:text-white"
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="flex h-8 w-8 items-center justify-center text-white/30 
                                 transition-all duration-300 group-hover:translate-x-1 
                                 group-hover:text-amber-400"
                    >
                      <span className="h-4 w-4">{Icons.chevronRight}</span>
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={handleClose}
                    className="group flex items-center gap-4 border-b border-white/[0.04] py-5"
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center border border-white/10 
                                 bg-white/2 font-mono text-xs text-white/30 
                                 transition-all duration-300 group-hover:border-amber-400/30 
                                 group-hover:bg-amber-400/10 group-hover:text-amber-400"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-lg font-medium text-white/80 transition-colors 
                                 duration-300 group-hover:text-white"
                    >
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href={cta.href}
              onClick={handleClose}
              className="group relative flex w-full items-center justify-center gap-3 
                         overflow-hidden border border-amber-400/30 bg-linear-to-r 
                         from-amber-400/10 to-orange-400/5 py-4 text-base font-semibold 
                         text-amber-400 transition-all duration-300 hover:border-amber-400/50 
                         hover:from-amber-400/15 hover:to-orange-400/10"
            >
              <span className="relative z-10">{cta.label}</span>
              <span className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                {Icons.arrow}
              </span>
              <span
                className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r 
                           from-transparent via-white/10 to-transparent transition-transform 
                           duration-700 group-hover:translate-x-full"
              />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-10">
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-6">
              <p className="text-xs text-white/25">
                © {new Date().getFullYear()}
              </p>
              <div className="flex gap-6">
                {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-xs text-white/30 transition-colors hover:text-amber-400"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submenu Panel */}
        <div
          ref={subPanelRef}
          className="absolute inset-0 overflow-y-auto bg-[#08090C] px-6 py-8"
          style={{ transform: "translateX(100%)", opacity: 0 }}
        >
          {activeSubmenuItem?.megaMenu && (
            <>
              {/* Back Button */}
              <button
                onClick={goBack}
                className="group mb-8 flex items-center gap-3 text-white/50 
                           transition-colors duration-300 hover:text-white"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center border border-white/10 
                             bg-white/2 transition-all duration-300 
                             group-hover:border-amber-400/30 group-hover:bg-amber-400/10"
                >
                  <span className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5">
                    {Icons.arrowLeft}
                  </span>
                </span>
                <span className="text-sm font-medium">Back</span>
              </button>

              {/* Submenu Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {activeSubmenuItem.label}
                </h2>
                <div
                  className="mt-2 h-0.5 w-12"
                  style={{
                    background: "linear-gradient(90deg, #F59E0B, transparent)",
                  }}
                />
              </div>

              {/* Sections */}
              {activeSubmenuItem.megaMenu.sections.map((section) => (
                <div key={section.title} className="mb-8">
                  <h3
                    className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase 
                               tracking-[0.2em] text-white/25"
                  >
                    <span
                      className="h-px w-4"
                      style={{
                        background:
                          "linear-gradient(90deg, #F59E0B50, transparent)",
                      }}
                    />
                    {section.title}
                  </h3>

                  <div className="space-y-1">
                    {section.items.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        onClick={handleClose}
                        className="sub-nav-item group flex items-center gap-4 border-b 
                                   border-white/[0.03] py-4 transition-all duration-300 
                                   hover:bg-white/2"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center 
                                     border border-white/10 bg-white/2 transition-all 
                                     duration-300 group-hover:border-amber-400/30 
                                     group-hover:bg-amber-400/10"
                        >
                          <span
                            className="h-4 w-4 text-white/30 transition-colors 
                                       duration-300 group-hover:text-amber-400"
                          >
                            {subItem.icon}
                          </span>
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[15px] font-medium text-white/70 
                                         transition-colors duration-300 group-hover:text-white"
                            >
                              {subItem.label}
                            </span>
                            {subItem.badge && (
                              <span
                                className="bg-linear-to-r from-amber-400/15 to-orange-400/15 
                                           px-2 py-0.5 text-[9px] font-bold uppercase text-amber-400 
                                           ring-1 ring-amber-400/20"
                              >
                                {subItem.badge}
                              </span>
                            )}
                          </div>
                          {subItem.description && (
                            <p className="mt-0.5 text-xs text-white/35">
                              {subItem.description}
                            </p>
                          )}
                        </div>

                        <span
                          className="h-4 w-4 shrink-0 text-white/20 transition-all 
                                     duration-300 group-hover:translate-x-1 group-hover:text-amber-400/60"
                        >
                          {Icons.arrow}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Featured Card */}
              {activeSubmenuItem.megaMenu.featured && (
                <Link
                  href={activeSubmenuItem.megaMenu.featured.href}
                  onClick={handleClose}
                  className="sub-nav-item group mt-8 block border border-white/10 
                             bg-linear-to-b from-white/[0.03] to-transparent 
                             transition-all duration-300 hover:border-amber-400/20"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={activeSubmenuItem.megaMenu.featured.image}
                      alt={activeSubmenuItem.megaMenu.featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#08090C] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                      {activeSubmenuItem.megaMenu.featured.title}
                    </p>
                    <p className="text-sm text-white/60">
                      {activeSubmenuItem.megaMenu.featured.description}
                    </p>
                    <span
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold 
                                 text-white/40 transition-colors duration-300 group-hover:text-amber-400"
                    >
                      {activeSubmenuItem.megaMenu.featured.label}
                      <span className="h-3 w-3">{Icons.arrow}</span>
                    </span>
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════
// MAIN NAVBAR COMPONENT
// ════════════════════════════════════════════════════════════════════

const Navbar: React.FC<{ config?: NavbarConfig }> = ({
  config = defaultConfig,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useMagneticEffect(0.2);

  const activeIndex = useMemo(() => {
    return config.items.findIndex((item) => item.id === activeMenu);
  }, [activeMenu, config.items]);

  const activeMegaMenu = useMemo(() => {
    const activeItem = config.items.find((item) => item.id === activeMenu);
    return activeItem?.megaMenu || null;
  }, [activeMenu, config.items]);

  // Scroll handler
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMenuOpen = useCallback((id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(id);
  }, []);

  const handleMenuClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const handleMenuPanelEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleMenuPanelLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 py-2 sm:py-3"
        style={{ opacity: 0 }}
      >
        <nav className="relative mx-auto max-w-[98%] px-3 sm:max-w-[95%] sm:px-4">
          <div
            className={`
              relative flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3 
              border transition-all duration-500
              ${
                isScrolled
                  ? "border-white/15 bg-[#08090C]/80 shadow-2xl shadow-black/40"
                  : "border-white/[0.06] bg-[#08090C]/40"
              }
            `}
            style={{
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
            }}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isScrolled ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(251, 191, 36, 0.03) 0%, transparent 50%, rgba(251, 191, 36, 0.02) 100%)",
              }}
            />

            {/* Logo */}
            <Link
              href={config.logo.href}
              className="group relative z-10 flex items-center gap-3"
            >
              <div className="relative h-12 w-24 sm:h-16 sm:w-36 transition-transform duration-300 group-hover:scale-105">
                {config.logo.image ? (
                  <Image
                    src={config.logo.image}
                    alt={config.logo.text}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <span className="flex h-full items-center text-xl font-bold text-white">
                    {config.logo.text}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="relative hidden items-center lg:flex">
              {config.items.map((item, index) => (
                <NavLink
                  key={item.id}
                  item={item}
                  isActive={activeMenu === item.id}
                  onMouseEnter={() => item.megaMenu && handleMenuOpen(item.id)}
                  onMouseLeave={handleMenuClose}
                  itemRef={(el) => {
                    navItemRefs.current[index] = el;
                  }}
                />
              ))}

              <NavIndicator
                activeIndex={activeIndex >= 0 ? activeIndex : null}
                itemRefs={navItemRefs}
              />
            </div>

            {/* CTA Button */}
            <div ref={ctaRef} className="hidden lg:block">
              <Link
                href={config.cta.href}
                className="group relative z-10 flex items-center gap-2.5 overflow-hidden 
                           border border-amber-400/25 bg-linear-to-r from-amber-400/10 
                           to-amber-400/5 px-6 py-2.5 text-[12px] font-bold uppercase 
                           tracking-wider text-amber-400 transition-all duration-300 
                           hover:border-amber-400/50 hover:from-amber-400/15 hover:to-amber-400/10 
                           hover:shadow-lg hover:shadow-amber-400/10"
              >
                <span className="relative z-10">{config.cta.label}</span>
                <span className="relative z-10 h-4 w-4 overflow-hidden">
                  <span
                    className="absolute inset-0 flex items-center justify-center 
                               transition-transform duration-300 group-hover:translate-x-6"
                  >
                    {Icons.arrow}
                  </span>
                  <span
                    className="absolute inset-0 flex -translate-x-6 items-center 
                               justify-center transition-transform duration-300 
                               group-hover:translate-x-0"
                  >
                    {Icons.arrow}
                  </span>
                </span>

                <span
                  className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r 
                             from-transparent via-white/15 to-transparent transition-transform 
                             duration-700 group-hover:translate-x-full"
                />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <HamburgerButton isOpen={isMobileOpen} onClick={toggleMobile} />

            {/* Scroll Progress Bar */}
            <ScrollProgress />
          </div>

          {/* Mega Menu */}
          {activeMegaMenu && (
            <MegaMenuPanel
              content={activeMegaMenu}
              onMouseEnter={handleMenuPanelEnter}
              onMouseLeave={handleMenuPanelLeave}
              onClose={handleCloseMenu}
            />
          )}
        </nav>
      </header>

      {/* Backdrop for Mega Menu */}
      <div
        className={`fixed inset-0 z-40 hidden transition-all duration-500 lg:block ${
          activeMenu
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(8, 9, 12, 0.6) 0%, rgba(8, 9, 12, 0.8) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={handleCloseMenu}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileOpen}
        items={config.items}
        cta={config.cta}
        onClose={closeMobile}
      />

      {/* Spacer */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default memo(Navbar);
export type { NavbarConfig, NavItem, MegaMenuContent, SubItem };
