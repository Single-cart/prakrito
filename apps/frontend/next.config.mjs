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
        
      },
      {
        protocol: "https",
        hostname: "server.prakrito.com",
        
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/js/:path*',
        destination: 'https://serverstape.prakrito.com/js/:path*',
      },
    ]
  },
}

export default nextConfig
