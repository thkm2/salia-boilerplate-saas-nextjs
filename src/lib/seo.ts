import type { Metadata } from "next";
import { siteConfig } from "./site.config";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CreateMetadataOptions {
	title?: string;
	description?: string;
	path?: string;
	image?: string;
	noIndex?: boolean;
}

// ─── Root Metadata ──────────────────────────────────────────────────────────
// Use this in app/layout.tsx for site-wide defaults

export function createRootMetadata(): Metadata {
	return {
		metadataBase: new URL(siteConfig.url),
		title: {
			default: siteConfig.name,
			template: `%s | ${siteConfig.name}`,
		},
		description: siteConfig.description,
		keywords: [...siteConfig.keywords],
		authors: [{ name: siteConfig.organization.name }],
		creator: siteConfig.organization.name,
		openGraph: {
			type: "website",
			locale: siteConfig.locale,
			url: siteConfig.url,
			siteName: siteConfig.name,
			title: siteConfig.name,
			description: siteConfig.description,
			images: [
				{
					url: siteConfig.ogImage,
					width: 1200,
					height: 630,
					alt: siteConfig.name,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: siteConfig.name,
			description: siteConfig.description,
			images: [siteConfig.ogImage],
			creator: siteConfig.twitterHandle,
		},
		icons: {
			icon: "/favicon.ico",
			shortcut: "/favicon-16x16.png",
			apple: "/apple-touch-icon.png",
		},
	};
}

// ─── Page Metadata ──────────────────────────────────────────────────────────
// Use this in individual pages for page-specific metadata

export function createMetadata({
	title,
	description,
	path = "",
	image,
	noIndex = false,
}: CreateMetadataOptions = {}): Metadata {
	const url = `${siteConfig.url}${path}`;
	const ogImage = image || siteConfig.ogImage;

	return {
		title,
		description,
		openGraph: {
			title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
			description: description || siteConfig.description,
			url,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title || siteConfig.name,
				},
			],
		},
		twitter: {
			title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
			description: description || siteConfig.description,
			images: [ogImage],
		},
		alternates: {
			canonical: url,
		},
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
}

// ─── Utility ────────────────────────────────────────────────────────────────

export function getAbsoluteUrl(path: string): string {
	return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
