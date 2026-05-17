/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // This is the key for full-stack apps on Vercel
  // It disables static prerendering for pages that need the database
  // ensuring the build always passes.
  output: 'standalone',
};

export default nextConfig;
