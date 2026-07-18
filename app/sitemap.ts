import type { MetadataRoute } from "next";

const BASE = "https://bzsystems.io";

export default function sitemap(): MetadataRoute.Sitemap {
  // /ventures is deliberately excluded while the registry is locked;
  // re-add it when the lineup publishes.
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
