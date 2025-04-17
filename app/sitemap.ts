// Imports - Local
import { getPathname, routing } from "@/lib/i18n/routing";

// Import Types - Node
import type { MetadataRoute } from "next";

// Import Types - Local
import type { Locale } from "@/lib/i18n/routing";

type Href = Parameters<typeof getPathname>[number]["href"];

const HOST = process.env.HOST ?? `http://localhost:${process.env.PORT || 3000}`;

function getUrl(href: Href, locale: Locale) {
	const pathname = getPathname({ locale, href });
	return `${HOST}${pathname}`;
}

function getEntry(href: Href): MetadataRoute.Sitemap {
	return routing.locales.map(locale => ({
		url: getUrl(href, locale),
		priority: 1,
		alternates: {
			languages: Object.fromEntries(
				routing.locales.map(locale => [locale, getUrl(href, locale)])
			)
		},
		lastModified: new Date(),
		changeFrequency: "weekly"
	}));
}

function sitemap(): MetadataRoute.Sitemap {
	return [
		...getEntry("/")
	];
}

// Exports
export default sitemap;
