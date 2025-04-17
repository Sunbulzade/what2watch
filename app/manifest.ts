// Imports - Node
import { getTranslations } from "next-intl/server";

// Imports - Local
import { routing } from "@/lib/i18n/routing";

// Import Types - Node
import type { MetadataRoute } from "next";

type CustomScreenshots = {
	src: string;
	type?: string;
	sizes?: string;
	form_factor?: "wide" | "narrow";
	label?: string;
}[] | undefined;

async function manifest(): Promise<MetadataRoute.Manifest> {
	const locale = routing.defaultLocale;
	const t = await getTranslations({ locale, namespace: "Metadata.Manifest" });

	return {
		lang: locale,
		dir: "ltr",
		name: t("name"),
		short_name: t("short_name"),
		description: t("description"),
		id: "/",
		start_url: "/",
		theme_color: "#0a0a0a",
		background_color: "#0a0a0a",
		orientation: "natural",
		display: "standalone",
		display_override: ["standalone", "browser", "window-controls-overlay"],
		// icons: [
		// 	{
		// 		src: "/favicon.ico",
		// 		sizes: "48x48",
		// 		type: "image/x-icon"
		// 	},
		// 	{
		// 		src: "/assets/favicon/favicon-maskable.ico",
		// 		sizes: "48x48",
		// 		type: "image/x-icon",
		// 		purpose: "maskable"
		// 	},
		// 	{
		// 		src: "/assets/favicon/apple-touch-icon.png",
		// 		sizes: "180x180",
		// 		type: "image/png"
		// 	},
		// 	{
		// 		src: "/assets/favicon/apple-touch-icon-maskable.png",
		// 		sizes: "180x180",
		// 		type: "image/png",
		// 		purpose: "maskable"
		// 	},
		// 	{
		// 		src: "/assets/favicon/android-chrome-192x192.png",
		// 		sizes: "192x192",
		// 		type: "image/png"
		// 	},
		// 	{
		// 		src: "/assets/favicon/android-chrome-maskable-192x192.png",
		// 		sizes: "192x192",
		// 		type: "image/png",
		// 		purpose: "maskable"
		// 	},
		// 	{
		// 		src: "/assets/favicon/android-chrome-512x512.png",
		// 		sizes: "512x512",
		// 		type: "image/png"
		// 	},
		// 	{
		// 		src: "/assets/favicon/android-chrome-maskable-512x512.png",
		// 		sizes: "512x512",
		// 		type: "image/png",
		// 		purpose: "maskable"
		// 	}
		// ],
		// screenshots: [
		// 	{
		// 		src: "/assets/screenshots/desktop.png",
		// 		sizes: "2560x1440",
		// 		type: "image/png",
		// 		form_factor: "wide",
		// 		label: "Desktop Image"
		// 	},
		// 	{
		// 		src: "/assets/screenshots/desktop-contact.png",
		// 		sizes: "2560x1440",
		// 		type: "image/png",
		// 		form_factor: "wide",
		// 		label: "Desktop Contact Image"
		// 	},
		// 	{
		// 		src: "/assets/screenshots/mobile.png",
		// 		sizes: "400x858",
		// 		type: "image/png",
		// 		form_factor: "narrow",
		// 		label: "Mobile Image"
		// 	},
		// 	{
		// 		src: "/assets/screenshots/mobile-menu.png",
		// 		sizes: "400x858",
		// 		type: "image/png",
		// 		form_factor: "narrow",
		// 		label: "Mobile Menu Image"
		// 	}
		// ] as CustomScreenshots
	};
}

// Exports
export default manifest;
