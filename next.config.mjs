
const nextConfig = {
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
      bodySizeLimit: "5mb", 
    },
  },
};

export default nextConfig;
