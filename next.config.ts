/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pg"],
  images: {
    domains: ["your-api.com"], 
  },
};
export default nextConfig;
