import "@/styles/globals.css";

// Imports - Local
import Navbar from "@/components/navbar";
import { geist } from "@/styles/fonts";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";

// Import Types - Node
import type { Metadata, ResolvingMetadata, Viewport } from "next";

const HOST = process.env.HOST ?? `http://localhost:${process.env.PORT || 3000}`;
const FONT_VARIABLES: string[] = [geist.variable];

type Props = Readonly<{
  children: React.ReactNode;
}>;

const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ]
};

async function generateMetadata(_props: Omit<Props, "children">, _parent: ResolvingMetadata): Promise<Metadata> {
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

async function LocaleLayout({ children }: Props): Promise<React.ReactNode> {
	return (
		<html lang="en" dir="ltr" style={{ scrollBehavior: "smooth" }} suppressHydrationWarning>
			<body className={`relative antialiased text-foreground bg-background ${FONT_VARIABLES.join(" ")}`}>
				<AuthProvider>
					<div id="__next" className="w-full min-h-screen flex flex-col font-geist">
						<Navbar />
						{children}
						<Toaster />
					</div>
				</AuthProvider>
			</body>
		</html >
	);
}

// Exports
export { LocaleLayout as default, viewport, generateMetadata };
