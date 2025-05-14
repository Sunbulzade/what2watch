import "@/styles/globals.css";

// Imports - Local
import Navbar from "@/components/navbar";
import { geist } from "@/styles/fonts";

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
	return {
		metadataBase: new URL(HOST),
		title: {
			default: "What2Watch",
			template: "%s | What2Watch"
		},
		category: "E-Commerce",
		creator: "Melihhan Fakir",
		publisher: "Melmenware LLC",
		generator: "Next.js",
		referrer: "no-referrer-when-downgrade",
		authors: [{ name: "Melihhan Fakir", url: "https://melihhanfakir.com" }],
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
	return (
		<html lang="en" dir="ltr" style={{ scrollBehavior: "smooth" }} suppressHydrationWarning>
			<body className={`relative antialiased text-foreground bg-background ${FONT_VARIABLES.join(" ")}`}>
				<div id="__next" className="w-full min-h-screen flex flex-col font-geist">
					<Navbar />
					{children}
				</div>
			</body>
		</html >
	);
}

// Exports
export { LocaleLayout as default, viewport, generateMetadata };
