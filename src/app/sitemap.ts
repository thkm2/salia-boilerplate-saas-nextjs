import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site.config";

// ─── Public Routes ──────────────────────────────────────────────────────────
// Add your public routes here. Authenticated routes should NOT be included.

const publicRoutes = [
	"/",
	"/auth",
	// Add more public routes as your app grows:
	// "/pricing",
	// "/about",
	// "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteConfig.url;

	return publicRoutes.map((route) => ({
		url: `${baseUrl}${route === "/" ? "" : route}`,
		lastModified: new Date(),
		changeFrequency: route === "/" ? "weekly" : "monthly",
		priority: route === "/" ? 1 : 0.8,
	}));
}
