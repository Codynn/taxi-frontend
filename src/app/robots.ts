import type { MetadataRoute } from "next";

const BASE_URL = "https://lokpriyataxi.com.np";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // User-specific / transactional pages should not be indexed.
      disallow: [
        "/checkout",
        "/complete-booking",
        "/choose-ride",
        "/my-bookings",
        "/profile",
        "/oauth",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
