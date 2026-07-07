import type { MetadataRoute } from "next";

const routes = [
  "",
  "/dashboard",
  "/market",
  "/screener",
  "/insiders",
  "/congress",
  "/etfs",
  "/crypto",
  "/economic-calendar",
  "/news",
  "/portfolio",
  "/research-lab",
  "/ai-insights",
  "/about",
  "/pricing",
  "/contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "hourly",
    priority: route === "" ? 1 : 0.8
  }));
}
