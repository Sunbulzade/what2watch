// Imports - Node
import { getRequestConfig } from "next-intl/server";

// Imports - Local
import { routing } from "./routing";

// Import Types - Node
import type { Formats } from "next-intl";

const formats = {
	dateTime: {
		short: {
			day: "numeric",
			month: "short",
			year: "numeric"
		}
	},
	number: {
		precise: {
			maximumFractionDigits: 5
		}
	},
	list: {
		enumeration: {
			style: "long",
			type: "conjunction"
		}
	}
} satisfies Formats;

const requestConfig = getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	let locale = await requestLocale;

	// Ensure that a valid locale is used
	if (!locale || !routing.locales.includes(locale as any)) { locale = routing.defaultLocale; }

	return {
		locale,
		messages: (await import(`../../resources/${locale}.json`)).default
	};
});

// Exports
export { requestConfig as default, formats };
