import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/onboarding/", "/proposal/", "/contract/", "/invoice/"],
    },
    sitemap: "https://nanisystems.com/sitemap.xml",
  };
}
