import type { MetadataRoute } from "next";

const BASE = "https://bzsystems.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ventures`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
