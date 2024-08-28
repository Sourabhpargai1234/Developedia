/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
      },
      experimental: {
        // This flag should be enabled if you're using experimental features
        reactMode: 'concurrent',
      },
};

export default nextConfig;
