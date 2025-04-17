"use client";

// Imports - Node
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Search, Film, User, Menu, X, LogIn } from "lucide-react";

// Imports - Local
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";

// Import Types - Local
import type { Pathnames } from "@/lib/i18n/routing";

export default function Navbar() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Skip navbar on login and signup pages
	if (pathname === "/login" || pathname === "/signup") {
		return null;
	}

	const isActive = (path: string) => {
		return pathname === path;
	};

	const navItems: { name: string; path: Pathnames; icon: React.ReactNode; }[] = [
		{ name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
		{ name: "Recommendations", path: "/recommendations", icon: <Search className="h-5 w-5" /> },
		{ name: "Movies", path: "/movies", icon: <Film className="h-5 w-5" /> },
		{ name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
	];

	return (
		<>
			{/* Mobile Navbar */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
				<div className="flex justify-around items-center h-16">
					{navItems.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							className={`flex flex-col items-center justify-center w-full h-full ${isActive(item.path) ? "text-purple-600" : "text-gray-600 hover:text-gray-900"
								}`}
						>
							{item.icon}
							<span className="text-xs mt-1">{item.name}</span>
						</Link>
					))}
				</div>
			</div>

			{/* Desktop Navbar */}
			<header className="hidden md:flex md:justify-center fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
				<div className="container px-4 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center">
						<span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
							What2Watch
						</span>
					</Link>

					<nav className="hidden md:flex items-center space-x-1">
						{navItems.map((item) => (
							<Button
								key={item.path}
								asChild
								variant="ghost"
								className={`px-4 ${isActive(item.path)
									? "bg-gray-100 text-gray-900"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
									}`}
							>
								<Link href={item.path} className="flex items-center">
									{item.icon}
									<span className="ml-2">{item.name}</span>
								</Link>
							</Button>
						))}
					</nav>

					<div className="flex items-center space-x-2">
						<Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
							<Link href="/login">
								<LogIn className="h-5 w-5 mr-2" /> Login
							</Link>
						</Button>
						<Button
							asChild
							className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
						>
							<Link href="/signup">Sign Up</Link>
						</Button>
					</div>
				</div>
			</header>

			{/* Mobile Menu Button (only shown on pages that need it) */}
			{pathname !== "/" && (
				<div className="md:hidden fixed top-4 right-4 z-50">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="bg-white/80 backdrop-blur-md border-gray-200"
					>
						{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			)}

			{/* Mobile Menu Overlay */}
			{isMenuOpen && (
				<div className="md:hidden fixed inset-0 z-40 bg-white/95 flex flex-col items-center justify-center">
					<div className="flex flex-col items-center space-y-6">
						{navItems.map((item) => (
							<Button
								key={item.path}
								asChild
								variant="ghost"
								size="lg"
								className={`text-xl ${isActive(item.path) ? "text-purple-600" : "text-gray-700 hover:text-gray-900"}`}
								onClick={() => setIsMenuOpen(false)}
							>
								<Link href={item.path} className="flex items-center">
									{item.icon}
									<span className="ml-2">{item.name}</span>
								</Link>
							</Button>
						))}
						<div className="pt-6 flex flex-col space-y-4 w-full">
							<Button asChild variant="outline" className="w-full border-gray-300">
								<Link href="/login" onClick={() => setIsMenuOpen(false)}>
									<LogIn className="h-5 w-5 mr-2" /> Login
								</Link>
							</Button>
							<Button asChild className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
								<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
									Sign Up
								</Link>
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
