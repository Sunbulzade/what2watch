// Import Types - Node
import type { MetadataRoute } from "next";

const HOST = process.env.HOST ?? `http://localhost:${process.env.PORT || 3000}`;

function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [""]
		},
		sitemap: `${HOST}/sitemap.xml`
	};
}

// Exports
export default robots;
