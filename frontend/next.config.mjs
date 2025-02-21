/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  // Keep React in strict mode for best practices
    eslint: {
        ignoreDuringBuilds: true,
      },
      typescript: {
        ignoreBuildErrors: true, // Disable TypeScript checks in Vercel
      },
  };
  
  export default nextConfig;
  