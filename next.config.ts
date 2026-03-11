import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
    ],
  },
};

export default nextConfig;
