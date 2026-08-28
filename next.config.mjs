/** @type {import('next').NextConfig} */
const securityHeaders = [
  // 1. Protection contre le Clickjacking
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // 2. Prévention du reniflage de type MIME (MIME-Sniffing)
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // 3. Politique de référent sécurisée
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // 4. Restriction des APIs du navigateur non nécessaires
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  // 5. Isolation de l'environnement d'exécution
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  // 6. Forcer HTTPS avec HSTS (Strict-Transport-Security)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // 7. Politique de Sécurité du Contenu (Content Security Policy - CSP)
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: blob: https: http:;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.web3forms.com;
      frame-ancestors 'self';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig = {
  // Masquer la bannière "X-Powered-By: Next.js"
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
