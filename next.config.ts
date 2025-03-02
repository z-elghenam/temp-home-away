import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      {
        protocol: "https",
        hostname: "rurzgdtbaxnolcybaipn.supabase.co",
        pathname: "/storage/v1/object/public/temp-home-away/**",
      },
    ],
  },
    experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Increase the limit to 10 MB (or any size you need)
    },
  },
};

export default nextConfig;
