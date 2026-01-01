import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* In Next.js 16, linting and type-checking are no longer 
    part of the 'next build' command by default. 
    You do not need ignoreDuringBuilds here anymore.
  */
  reactStrictMode: true,
  // Force webpack instead of Turbopack for Next.js 16
  turbopack: {}, // Empty turbopack config to silence the error
  webpack: (config, { isServer }) => {
    // Ensure we're using webpack, not turbopack
    return config;
  },
};

export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
