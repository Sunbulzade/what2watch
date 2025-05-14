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

// Exports
export default nextConfig;
