// Imports - Node
import createNextIntlPlugin from "next-intl/plugin";

// Import Types - Node
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	poweredByHeader: false,
	productionBrowserSourceMaps: true,
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	images: {
		deviceSizes: [768, 1280, 1920, 2440],
		imageSizes: [20, 30, 50, 80, 100]
	}
};

const withi18nPlugin = createNextIntlPlugin("./lib/i18n/request.ts");

// Exports
export default withi18nPlugin(nextConfig);
