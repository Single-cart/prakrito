/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        
      }
    ]
  }
}

export default nextConfig
