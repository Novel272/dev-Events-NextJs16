import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors : true,
  },
  cacheComponents :true,
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  /**
   * Disable trailing slash redirects globally to support PostHog API requests.
   *
   * IMPORTANT: This has application-wide implications:
   * - URLs with and without trailing slashes are treated as distinct paths
   * - Risk of duplicate content issues for SEO (e.g., /page and /page/ both exist)
   * - Inconsistent URL patterns across the app if not enforced consistently
   *
   * Consider alternative approaches:
   * 1. Use middleware to enforce a canonical trailing-slash policy app-wide
   * 2. Handle PostHog routes explicitly instead of disabling globally
   * 3. Implement redirects for user-facing routes while allowing API flexibility
   */
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
