// Imports - Local
import en from "./resources/en.json";
import { formats } from "./lib/i18n/request";
import { routing } from "./lib/i18n/routing";

type Locales = typeof routing.locales;
type Formats = typeof formats;
type Messages = typeof en;

declare module "next-intl" {
	interface AppConfig {
		Locale: Locales[number];
		Formats: Formats;
		Messages: Messages;
	}
}
