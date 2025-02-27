/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ticket-assignment-system-backend-thiago-butignon.vercel.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
