import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix: Empêche Next.js de remonter jusqu'au dossier personnel de l'utilisateur
  // en détectant des lockfiles parasites (ex: /home/alaeddine/package-lock.json).
  outputFileTracingRoot: __dirname,

  // Ship only the traced runtime dependency subset in .next/standalone
  // instead of the full node_modules tree, drastically shrinking the
  // Docker runtime image (verified below: Prisma's query engine binary
  // must be force-included since Next's file tracer doesn't discover it
  // through static analysis).
  output: "standalone",
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/**/*"],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/7.x/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
