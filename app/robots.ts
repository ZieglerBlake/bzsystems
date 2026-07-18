import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /ventures stays uncrawled while the registry is locked;
    // drop the disallow when the lineup publishes.
    rules: { userAgent: "*", allow: "/", disallow: "/ventures" },
    sitemap: "https://bzsystems.io/sitemap.xml",
  };
}
