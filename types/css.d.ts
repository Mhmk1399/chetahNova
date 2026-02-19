// Type declarations for CSS modules and side-effect imports
declare module "*.css" {
  const content: { [className: string]: string };
  export = content;
  export default content;
}

// Extend React.CSSProperties to support CSS custom properties (variables)
// This allows using inline styles with CSS variables like --tw-ring-color
import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

// Type declarations for side-effect CSS imports (like Swiper CSS)
declare module "swiper/css";
declare module "swiper/css/autoplay";
declare module "swiper/css/effect-creative";
declare module "swiper/css/effect-fade";
declare module "swiper/css/effect-flip";
declare module "swiper/css/effect-coverflow";
declare module "swiper/css/effect-cube";
declare module "swiper/css/free-mode";
declare module "swiper/css/grid";
declare module "swiper/css/hash-navigation";
declare module "swiper/css/history";
declare module "swiper/css/keyboard";
declare module "swiper/css/manipulation";
declare module "swiper/css/mousewheel";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
declare module "swiper/css/parallax";
declare module "swiper/css/scrollbar";
declare module "swiper/css/thumbs";
declare module "swiper/css/virtual";
declare module "swiper/css/zoom";
