import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site.config";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = siteConfig.url;

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/admin/",
					"/dashboard/",
					"/settings/",
					"/api/",
					"/auth/callback/",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
