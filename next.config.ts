import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally, you can also ignore TypeScript errors during builds 
    // if you encounter similar issues with types.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
