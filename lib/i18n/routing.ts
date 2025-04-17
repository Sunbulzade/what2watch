// Imports - Node
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

// The `pathnames` object holds pairs of internal and
// external paths. Based on the locale, the external
// paths are rewritten to the shared, internal ones.
const routing = defineRouting({
	localePrefix: "always",
	locales: ["en", "tr"],
	defaultLocale: "en",
	pathnames: {
		"/": "/",
		"/login": {
			"en": "/login",
			"tr": "/giris-yap"
		},
		"/movies": {
			"en": "/movies",
			"tr": "/filmler"
		},
		// "/movies/[id]": {
		// 	"en": "/movies/[id]",
		// 	"tr": "/filmler/[id]"
		// },
		"/profile": {
			"en": "/profile",
			"tr": "/profil"
		},
		"/recommendations": {
			"en": "/recommendations",
			"tr": "/öneriler"
		},
		"/settings": {
			"en": "/settings",
			"tr": "/ayarlar"
		},
		"/signup": {
			"en": "/signup",
			"tr": "/kayit-ol"
		}
	}
});

type Locale = (typeof routing.locales)[number];
type Pathnames = keyof typeof routing.pathnames;

// Export Types
export type { Locale, Pathnames };

// Exports
export { routing };
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
