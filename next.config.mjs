/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Replace YOUR-PROJECT-REF with your actual Supabase project ref.
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["three", "@react-three/fiber", "@react-three/drei"],
  },
};

export default nextConfig;
