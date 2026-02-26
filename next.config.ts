import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cheetahnova.s3.eu-west-2.amazonaws.com",
        pathname: "/**", // Allows any path under the bucket (recommended for flexibility)
      },
    ],
  },
};

export default nextConfig;
