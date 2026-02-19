// components/smooth-scroll/ScrollAnchor.tsx
"use client";

/**
 * Drop-in replacement for <a href="#section-id">
 * Works with lenis smooth scroll automatically.
 *
 * Usage:
 *   <ScrollAnchor href="#services" offset={-80}>
 *     Go to services
 *   </ScrollAnchor>
 */

import React from "react";
import { useScrollTo } from "./SmoothScroll";

interface ScrollAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  offset?: number;
  duration?: number;
  children: React.ReactNode;
}

export default function ScrollAnchor({
  href,
  offset = 0,
  duration,
  children,
  onClick,
  ...rest
}: ScrollAnchorProps) {
  const scrollTo = useScrollTo();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        scrollTo(target as HTMLElement, { offset, duration });
      }
      onClick?.(e);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}