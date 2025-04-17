import "@/styles/globals.css";

// Imports - Node
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

// Imports - Local
import Navbar from "@/components/navbar";
import { geist } from "@/styles/fonts";
import { routing } from "@/lib/i18n/routing";

// Import Types - Node
import type { Metadata, ResolvingMetadata, Viewport } from "next";

// Import Types - Local
import type { Locale } from "@/lib/i18n/routing";

const HOST = process.env.HOST ?? `http://localhost:${process.env.PORT || 3000}`;
const FONT_VARIABLES: string[] = [geist.variable];

type Params = Promise<{ locale: Locale; }>;

type Props = Readonly<{
	params: Params;
	children: React.ReactNode;
}>;

const viewport: Viewport = {
	colorScheme: "light dark",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
	]
};

async function generateMetadata({ }: Omit<Props, "children">, _parent: ResolvingMetadata): Promise<Metadata> {
	const t = await getTranslations("Metadata");

	return {
		metadataBase: new URL(HOST),
		title: {
			default: t("Title.default"),
			template: t("Title.template")
		},
		category: t("category"),
		creator: "Melihhan Fakir",
		publisher: "Melmenware LLC",
		generator: "Next.js",
		referrer: "no-referrer-when-downgrade",
		assets: ["/assets"],
		authors: [{ name: "Melihhan Fakir", url: "https://www.melihhanfakir.com" }],
		formatDetection: {
			email: false,
			address: false,
			telephone: false
		},
		other: {
			"coverage": "Worldwide",
			"distribution": "Global",
			"designer": "Melihhan Fakir",
			"reply-to": "melihhan.fakir@gmail.com"
		}
	};
}

async function LocaleLayout({ children, params }: Props): Promise<React.ReactNode> {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale} dir="ltr" style={{ scrollBehavior: "smooth" }} suppressHydrationWarning>
			<body className={`relative antialiased text-foreground bg-background ${FONT_VARIABLES.join(" ")}`}>
				<NextIntlClientProvider messages={messages}>
					<div id="__next" className="w-full min-h-screen flex flex-col font-geist">
						<Navbar />
						{children}
					</div>
				</NextIntlClientProvider>
			</body>
		</html >
	);
}

// Exports
export { LocaleLayout as default, viewport, generateMetadata };
